from flask import Flask
from main.controller import main

app = Flask(__name__)

app.register_blueprint(main)