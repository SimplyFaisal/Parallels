from flask import Flask, json, render_template, request
from config import GOOGLE_API_KEY, YIKYAK_USER_ID
from analysis import sentiment_analysis
from yy import get_location, get_yaks


app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/get')
def get_sentiment_analysis():
    query = request.args.get('query')
    if not query:
        return ""
    location  = get_location(query)
    yaks = get_yaks(location)
    sentiments = sentiment_analysis(yaks)
    return json.dumps(sentiments)
    
if __name__ == "__main__":
    app.run(debug=True)