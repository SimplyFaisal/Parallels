from flask import Flask, json, render_template
from config import GOOGLE_API_KEY, YIKYAK_USER_ID, SCHOOLS
from analysis import sentiment_analysis
from yy import get_location, get_yaks
import json


app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/schools')
def get_schools():
    yaks = get_yaks(SCHOOLS)
    sentiment_data = sentiment_analysis(yaks)
    return json.dumps(sentiment_data)


if __name__ == "__main__":
    app.run(debug=True)