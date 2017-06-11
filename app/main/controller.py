from flask import Blueprint, make_response, request, jsonify
import json
import database.controller as db

main = Blueprint('main', __name__, template_folder='templates')

@main.route('/', methods=['GET'])
def root():
    return make_response(open('app/templates/login.html').read())


@main.route('/home', methods=['GET'])
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


@main.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data.decode())
    res = db.get_data(data['user'])
    if res:
        return "200"
    else:
        return "Failed to find user", 400


@main.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data.decode())
    user = data['user']
    sr = data['sr']
    db.add_user(user, sr)
    return "registered"