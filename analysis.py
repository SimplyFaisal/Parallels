from config import GOOGLE_API_KEY, YIKYAK_USER_ID
from vaderSentiment.vaderSentiment import sentiment

def sentiment_analysis(yaks):
    data = []
    for yak in yaks:
        try:
            result = sentiment(yak['message'])

            # Replacing the key names so it will be compatible with
            # the D3 code on the front end
            result['positive'] = result.pop('pos')
            result['neutral'] = result.pop('neu')
            result['negative'] = result.pop('neg')
            data.append(result)
        except UnicodeEncodeError:
            pass

    return data
