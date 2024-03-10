import pandas as pd
import h3
import json
import numpy as np
def get_color(score):
    # Define the range and midpoint
    min_score, max_score, midpoint = 0, 10, 0.075
    # Calculate the proportion of the score in relation to the midpoint
    if score > midpoint:
        # For scores above the midpoint, we transition from yellow to green
        green_component = 255
        red_component = round(255 * (1 - (score - midpoint) / (max_score - midpoint)))
    else:
        # For scores below the midpoint, we transition from red to yellow
        red_component = 255
        green_component = round(255 * (score / midpoint))
    return f'#{red_component:02x}{green_component:02x}00'


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

resolution = 9
h3indexset = geojson_to_h3_index_set("../../data/montreal/montreal.geojson",resolution)
df = pd.read_csv('../../data/montreal/businesses_cleaned.csv')

businesstypes = set(df["USAGE3"])

h3indexhashmap = {}

for element in h3indexset:
    h3indexhashmap[element] = {"adjacentindexes": [], "description": "", "hasbusinessinfo": False ,"businesses": [], "businesscount": 0}

for index, row in df.iterrows():
    h3index = h3.geo_to_h3(row["LAT"], row["LONG"],resolution)
    businessdict = {
                    "name": row["NOM_ETAB_2023"],
                    "type": row["USAGE3"],
                    "adresse": row["ADRESSE"],
                    "coordinates": [row["LAT"], row["LONG"]]
                    }
    
    if h3index in h3indexhashmap:
        h3indexhashmap[h3index]["businesses"].append(businessdict)
        h3indexhashmap[h3index]["hasbusinessinfo"] = True

    else: 
        h3indexhashmap[h3index] = {"description": "", "businesses": [], "businesscount": 0}
        h3indexhashmap[h3index]["businesses"].append(businessdict)
        h3indexhashmap[h3index]["hasbusinessinfo"] = True
highestbusinesscount = 0

businesscountlist = []

for elements in h3indexhashmap:

    h3indexhashmap[elements]["businesscount"] = len(h3indexhashmap[elements]["businesses"])
    businesscountlist.append(h3indexhashmap[elements]["businesscount"])
    if (h3indexhashmap[elements]["businesscount"] > highestbusinesscount):
        highestbusinesscount = h3indexhashmap[elements]["businesscount"]
    adjacentindex = list(h3.k_ring(elements,1))
    adjacentindex.remove(elements)
    h3indexhashmap[elements]["adjacentindexes"] = adjacentindex
print(np.sum(np.array(businesscountlist)))
print(np.count_nonzero(np.array(businesscountlist)))

for elements in h3indexhashmap:
    score = (h3indexhashmap[elements]["businesscount"] / highestbusinesscount) * 10
    h3indexhashmap[elements]["businessscore"] = score
    colorchosen = get_color(score)
    h3indexhashmap[elements]["color"] = colorchosen
    
print(highestbusinesscount)

geojson_polygons = []
for index in set(h3indexhashmap):
    {"type": "Feature", "properties": {}, "geometry": h3_to_geojson_polygon(index) }

    currentdict = {"type": "Feature", "properties": {}, "geometry": h3_to_geojson_polygon(index) }
    currentdict["properties"] = {
        "fill": h3indexhashmap[index]["color"],
        "stroke": h3indexhashmap[index]["color"],
        "stroke-width": 2,
        "stroke-opacity": 1,
        "fill-opacity": 0.5
      }
    geojson_polygons.append(currentdict)

# Wrap the polygons in a FeatureCollection
geojson_feature_collection = {
    "type": "FeatureCollection",
    "features": geojson_polygons}


# Save the GeoJSON FeatureCollection to a file
output_geojson_path = "test.geojson"  # replace with your desired path
with open(output_geojson_path, 'w') as f:
    json.dump(geojson_feature_collection, f)

print(f"Created GeoJSON file at {output_geojson_path}")

