function graph() {

    var sentiments = ['positive', 'neutral', 'negative', 'compound'];

    // Dimensions
    var m = [80, 160, 200, 160];
    var w = window.innerWidth - m[1] - m[3];
    var h = window.innerHeight - m[0] - m[2];

    var x = d3.scale.ordinal().domain(sentiments).rangePoints([0, w]);
    var y = {};

    
    var line = d3.svg.line();
    var axis = d3.svg.axis().orient("left");
    var foreground;

    var svg = d3.select("#chart").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


    var query = document.getElementById('query').value;
    if (!query) {
        alert('Please specify a location');
        return;
    }

    d3.json('/get?query=' + query, function(data) {

        sentiments.forEach(function(d) {
            y[d] = d3.scale.linear().domain(d3.extent(data, function(p) {
                    return p[d];
                })).range([h, 0]);

            y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush);
        });

        var strokeScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
                return d.compound;
            })])
            .range([100, 800]);

        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("svg:path")
            .attr("d", path)
            .attr('stroke', function(d) {
                return '#200';
            });
            

        // Add a group element for each trait.
        var g = svg.selectAll(".trait")
            .data(sentiments)
            .enter().append("svg:g")
            .attr("class", "trait")
            .attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            })
            .call(d3.behavior.drag()
                .origin(function(d) {
                    return {
                        x: x(d)
                    };
                })
                .on("dragstart", dragstart)
                .on("drag", drag)
                .on("dragend", dragend));

        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function(d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(y[d].brush);
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    });

    function dragstart(d) {
        i = sentiments.indexOf(d);
    }

    function drag(d) {
        x.range()[i] = d3.event.x;
        sentiments.sort(function(a, b) { return x(a) - x(b); });
        g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        foreground.attr("d", path);
    }

    function dragend(d) {
        x.domain(sentiments).rangePoints([0, w]);
        var t = d3.transition().duration(500);
        t.selectAll(".trait").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        t.selectAll(".foreground path").attr("d", path);
    }
    
    function path(d) {
        return line(sentiments.map(function(p) {
            return [x(p), y[p](d[p])];
        }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = sentiments.filter(function(p) { return !y[p].brush.empty(); }),
          extents = actives.map(function(p) { return y[p].brush.extent(); });
      foreground.classed("fade", function(d) {
        return !actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        });
      });
    }
}