from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()