import json
from xata.client import XataClient
from dotenv import load_dotenv
import h3

def h3_to_geojson_polygon(h3_index):
    hex_boundary = h3.h3_to_geo_boundary(h3_index, geo_json=True)
    hex_boundary_list = list(hex_boundary)
    polygon = {
        "type": "Polygon",
        "coordinates": [hex_boundary_list + [hex_boundary_list[0]]]  # Close the polygon
    }
    return polygon


def generate_GeoJSON(ids):
    geojson_polygons = [h3_to_geojson_polygon(id) for id in ids]

    # Wrap the polygons in a FeatureCollection
    geojson_feature_collection = {
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "properties": {}, "geometry": poly}
            for poly in geojson_polygons
        ]
    }
    with open("data/yoyoyo.json", 'w') as f:
            json.dump(geojson_feature_collection, f)


def get_h3_indexes():

    load_dotenv()
    xata = XataClient()

    data = xata.data().query("MapData", {
    "columns": [
        "numberOfTrees"
    ]
    })
    assert data.is_success()

    ids = []

    for record in data["records"]:
        ids.append(record['id'])

    return ids




if __name__ == "__main__":

    h3_ids = get_h3_indexes()
    generate_GeoJSON(h3_ids)
    print("fini")