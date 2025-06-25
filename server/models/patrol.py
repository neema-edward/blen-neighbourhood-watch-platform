from server.app import db
from datetime import datetime

class Patrol(db.Model):
    __tablename__ = 'patrols'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    
    # Relationships
    user_patrols = db.relationship('UserPatrol', backref='patrol', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, name, description, scheduled_time, location):
        self.name = name
        self.description = description
        self.scheduled_time = scheduled_time
        self.location = location
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'scheduled_time': self.scheduled_time.isoformat(),
            'location': self.location,
            'member_count': len(self.user_patrols)
        }
    
    def __repr__(self):
        return f'<Patrol {self.name}>'