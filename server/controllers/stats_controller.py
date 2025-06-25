from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from server.app import db
from server.models.report import Report
from server.models.patrol import Patrol
from server.models.user import User
from server.models.user_patrol import UserPatrol

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    try:
        # Get various statistics
        total_reports = Report.query.count()
        resolved_reports = Report.query.filter_by(status='resolved').count()
        active_patrols = Patrol.query.count()
        community_members = User.query.count()
        
        return jsonify({
            'totalReports': total_reports,
            'resolvedReports': resolved_reports,
            'activePatrols': active_patrols,
            'communityMembers': community_members
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500