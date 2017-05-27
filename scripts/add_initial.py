from pymongo import MongoClient

client = MongoClient("mongodb://owsr:owsr123@ds137760.mlab.com:37760/owtracker")
db = client.owtracker
user_data = db.user_data
user_data.remove({})
res = {
    'type': '',
    'map': '',
    "characters": [],
    "result": '',
    "sr": 1780,
    "sr_change": 0,
    "notes": '',
    "time": ''
}

user_data.insert({'user': 'craig', 'results': [res]})