from config import GOOGLE_API_KEY, YIKYAK_USER_ID
from vaderSentiment.vaderSentiment import sentiment

def sentiment_analysis(yaks):
    data = []
    for yak in yaks:
        try:
            result = sentiment(yak['message'])
            data.append(result)
        except UnicodeEncodeError:
            pass
    return data
