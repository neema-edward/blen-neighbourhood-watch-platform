from server.app import db
from datetime import datetime

class CommunityPost(db.Model):
    __tablename__ = 'community_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_alert = db.Column(db.Boolean, default=False, nullable=False)
    
    def __init__(self, title, content, created_by, is_alert=False):
        self.title = title
        self.content = content
        self.created_by = created_by
        self.is_alert = is_alert
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'date_posted': self.date_posted.isoformat(),
            'created_by': self.created_by,
            'is_alert': self.is_alert,
            'created_by_user': self.created_by_user.to_dict() if self.created_by_user else None
        }
    
    def __repr__(self):
        return f'<CommunityPost {self.title}>'