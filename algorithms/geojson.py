import json


def extract_points(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    points = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'Point':
            coordinates = feature['geometry']['coordinates']
            points.append(coordinates)

    return points


def extract_polygons(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    polygons = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'Polygon':
            coordinates = feature['geometry']['coordinates']
            polygons.append(coordinates)

    return polygons


def save_geometries(geometries, filename):
    features = []
    for geometry_type, coordinates in geometries:
        geometry = {
            "type": geometry_type,
            "coordinates": coordinates
        }

        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": geometry
        }
        features.append(feature)

    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(filename, 'w') as f:
        json.dump(feature_collection, f, indent=4)


if __name__ == "__main__":

    points = extract_points('data/point.geojson')
    polygons = extract_polygons('data/polygon.geojson')

    print("Extracted points:")
    for point in points:
        print(point)

    print("\nExtracted polygons:")
    for polygon in polygons:
        print(polygon)


if __name__ == "__main__":
    # Example usage
    geometries = [
        ("Point", [10, 20]),
        ("LineString", [[0, 0], [10, 10], [20, 20]]),
        ("Polygon", [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]]),
        ("MultiPoint", [[10, 20], [30, 40], [50, 60]]),
        ("MultiLineString", [[[0, 0], [10, 10], [20, 20]], [[10, 10], [20, 20], [30, 30]]]),
        ("MultiPolygon", [[[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]], [[[20, 20], [20, 30], [30, 30], [30, 20], [20, 20]]]])
        # Add more geometries as needed
    ]
    save_geometries(geometries, "data/multiple_geometries.geojson")