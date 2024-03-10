import json
from h3 import h3


def extract_data(geojson_file):
    points = []
    with open(geojson_file) as f:
        data = json.load(f)

    for feature in data['features']:
        if feature['geometry']['type'] == 'Point':
            coordinates = feature['geometry']['coordinates']
            points.append(coordinates)
    return points


def get_h3_index(point, resolution):
    lon = point[0]
    lat = point[1]
    h3_index = h3.geo_to_h3(lat, lon, resolution)
    return h3_index


points = extract_data("data/longueuil/arbres.json")

hm = {}
for point in points:
    index = get_h3_index(point, 7)
    if index in hm:
        hm[index] += 1
    else: 
        hm[index] = 1

print(hm)

