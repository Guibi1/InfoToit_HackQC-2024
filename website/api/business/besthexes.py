from http.server import BaseHTTPRequestHandler
import h3
from xata.client import XataClient
import json
from dotenv import load_dotenv
from xata.client import XataClient

import os



def bestbusinesshex(lat, long, type):

    return "LOL"
    load_dotenv()
    db_url_env = os.environ.get("XATA_DATABASE_URL")
    api_key_env = os.environ.get("XATA_API_KEY")
    xata = XataClient(db_url=db_url_env,
                    api_key=api_key_env)
    centerhex = h3.geo_to_h3(lat, long, 8)
    print(centerhex)
    surroundinghexes = h3.k_ring(centerhex, 2)
    print(len(surroundinghexes))
    listhex = []

    for hexes in surroundinghexes:
        try:
            resp = xata.records().get("BusinessAnalysis", hexes)
            assert resp.is_success()
            listhex.append(resp)
        except:
            print("Error retrieving or processing hex")

    print(f"Total hexes processed: {len(listhex)}")

    dontcontainlist = {}
    for listhexelement in listhex:
        contained = json.loads(listhexelement["contained"])
        if type in contained["missing"]:
            dontcontainlist[listhexelement["id"]] = {
                "score": listhexelement["score"],
                "neighborhoodscore": listhexelement["neighborhoodscore"]
            }

    # Sorting based on score and selecting top 3
    top_three_hexes = sorted(dontcontainlist.items(), key=lambda item: (item[1]['score'], item[1]['neighborhoodscore']), reverse=True)[:3]

    # Return only the IDs of the top 3 hexes
    return [hex_id for hex_id, _ in top_three_hexes]

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        received_data = json.loads(post_data.decode('utf-8'))
        lat = received_data.get("lat")
        long = received_data.get("long")
        type = received_data.get("type")
        result = bestbusinesshex(lat, long,type)
        answer = json.dumps({'hexes': result})

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(answer.encode('utf-8'))