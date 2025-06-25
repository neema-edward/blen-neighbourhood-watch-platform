from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from server.models.patrol import Patrol
from server.models.user_patrol import UserPatrol
from server.models.user import User
from datetime import datetime

patrol_bp = Blueprint('patrols', __name__)

@patrol_bp.route('/patrols', methods=['GET'])
@jwt_required()
def get_patrols():
    try:
        patrols = Patrol.query.order_by(Patrol.scheduled_time).all()
        return jsonify({
            'patrols': [patrol.to_dict() for patrol in patrols]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patrol_bp.route('/patrols/<int:patrol_id>', methods=['GET'])
@jwt_required()
def get_patrol(patrol_id):
    try:
        patrol = Patrol.query.get(patrol_id)
        
        if not patrol:
            return jsonify({'error': 'Patrol not found'}), 404
        
        return jsonify({
            'patrol': patrol.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patrol_bp.route('/patrols', methods=['POST'])
@jwt_required()
def create_patrol():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can create patrols
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can create patrols'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'description', 'scheduled_time', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse scheduled_time
        try:
            scheduled_time = datetime.fromisoformat(data['scheduled_time'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid scheduled_time format'}), 400
        
        # Create new patrol
        patrol = Patrol(
            name=data['name'],
            description=data['description'],
            scheduled_time=scheduled_time,
            location=data['location']
        )
        
        db.session.add(patrol)
        db.session.commit()
        
        return jsonify({
            'message': 'Patrol created successfully',
            'patrol': patrol.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patrol_bp.route('/user-patrols', methods=['GET'])
@jwt_required()
def get_user_patrols():
    try:
        current_user_id = get_jwt_identity()
        user_patrols = UserPatrol.query.filter_by(user_id=current_user_id).all()
        
        return jsonify({
            'user_patrols': [up.to_dict() for up in user_patrols]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patrol_bp.route('/user-patrols', methods=['POST'])
@jwt_required()
def join_patrol():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('patrol_id'):
            return jsonify({'error': 'patrol_id is required'}), 400
        
        # Check if patrol exists
        patrol = Patrol.query.get(data['patrol_id'])
        if not patrol:
            return jsonify({'error': 'Patrol not found'}), 404
        
        # Check if user is already in this patrol
        existing = UserPatrol.query.filter_by(
            user_id=current_user_id,
            patrol_id=data['patrol_id']
        ).first()
        
        if existing:
            return jsonify({'error': 'Already joined this patrol'}), 400
        
        # Create user patrol
        user_patrol = UserPatrol(
            user_id=current_user_id,
            patrol_id=data['patrol_id'],
            role_in_patrol=data.get('role_in_patrol', 'member')
        )
        
        db.session.add(user_patrol)
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully joined patrol',
            'user_patrol': user_patrol.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patrol_bp.route('/user-patrols/<int:user_patrol_id>', methods=['DELETE'])
@jwt_required()
def leave_patrol(user_patrol_id):
    try:
        current_user_id = get_jwt_identity()
        user_patrol = UserPatrol.query.get(user_patrol_id)
        
        if not user_patrol:
            return jsonify({'error': 'User patrol not found'}), 404
        
        # Check if user owns this patrol membership
        if user_patrol.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized to leave this patrol'}), 403
        
        db.session.delete(user_patrol)
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully left patrol'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500