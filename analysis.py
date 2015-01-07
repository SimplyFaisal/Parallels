from config import GOOGLE_API_KEY, YIKYAK_USER_ID, SCHOOLS
from vaderSentiment.vaderSentiment import sentiment
import json

def sentiment_analysis(yaks):
    results = {}
    for yak in yaks:
        school = yak['school']
        if school not in results:
            results[yak['school']] = {
                'neg': 0.0,
                'neu': 0.0,
                'pos': 0.0,
                'compound': 0.0
            }
        try:
            data = sentiment(yak['message'])
            for key, value in data.iteritems():
                results[school][key] += value
        except UnicodeEncodeError:
            pass
    return [{school:stats} for school , stats in results.iteritems()]
