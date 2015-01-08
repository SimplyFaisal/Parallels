function init() {
    var query = $('#query').val();
    $.getJSON('/get', {query: query}, function(data) {
        if (!data) {
            alert('Please fill in a location!');
            return;
        }
    });
}