import json
import csv

# Assuming the structure of your GeoJSON file matches the one provided
geojson_file = '../data/montreal/stm_arrets.json'  # Update this to your GeoJSON file path
with open(geojson_file, 'r') as f:
    geojson_data = json.load(f)

csv_file = '../data/montreal/stm_arrets_coords.csv'  # Update this to your desired output CSV file path
with open(csv_file, 'w', newline='') as csvfile:
    fieldnames = ['LAT', 'LONG']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    # Extract points and write to CSV
    for feature in geojson_data['geometries']:
        if feature['type'] == 'Point':
            longitude, latitude = feature['coordinates']
            writer.writerow({'LAT': latitude, 'LON': longitude})
