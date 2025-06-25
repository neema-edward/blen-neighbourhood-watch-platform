from server.app import db

class SecurityDog(db.Model):
    __tablename__ = 'security_dogs'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    company = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Enum('available', 'assigned', name='dog_status'), default='available', nullable=False)
    
    def __init__(self, name, company, assigned_to=None, status='available'):
        self.name = name
        self.company = company
        self.assigned_to = assigned_to
        self.status = status
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'assigned_to': self.assigned_to,
            'company': self.company,
            'status': self.status,
            'assigned_to_user': self.assigned_to_user.to_dict() if self.assigned_to_user else None
        }
    
    def __repr__(self):
        return f'<SecurityDog {self.name}>'