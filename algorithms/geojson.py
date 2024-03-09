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


def extract_lines(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    lines = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'LineString':
            coordinates = feature['geometry']['coordinates']
            lines.append(coordinates)

    return lines


def extract_multi_points(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    multi_points = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'MultiPoint':
            coordinates = feature['geometry']['coordinates']
            multi_points.append(coordinates)

    return multi_points


def extract_multi_lines(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    multi_lines = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'MultiLineString':
            coordinates = feature['geometry']['coordinates']
            multi_lines.append(coordinates)

    return multi_lines


def extract_multi_polygons(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    multi_polygons = []
    for feature in data['features']:
        if feature['geometry']['type'] == 'MultiPolygon':
            coordinates = feature['geometry']['coordinates']
            multi_polygons.append(coordinates)

    return multi_polygons


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

    
def extract_data(geojson_file):
    points = []
    polygons = []
    lines = []
    multi_points = []
    multi_lines = []
    multi_polygons = []

    with open(geojson_file) as f:
        data = json.load(f)

    for feature in data['features']:
        if feature['geometry']['type'] == 'Point':
            coordinates = feature['geometry']['coordinates']
            points.append(coordinates)
        elif feature['geometry']['type'] == 'Polygon':
            coordinates = feature['geometry']['coordinates']
            polygons.append(coordinates)
        elif feature['geometry']['type'] == 'LineString':
            coordinates = feature['geometry']['coordinates']
            lines.append(coordinates)
        elif feature['geometry']['type'] == 'MultiPoint':
            coordinates = feature['geometry']['coordinates']
            multi_points.append(coordinates)
        elif feature['geometry']['type'] == 'MultiLineString':
            coordinates = feature['geometry']['coordinates']
            multi_lines.append(coordinates)
        elif feature['geometry']['type'] == 'MultiPolygon':
            coordinates = feature['geometry']['coordinates']
            multi_polygons.append(coordinates)
        else: 
            print("RIP I SUCK AT CODING")
        

    return points, polygons, lines, multi_points, multi_lines, multi_polygons



if __name__ == "__main__":
    points = extract_points('data/point.geojson')
    polygons = extract_polygons('data/polygon.geojson')
    lines = extract_lines('data/line.geojson')
    multi_points = extract_multi_points('data/multi_point.geojson')
    multi_lines = extract_multi_lines('data/multi_line.geojson')
    multi_polygons = extract_multi_polygons('data/multi_polygon.geojson')

    print("Extracted points:")
    for point in points:
        print(point)

    print("\nExtracted polygons:")
    for polygon in polygons:
        print(polygon)

    print("\nExtracted lines:")
    for line in lines:
        print(line)

    print("\nExtracted multi points:")
    for mp in multi_points:
        print(mp)

    print("\nExtracted multi lines:")
    for ml in multi_lines:
        print(ml)

    print("\nExtracted multi polygons:")
    for mpoly in multi_polygons:
        print(mpoly)

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
