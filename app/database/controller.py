from pymongo import MongoClient

client = MongoClient("mongodb://owsr:owsr123@ds137760.mlab.com:37760/owtracker")
db = client.owtracker
user_data = db.user_data

def add_entry(user, type, map, characters, result, sr, notes, time):
    data = user_data.find_one({'user': user})
    results = data['results']
    latest_sr = results[len(results)-1]["sr"]
    res = {
        'type': type,
        'map': map,
        "characters": characters,
        "result": result,
        "sr": sr,
        "sr_change": sr - int(latest_sr),
        "notes": notes,
        "time": time
    }

    user_data.update_one({'user': user}, {'$push': {'results': res}})


def get_data(user):
    data = user_data.find_one({'user': user}, {"_id": 0})
    return data


def add_user(user, sr):
    res = {
        'type': '',
        'map': '',
        "characters": [],
        "result": '',
        "sr": int(sr),
        "sr_change": 0,
        "notes": '',
        "time": ''
    }

    user_data.insert({'user': user, 'results': [res]})
