import h3
import json

def h3_to_geojson_polygon(h3_index):
    hex_boundary = h3.h3_to_geo_boundary(h3_index)
    coordinates = [[lng, lat] for lat, lng in hex_boundary]
    coordinates.append(coordinates[0])  # Close the polygon
    polygon = {
        "type": "Polygon",
        "coordinates": [coordinates]
    }
    return polygon

# Read the input GeoJSON file
with open('data/polygon.geojson', 'r') as f:
    input_geojson = json.load(f)

# Extract the polygon coordinates
polygon_coordinates = input_geojson['features'][0]['geometry']
# Generate H3 hexagons covering the polygon
resolution = 5  # Adjust the resolution as needed
h3_indexes = h3.polyfill(polygon_coordinates, resolution)

# Convert H3 indexes to GeoJSON polygons
geojson_features = []
for h3_index in h3_indexes:
    geojson_polygon = h3_to_geojson_polygon(h3_index)
    feature = {
        "type": "Feature",
        "properties": {},
        "geometry": geojson_polygon
    }
    geojson_features.append(feature)

# Create a new GeoJSON file with H3 hexagon grid polygons
output_geojson = {
    "type": "FeatureCollection",
    "features": geojson_features
}

# Write the output GeoJSON file
with open('output.geojson', 'w') as f:
    json.dump(output_geojson, f)
