from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from server.models.community_post import CommunityPost
from server.models.user import User

community_bp = Blueprint('community', __name__)

@community_bp.route('/community-posts', methods=['GET'])
@jwt_required()
def get_community_posts():
    try:
        posts = CommunityPost.query.order_by(CommunityPost.date_posted.desc()).all()
        return jsonify({
            'posts': [post.to_dict() for post in posts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@community_bp.route('/community-posts/<int:post_id>', methods=['GET'])
@jwt_required()
def get_community_post(post_id):
    try:
        post = CommunityPost.query.get(post_id)
        
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        return jsonify({
            'post': post.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@community_bp.route('/community-posts', methods=['POST'])
@jwt_required()
def create_community_post():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only admins can create community posts
        if current_user.role != 'admin':
            return jsonify({'error': 'Only administrators can create community posts'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['title', 'content']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new post
        post = CommunityPost(
            title=data['title'],
            content=data['content'],
            created_by=current_user_id,
            is_alert=data.get('is_alert', False)
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Community post created successfully',
            'post': post.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@community_bp.route('/community-posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_community_post(post_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        post = CommunityPost.query.get(post_id)
        
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Check if user owns the post or is admin
        if post.created_by != current_user_id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized to edit this post'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields
        if 'title' in data:
            post.title = data['title']
        if 'content' in data:
            post.content = data['content']
        if 'is_alert' in data:
            post.is_alert = data['is_alert']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Community post updated successfully',
            'post': post.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@community_bp.route('/community-posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_community_post(post_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        post = CommunityPost.query.get(post_id)
        
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Check if user owns the post or is admin
        if post.created_by != current_user_id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized to delete this post'}), 403
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Community post deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500