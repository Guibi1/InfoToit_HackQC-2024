import pandas as pd
import h3
import json
import numpy as np
import os.path
import sys
import getopt
import argparse

def get_color(score,midpoint,colorinverse=False):

    
    # Define the range and midpoint
    min_score, max_score = 0, 10
    if colorinverse:
        score=max_score-score
        midpoint = max_score-midpoint
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

def density_visualization(densityfile,mapfile=None,resolution=8,colorinverse=False):
    try: 
        
        if not os.path.isfile(densityfile):
            raise Exception("Density csv does not exist")
        if mapfile != None:
            if not os.path.isfile(mapfile):
                raise Exception("Map geojson does not exist")
        h3indexset = {}
        if mapfile != None:
            h3indexset = geojson_to_h3_index_set(mapfile,resolution)
        
        df = pd.read_csv(densityfile)

        if "LAT" not in df.columns or "LONG" not in df.columns:
            raise Exception("Improperly formated csv")

        h3indexhashmap = {}

        for element in h3indexset:
            h3indexhashmap[element] = {"adjacentindexes": [], "elementcount": 0, "score": 0, "color": ""}

        for index, row in df.iterrows():
            if not(pd.isnull(row["LAT"])) and not(pd.isnull(row["LONG"])):

                h3index = h3.geo_to_h3(row["LAT"], row["LONG"],resolution)
                if h3index not in h3indexhashmap:
                    h3indexhashmap[h3index] = {"adjacentindexes": [], "elementcount": 0}
                h3indexhashmap[h3index]["elementcount"] = h3indexhashmap[h3index]["elementcount"] + 1

        elementtotal = []
        for elements in h3indexhashmap:
            elementtotal.append(h3indexhashmap[elements]["elementcount"])
            adjacentindex = list(h3.k_ring(elements,1))
            adjacentindex.remove(elements)
            h3indexhashmap[elements]["adjacentindexes"] = adjacentindex

        maxcount = np.max(elementtotal)
        nonzerocount = np.count_nonzero(elementtotal)
        sum = np.sum(elementtotal)
        average = sum/nonzerocount
        midpoint = (average / maxcount) * 10

        for elements in h3indexhashmap:
            score = (h3indexhashmap[elements]["elementcount"] / maxcount) * 10
            h3indexhashmap[elements]["score"] = score
            colorchosen = get_color(score,midpoint,colorinverse)
            h3indexhashmap[elements]["color"] = colorchosen
            

        geojson_polygons = []
        for index in set(h3indexhashmap):
            {"type": "Feature", "properties": {}, "geometry": h3_to_geojson_polygon(index) }

            currentdict = {"type": "Feature", "properties": {}, "geometry": h3_to_geojson_polygon(index) }
            currentdict["properties"] = {
                "fill": h3indexhashmap[index]["color"],
                "stroke": h3indexhashmap[index]["color"],
                "stroke-width": 2,
                "stroke-opacity": 1,
                "fill-opacity": 0.5,
                "elementcount": h3indexhashmap[index]["elementcount"]
            }
            geojson_polygons.append(currentdict)

        # Wrap the polygons in a FeatureCollection
        geojson_feature_collection = {
            "type": "FeatureCollection",
            "features": geojson_polygons}


        # Save the GeoJSON FeatureCollection to a file
        filenamein = densityfile.replace(".csv","")
        output_geojson_path = filenamein + f'_h3_visualization_res_{resolution}.json'  # replace with your desired path
        with open(output_geojson_path, 'w') as f:
            json.dump(geojson_feature_collection, f)

        print(f"Created GeoJSON file at {output_geojson_path}")

    except Exception as e:
        print(e)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Visualize business density using H3 and GeoJSON.')
    parser.add_argument('--densityfile', required=True, help='Path to the CSV file containing locations.')
    parser.add_argument('--mapfile', default=None, help='Optional path to the GeoJSON file defining the area of interest.')
    parser.add_argument('--resolution', type=int, default=8, help='H3 resolution for the analysis (0 to 15).')
    parser.add_argument('--colorinverse', default='false', choices=['true', 'false'], help='Inverse colors from green to red')    
    args = parser.parse_args()
    incolorinverse = True if args.colorinverse == 'true' else False
    density_visualization(densityfile=args.densityfile, mapfile=args.mapfile, resolution=args.resolution, colorinverse=incolorinverse)





