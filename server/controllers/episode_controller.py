from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app import db
from models.episode import Episode

episode_bp = Blueprint('episodes', __name__)

@episode_bp.route('/episodes', methods=['GET'])
def get_episodes():
    try:
        episodes = Episode.query.order_by(Episode.number).all()
        return jsonify({
            'episodes': [episode.to_dict() for episode in episodes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@episode_bp.route('/episodes/<int:episode_id>', methods=['GET'])
def get_episode(episode_id):
    try:
        episode = Episode.query.get(episode_id)
        
        if not episode:
            return jsonify({'error': 'Episode not found'}), 404
        
        return jsonify({
            'episode': episode.to_dict(include_appearances=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@episode_bp.route('/episodes/<int:episode_id>', methods=['DELETE'])
@jwt_required()
def delete_episode(episode_id):
    try:
        episode = Episode.query.get(episode_id)
        
        if not episode:
            return jsonify({'error': 'Episode not found'}), 404
        
        db.session.delete(episode)
        db.session.commit()
        
        return jsonify({
            'message': f'Episode {episode.number} deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500