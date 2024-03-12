from h3 import h3
import json
import argparse
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


def format_data(filepath, resolution):
    points = extract_data(filepath)

    values = {}
    for point in points:
        index = get_h3_index(point, resolution)
        if index in values:
            values[index] += 1
        else:
            values[index] = 1

    return values


def geojson_points_to_database(filepath, table, column, resolution):

    load_dotenv()
    xata = XataClient()

    values = format_data(filepath, resolution)
    
    # for progress
    total = len(values)
    current = 0
    
    for id_h3 in values:
        current += 1
        data = xata.records().upsert(table, id_h3, {
            column: values[id_h3]
        })
        print(f"Progress: ( {current} / {total} )")

    print("UPLOAD COMPLETED")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Processes a GeoJSON file, extracts point features, converts their coordinates to H3 indexes at a specified resolution, and uploads the counts of these indexes to a database')
    parser.add_argument('--filepath', required=True,
                        help='Path to the GeoJSON file containing points.')
    parser.add_argument('--table', required=True,
                        help='Name of table in database')
    parser.add_argument('--column', required=True,
                        help='Name of column in table')
    parser.add_argument('--resolution', type=int, default=9,
                        help='H3 resolution for the analysis (0 to 15), default 9')
    args = parser.parse_args()

    geojson_points_to_database(
        filepath=args.filepath, table=args.table, column=args.column, resolution=args.resolution)
