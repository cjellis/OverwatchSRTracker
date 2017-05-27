from flask import Blueprint, make_response, request, jsonify
import json
import database.controller as db

main = Blueprint('main', __name__, template_folder='templates')

@main.route('/', methods=['GET'])
def home():
    return make_response(open('app/templates/index.html').read())

@main.route('/addEntry', methods=['POST'])
def addEntry():
    print(request.data)
    data = json.loads(request.data.decode())
    db.add_entry(
        data['user'],
        data['type'],
        data['map'],
        data['characters'],
        data['result'],
        data['sr'],
        data['notes'],
        data['time']
    )
    return "200"

@main.route('/getData', methods=['POST'])
def getData():
    data = json.loads(request.data.decode())
    res = db.get_data(data['user'])
    return jsonify(res)