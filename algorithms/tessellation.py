# import geojson


# geometries = [
#     ("Point", [10, 20]),
#     ("LineString", [[0, 0], [10, 10], [20, 20]]),
#     ("Polygon", [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]]),
#     ("MultiPoint", [[10, 20], [30, 40], [50, 60]]),
#     ("MultiLineString", [[[0, 0], [10, 10], [20, 20]], [[10, 10], [20, 20], [30, 30]]]),
#     ("MultiPolygon", [[[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]], [[[20, 20], [20, 30], [30, 30], [30, 20], [20, 20]]]])
#     # Add more geometries as needed
# ]
# geojson.save_geometries(geometries, "data/multiple_geometries.geojson")



import geopandas as gpd
from shapely.geometry import Polygon
import numpy as np
import json


def hexagon_tessellation(polygon_coords, resolution, output_filename):
    # Convert polygon coordinates to a Shapely Polygon
    polygon_geom = Polygon(polygon_coords[0])
    
    # Get the bounds of the input polygon
    minx, miny, maxx, maxy = polygon_geom.bounds
    
    # Calculate the size of each hexagon based on resolution
    dx = resolution * np.sqrt(3)
    dy = resolution * 3 / 2
    
    # Generate hexagon grid
    hexagons = []
    y = miny
    while y < maxy:
        x = minx
        while x < maxx:
            hexagon = [
                (x, y + resolution),
                (x + dx / 2, y + dy),
                (x + 3 * dx / 2, y + dy),
                (x + 2 * dx, y + resolution),
                (x + 3 * dx / 2, y),
                (x + dx / 2, y),
                (x, y + resolution)
            ]
            hexagons.append(hexagon)
            x += 3 * dx / 2
        y += dy
    
    # Filter hexagons inside the polygon
    hexagons_inside_polygon = []
    for hexagon in hexagons:
        hexagon_polygon = Polygon(hexagon)
        if hexagon_polygon.intersects(polygon_geom):
            hexagons_inside_polygon.append(hexagon_polygon)
    
    # Create a GeoDataFrame from hexagons inside the polygon
    hexagon_gdf = gpd.GeoDataFrame(geometry=hexagons_inside_polygon)
    
    # Save the GeoDataFrame to a GeoJSON file
    hexagon_gdf.to_file(output_filename, driver="GeoJSON")


# Example usage
polygon_coords = [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]]
resolution = 0.1  # Adjust resolution as needed
output_filename = "data/hexagon_tessellation.geojson"
hexagon_tessellation(polygon_coords, resolution, output_filename)
