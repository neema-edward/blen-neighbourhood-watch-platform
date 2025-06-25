from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from server.models.security_dog import SecurityDog
from server.models.user import User

dog_bp = Blueprint('dogs', __name__)

@dog_bp.route('/security-dogs', methods=['GET'])
@jwt_required()
def get_security_dogs():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can view all security dogs
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can view security dogs'}), 403
        
        dogs = SecurityDog.query.all()
        return jsonify({
            'dogs': [dog.to_dict() for dog in dogs]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dog_bp.route('/security-dogs/<int:dog_id>', methods=['GET'])
@jwt_required()
def get_security_dog(dog_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can view security dog details
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can view security dogs'}), 403
        
        dog = SecurityDog.query.get(dog_id)
        
        if not dog:
            return jsonify({'error': 'Security dog not found'}), 404
        
        return jsonify({
            'dog': dog.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dog_bp.route('/security-dogs', methods=['POST'])
@jwt_required()
def create_security_dog():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can create security dogs
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can manage security dogs'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'company']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate assigned_to if provided
        assigned_to = data.get('assigned_to')
        if assigned_to:
            user = User.query.get(assigned_to)
            if not user:
                return jsonify({'error': 'Assigned user not found'}), 404
        
        # Create new security dog
        dog = SecurityDog(
            name=data['name'],
            company=data['company'],
            assigned_to=assigned_to,
            status=data.get('status', 'available')
        )
        
        db.session.add(dog)
        db.session.commit()
        
        return jsonify({
            'message': 'Security dog created successfully',
            'dog': dog.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dog_bp.route('/security-dogs/<int:dog_id>', methods=['PUT'])
@jwt_required()
def update_security_dog(dog_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can update security dogs
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can manage security dogs'}), 403
        
        dog = SecurityDog.query.get(dog_id)
        
        if not dog:
            return jsonify({'error': 'Security dog not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields
        if 'name' in data:
            dog.name = data['name']
        if 'company' in data:
            dog.company = data['company']
        if 'status' in data:
            dog.status = data['status']
        if 'assigned_to' in data:
            assigned_to = data['assigned_to']
            if assigned_to:
                user = User.query.get(assigned_to)
                if not user:
                    return jsonify({'error': 'Assigned user not found'}), 404
            dog.assigned_to = assigned_to
        
        db.session.commit()
        
        return jsonify({
            'message': 'Security dog updated successfully',
            'dog': dog.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dog_bp.route('/security-dogs/<int:dog_id>', methods=['DELETE'])
@jwt_required()
def delete_security_dog(dog_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can delete security dogs
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can manage security dogs'}), 403
        
        dog = SecurityDog.query.get(dog_id)
        
        if not dog:
            return jsonify({'error': 'Security dog not found'}), 404
        
        db.session.delete(dog)
        db.session.commit()
        
        return jsonify({
            'message': 'Security dog deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dog_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can view all users
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can view users'}), 403
        
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500