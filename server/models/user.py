from server.app import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import validates
import re

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.Enum('resident', 'admin', name='user_roles'), default='resident', nullable=False)

    reports = db.relationship('Report', backref='user', lazy=True, cascade='all, delete-orphan')
    user_patrols = db.relationship('UserPatrol', backref='user', lazy=True, cascade='all, delete-orphan')
    community_posts = db.relationship('CommunityPost', backref='created_by_user', lazy=True, cascade='all, delete-orphan')
    assigned_dog = db.relationship('SecurityDog', backref='assigned_to_user', lazy=True, uselist=False)

    def __init__(self, username, email, password, role='resident'):
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }

    def __repr__(self):
        return f'<User {self.username}>'