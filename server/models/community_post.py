from server.app import db

class UserPatrol(db.Model):
    __tablename__ = 'user_patrols'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patrol_id = db.Column(db.Integer, db.ForeignKey('patrols.id'), nullable=False)
    role_in_patrol = db.Column(db.Enum('leader', 'member', name='patrol_roles'), default='member', nullable=False)
    
    def __init__(self, user_id, patrol_id, role_in_patrol='member'):
        self.user_id = user_id
        self.patrol_id = patrol_id
        self.role_in_patrol = role_in_patrol
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'patrol_id': self.patrol_id,
            'role_in_patrol': self.role_in_patrol,
            'user': self.user.to_dict() if self.user else None,
            'patrol': self.patrol.to_dict() if self.patrol else None
        }
    
    def __repr__(self):
        return f'<UserPatrol {self.user_id}-{self.patrol_id}>'