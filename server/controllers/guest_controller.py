from flask import Blueprint, jsonify
from models.guest import Guest

guest_bp = Blueprint('guests', __name__)

@guest_bp.route('/guests', methods=['GET'])
def get_guests():
    try:
        guests = Guest.query.all()
        return jsonify({
            'guests': [guest.to_dict() for guest in guests]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500