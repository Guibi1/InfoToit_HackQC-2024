import pandas as pd
import h3
import json
import numpy as np
import os.path
import sys
import copy
def get_color(score):
    min_score, max_score, midpoint = 0, 10, 0.075
    if score > midpoint:
        green_component = 255
        red_component = round(255 * (1 - (score - midpoint) / (max_score - midpoint)))
    else:
        red_component = 255
        green_component = round(255 * (score / midpoint))
    return f'#{red_component:02x}{green_component:02x}00'

def h3_to_geojson_polygon(h3_index):
    hex_boundary = h3.h3_to_geo_boundary(h3_index, geo_json=True)
    hex_boundary_list = list(hex_boundary)
    polygon = {
        "type": "Polygon",
        "coordinates": [hex_boundary_list + [hex_boundary_list[0]]]  # Close the polygon
    }
    return polygon

def geojson_to_h3_index_set(filename,resolution):
    file_path = filename
    with open(file_path, 'r') as file:
        montreal_geojson = json.load(file)

    all_h3_indexes = set()

    for feature in montreal_geojson['features']:
        geometry = feature['geometry']
        if geometry['type'] == 'Polygon':
            polygons = [geometry]
        elif geometry['type'] == 'MultiPolygon':
            polygons = [{"type": "Polygon", "coordinates": coords} for coords in geometry['coordinates']]
        
        for polygon in polygons:
            feature_h3_indexes = h3.polyfill(polygon, resolution, geo_json_conformant=True)
            all_h3_indexes.update(feature_h3_indexes)

    return all_h3_indexes

def h3_index_set_to_file(filename,indexset):

    geojson_polygons = [h3_to_geojson_polygon(index) for index in indexset]

    geojson_feature_collection = {
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "properties": {}, "geometry": poly}
            for poly in geojson_polygons
        ]
    }
    output_geojson_path = filename  # replace with your desired path
    with open(output_geojson_path, 'w') as f:
        json.dump(geojson_feature_collection, f)

    print(f"Created GeoJSON file at {output_geojson_path}")

def agregate_data(csv_path, data_studied, info_mapping, analysis=None, map_path=None, resolution=8, is_higher_better=True):
    

    valid_analysis_types = {"frequency","cut_frequency","entire_area_frequency","contained_categories","missing_categories"}
    
    # Verify analysis types are valid
    if analysis and not set(analysis).issubset(info_mapping):
        raise Exception("Analysis types not subset of info_mapping")
    
    for element in analysis or []:
        for analysis_type in analysis[element]:
            if analysis_type not in valid_analysis_types:
                raise Exception("Unknown analysis type")
    
    # Verify files exist
    if not os.path.isfile(csv_path):
        raise Exception("CSV file does not exist")
    
    if map_path and not os.path.isfile(map_path):
        raise Exception("Map GeoJSON file does not exist")
    
    # Initialize data structures
    h3_indexes = {}
    if map_path:
        h3_indexes = geojson_to_h3_index_set(map_path, resolution)
    
    df = pd.read_csv(csv_path, engine='python')
    if "LAT" not in df.columns or "LONG" not in df.columns:
        raise Exception("CSV missing LAT or LONG columns")

    for element in info_mapping:
        if info_mapping[element] not in df.columns:
            raise Exception("Mismatch in info_mapping and CSV columns")
    
    h3_index_data = {}
    for element in h3_indexes:
        h3_index_data[element] = {
            "adjacent_indexes": [],
            "h3_description": "",
            f"has_{data_studied}_info": False,
            data_studied: [],
            f"{data_studied}_count": 0,
            "area_score": 0,
            "direct_neighborhood_score": 0,
            # "h3_neighborhood_score": 0,
            "color": ""
        }
    
    # Process each row in the CSV
    for index, row in df.iterrows():
        if pd.notnull(row["LAT"]) and pd.notnull(row["LONG"]):
            h3_index = h3.geo_to_h3(row["LAT"], row["LONG"], resolution)
            element_dict = {}
            if h3_index not in h3_index_data:
                h3_index_data[h3_index] = {
                    "adjacent_indexes": [],
                    "h3_description": "",
                    f"has_{data_studied}_info": False,
                    data_studied: [],
                    f"{data_studied}_count": 0,
                    "area_score": 0,
                    "direct_neighborhood_score": 0,
                    # "h3_neighborhood_score": 0,
                    "color": ""
                }
            
            for element in info_mapping:
                if pd.notnull(row[info_mapping[element]]):
                    element_dict[element] = row[info_mapping[element]]
            h3_index_data[h3_index][data_studied].append(element_dict)
            h3_index_data[h3_index][f"{data_studied}_count"] += 1

    df.reset_index(drop=True)

    elementtotal = []
    for elements in h3_index_data:
        elementtotal.append(h3_index_data[elements][f"{data_studied}_count"])
        adjacentindex = list(h3.k_ring(elements,1))
        adjacentindex.remove(elements)
        h3_index_data[elements]["adjacent_indexes"] = adjacentindex
    
    maxcount = np.max(elementtotal)
    nonzerocount = np.count_nonzero(elementtotal)
    sum = np.sum(elementtotal)
    average = sum/nonzerocount
    midpoint = (average / maxcount) * 10
    if is_higher_better == False:
        midpoint = 10 - midpoint

    for elements in h3_index_data:
        score = (h3_index_data[elements][f"{data_studied}_count"] / maxcount) * 10
        if is_higher_better == False:
            score = 10 - score
        h3_index_data[elements]["area_score"] = score
        # colorchosen = get_color(score,midpoint)
        # h3_index_data[elements]["color"] = colorchosen

    if analysis:
        for element in analysis:
            for list_element in analysis[element]:
                if list_element == "frequency":
                    base_set = set(df[info_mapping[element]])
                    base_map = {elem: 0 for elem in base_set}
                    for h3_index in h3_index_data:
                        h3_index_data[h3_index][f"{data_studied}{list_element}"] = copy.deepcopy(base_map)
                        for element_list in h3_index_data[h3_index][data_studied]:
                            h3_index_data[h3_index][f"{data_studied}_{list_element}"][element_list[element]] = h3_index_data[h3_index][f"{data_studied}{list_element}"][element_list[element]] + 1
                elif list_element == "cut_frequency":
                    for h3_index in h3_index_data:
                        h3_index_data[h3_index][f"{data_studied}{list_element}"] = {}
                        for element_list in h3_index_data[h3_index][data_studied]:
                            if element_list[element] not in h3_index_data[h3_index][f"{data_studied}{list_element}"]:
                                h3_index_data[h3_index][f"{data_studied}{list_element}"][element_list[element]] = 0
                            h3_index_data[h3_index][f"{data_studied}_{list_element}"][element_list[element]] = h3_index_data[h3_index][f"{data_studied}{list_element}"][element_list[element]] + 1
                elif list_element == "entire_area_frequency":
                    base_set = set(df[info_mapping[element]])
                    base_map = {elem: 0 for elem in base_set}
                    for h3_index in h3_index_data:
                        for element_list in h3_index_data[h3_index][data_studied]:
                            base_map[element_list[element]] = base_map[element_list[element]] + 1
                    h3_index_data[f"{data_studied}_{list_element}"] = copy.deepcopy(base_map)
                elif list_element == "contained_categories":
                    for h3_index in h3_index_data:
                        tempset = set()
                        for element_list in h3_index_data[h3_index][data_studied]:
                            if element_list[element] not in tempset:
                                tempset.add(element_list[element])
                        h3_index_data[h3_index][f"{data_studied}_{list_element}"] = list(tempset)
                elif list_element == "missing_categories":
                    for h3_index in h3_index_data:
                        tempset = set()
                        for element_list in h3_index_data[h3_index][data_studied]:
                            if element_list[element] not in tempset:
                                tempset.add(element_list[element])
                        base_set = set(df[info_mapping[element]])
                        subtractedset = base_set - tempset
                        h3_index_data[h3_index][f"{data_studied}_{list_element}"] = list(subtractedset)

    with open("test.json", 'w') as f:
        json.dump(h3_index_data, f,indent=4)


