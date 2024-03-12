import json
from h3 import h3
from xata.client import XataClient
from dotenv import load_dotenv

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



points = extract_data("backend/adresses/montreal/adresses.geojson")

values = {}
for point in points:
    index = get_h3_index(point, 9)
    if index in values:
        values[index] += 1
    else: 
        values[index] = 1

print(values)


load_dotenv() 
xata = XataClient()


for idH3 in values:
    data = xata.records().upsert("MapData", idH3, {
        "numberOfAddresses": values[idH3]
    })

print("DONE")