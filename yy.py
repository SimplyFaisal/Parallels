from api import Location, PeekLocation, Yakker
from config import GOOGLE_API_KEY, YIKYAK_USER_ID, SCHOOLS
import json
from pygeocoder import Geocoder


def get_location(school_name):
    geo_coder = Geocoder(api_key=GOOGLE_API_KEY)
    latitude , longitude = geo_coder.geocode(address=school_name).coordinates
    return Location(latitude, longitude)


def get_yaks(schools):
    yaks = []
    for school in schools:
        coordinates = get_location(school)
        messages = Yakker(YIKYAK_USER_ID, coordinates, False).get_yaks()
        for message in messages:
            # Add the school tag to the yaks
            message['school'] = school
            yaks.append(message)
    return yaks
