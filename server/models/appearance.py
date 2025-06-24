from app import db
from sqlalchemy.orm import validates

class Appearance(db.Model):
    __tablename__ = 'appearances'
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'), nullable=False)
    episode_id = db.Column(db.Integer, db.ForeignKey('episodes.id'), nullable=False)
    
    def __init__(self, rating, guest_id, episode_id):
        self.rating = rating
        self.guest_id = guest_id
        self.episode_id = episode_id
    
    @validates('rating')
    def validate_rating(self, key, rating):
        if not (1 <= rating <= 5):
            raise ValueError('Rating must be between 1 and 5')
        return rating

    def to_dict(self):
        return {
            'id': self.id,
            'rating': self.rating,
            'guest_id': self.guest_id,
            'episode_id': self.episode_id,
            'guest': self.guest.to_dict() if self.guest else None,
            'episode': {
                'id': self.episode.id,
                'date': self.episode.date.isoformat(),
                'number': self.episode.number
            } if self.episode else None
        }

    def __repr__(self):
        return f'<Appearance {self.id}>'