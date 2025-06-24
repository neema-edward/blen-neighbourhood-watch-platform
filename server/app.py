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

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///neighborhood_watch.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    from server.models import User, Report, Patrol, UserPatrol, CommunityPost, SecurityDog

    from server.controllers.auth_controller import auth_bp
    from server.controllers.report_controller import report_bp
    from server.controllers.patrol_controller import patrol_bp
    from server.controllers.community_controller import community_bp
    from server.controllers.dog_controller import dog_bp
    from server.controllers.stats_controller import stats_bp
        
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(report_bp, url_prefix='/api')
    app.register_blueprint(patrol_bp, url_prefix='/api')
    app.register_blueprint(community_bp, url_prefix='/api')
    app.register_blueprint(dog_bp, url_prefix='/api')
    app.register_blueprint(stats_bp, url_prefix='/api')