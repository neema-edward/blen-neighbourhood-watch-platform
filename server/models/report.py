from server.app import db
from datetime import datetime
from sqlalchemy.orm import validates
import re

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date_reported = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Enum('pending', 'resolved', name='report_status'), default='pending', nullable=False)
    danger_level = db.Column(db.Enum('green', 'orange', 'red', name='danger_levels'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __init__(self, title, description, location, danger_level, user_id):
        self.title = title
        self.description = description
        self.location = location
        self.danger_level = danger_level
        self.user_id = user_id
    
    @validates('description')
    def validate_description(self, key, description):
        if len(description) < 10:
            raise ValueError('Description must be at least 10 characters long')
        return description
    
    @validates('location')
    def validate_location(self, key, location):
        if not re.match(r'^[\w\s,.-]+$', location):
            raise ValueError('Invalid location format')
        return location
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date_reported': self.date_reported.isoformat(),
            'location': self.location,
            'status': self.status,
            'danger_level': self.danger_level,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None
        }