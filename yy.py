from api import Location, PeekLocation, Yakker
from config import GOOGLE_API_KEY, YIKYAK_USER_ID
import json
from pygeocoder import Geocoder


def get_location(query):
    geo_coder = Geocoder(api_key=GOOGLE_API_KEY)
    latitude , longitude = geo_coder.geocode(address=query).coordinates
    return Location(latitude, longitude)


def get_yaks(location):
    return Yakker(YIKYAK_USER_ID, location, False).get_yaks()
