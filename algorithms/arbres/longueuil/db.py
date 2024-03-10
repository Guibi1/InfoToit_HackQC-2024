from xata.client import XataClient
import os
from dotenv import load_dotenv


load_dotenv()
db_url = os.getenv("XATA_DB_URL")
db_api_key = os.getenv("XATA_API_KEY")

xata = XataClient(db_api_key, db_url) 

data = xata.data().query("GridH3", {
    "columns": [
        "indexH3"
    ]
})
print(data)