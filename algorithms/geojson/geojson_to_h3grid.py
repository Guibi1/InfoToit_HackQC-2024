import h3
import json

# Function to convert an H3 index to a GeoJSON polygon
def h3_to_geojson_polygon(h3_index):
    hex_boundary = h3.h3_to_geo_boundary(h3_index, geo_json=True)
    # Ensure hex_boundary is a list for concatenation
    hex_boundary_list = list(hex_boundary)
    # Now concatenate using lists
    polygon = {
        "type": "Polygon",
        "coordinates": [hex_boundary_list + [hex_boundary_list[0]]]  # Close the polygon
    }
    return polygon

def h3_index_set_to_file(filename,indexset):

    geojson_polygons = [h3_to_geojson_polygon(index) for index in indexset]

    # Wrap the polygons in a FeatureCollection
    geojson_feature_collection = {
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "properties": {}, "geometry": poly}
            for poly in geojson_polygons
        ]
    }
    # Save the GeoJSON FeatureCollection to a file
    output_geojson_path = filename  # replace with your desired path
    with open(output_geojson_path, 'w') as f:
        json.dump(geojson_feature_collection, f)

    print(f"Created GeoJSON file at {output_geojson_path}")

def geojson_to_h3_index_set(filename,resolution):
    # Load the Montreal GeoJSON to create the boundary shape for the H3 polyfill function
    file_path = filename # replace with your file path
    with open(file_path, 'r') as file:
        montreal_geojson = json.load(file)

    # Initialize an empty set to store unique H3 indexes for all polygons
    all_h3_indexes = set()

    # Iterate over each feature in the GeoJSON file
    for feature in montreal_geojson['features']:
        geometry = feature['geometry']
        if geometry['type'] == 'Polygon':
            polygons = [geometry]
        elif geometry['type'] == 'MultiPolygon':
            polygons = [{"type": "Polygon", "coordinates": coords} for coords in geometry['coordinates']]
        
        # Apply polyfill to each Polygon
        for polygon in polygons:
            feature_h3_indexes = h3.polyfill(polygon, resolution, geo_json_conformant=True)
            all_h3_indexes.update(feature_h3_indexes)

    return all_h3_indexes
    # Convert all H3 indexes to GeoJSON polygons

def geojson_file_to_h3_geojson(filename,resolution):
    
    
    filenamein = filename.replace(".geojson","")
    output_geojson_path = filenamein + f'_h3_tessellation_res_{resolution}.json'  # replace with your desired path

    indexset = geojson_to_h3_index_set(filename,resolution)
    h3_index_set_to_file(output_geojson_path,indexset)
    
    



geojson_file_to_h3_geojson('..\..\data\montreal\\arrondissements.geojson',9)