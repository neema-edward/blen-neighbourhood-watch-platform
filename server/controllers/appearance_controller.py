from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from models.appearance import Appearance
from models.guest import Guest
from models.episode import Episode

appearance_bp = Blueprint('appearances', __name__)

@appearance_bp.route('/appearances', methods=['POST'])
@jwt_required()
def create_appearance():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['rating', 'guest_id', 'episode_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate rating range
        rating = data['rating']
        if not isinstance(rating, int) or not (1 <= rating <= 5):
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
        
        # Validate guest exists
        guest = Guest.query.get(data['guest_id'])
        if not guest:
            return jsonify({'error': 'Guest not found'}), 404
        
        # Validate episode exists
        episode = Episode.query.get(data['episode_id'])
        if not episode:
            return jsonify({'error': 'Episode not found'}), 404
        
        # Check if appearance already exists for this guest and episode
        existing_appearance = Appearance.query.filter_by(
            guest_id=data['guest_id'],
            episode_id=data['episode_id']
        ).first()
        
        if existing_appearance:
            return jsonify({'error': 'Appearance already exists for this guest and episode'}), 400
        
        # Create new appearance
        appearance = Appearance(
            rating=rating,
            guest_id=data['guest_id'],
            episode_id=data['episode_id']
        )
        
        db.session.add(appearance)
        db.session.commit()
        
        return jsonify({
            'message': 'Appearance created successfully',
            'appearance': appearance.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500