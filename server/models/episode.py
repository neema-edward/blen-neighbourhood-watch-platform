from app import db

class Episode(db.Model):
    __tablename__ = 'episodes'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    number = db.Column(db.Integer, nullable=False, unique=True)
    
    appearances = db.relationship('Appearance', backref='episode', lazy=True, cascade='all, delete-orphan')
    
def __init__(self, date, number):
        self.date = date
        self.number = number
    
def to_dict(self, include_appearances=False):
        episode_dict = {
            'id': self.id,
            'date': self.date.isoformat(),
            'number': self.number
        }
        
        if include_appearances:
            episode_dict['appearances'] = [appearance.to_dict() for appearance in self.appearances]
        
        return episode_dict

def __repr__(self):
        return f'<Episode {self.number}>'