geojsonfile = "../../data/montreal/montreal.geojson"
businessfile = '../../data/montreal/businesses_cleaned.csv'
res = 8
csvelements = "businesses"
csvelementsinfo = {
    "name": "NOM_ETAB_2023",
    "type": "USAGE2",
    "adresse": "ADRESSE"
}
csvinfotoanalyze = {
    "type": ["entire_area_frequency"],
}

agregate_data(businessfile,csvelements,csvelementsinfo, csvinfotoanalyze)




# highestbusinesscount = 0

# businesscountlist = []

# for elements in h3indexhashmap:

#     h3indexhashmap[elements]["businesscount"] = len(h3indexhashmap[elements]["businesses"])
#     businesscountlist.append(h3indexhashmap[elements]["businesscount"])
#     if (h3indexhashmap[elements]["businesscount"] > highestbusinesscount):
#         highestbusinesscount = h3indexhashmap[elements]["businesscount"]
#     adjacentindex = list(h3.k_ring(elements,1))
#     adjacentindex.remove(elements)
#     h3indexhashmap[elements]["adjacentindexes"] = adjacentindex
# print(np.sum(np.array(businesscountlist)))
# print(np.count_nonzero(np.array(businesscountlist)))

# for elements in h3indexhashmap:
#     score = (h3indexhashmap[elements]["businesscount"] / highestbusinesscount) * 10
#     h3indexhashmap[elements]["businessscore"] = score
#     colorchosen = get_color(score)
#     h3indexhashmap[elements]["color"] = colorchosen
    
# print(highestbusinesscount)

# geojson_polygons = []
# for index in set(h3indexhashmap):
#     {"type": "Feature", "properties": {}, "geometry": h3_to_geojson_polygon(index) }

#     currentdict = {"type": "Feature", "properties": {}, "geometry": h3_to_geojson_polygon(index) }
#     currentdict["properties"] = {
#         "fill": h3indexhashmap[index]["color"],
#         "stroke": h3indexhashmap[index]["color"],
#         "stroke-width": 2,
#         "stroke-opacity": 1,
#         "fill-opacity": 0.5
#       }
#     geojson_polygons.append(currentdict)

# # Wrap the polygons in a FeatureCollection
# geojson_feature_collection = {
#     "type": "FeatureCollection",
#     "features": geojson_polygons}


# # Save the GeoJSON FeatureCollection to a file
# output_geojson_path = "test.geojson"  # replace with your desired path
# with open(output_geojson_path, 'w') as f:
#     json.dump(geojson_feature_collection, f)

# print(f"Created GeoJSON file at {output_geojson_path}")

