from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from server.models.report import Report
from server.models.user import User

report_bp = Blueprint('reports', __name__)

@report_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    try:
        limit = request.args.get('limit', type=int)
        reports_query = Report.query.order_by(Report.date_reported.desc())
        
        if limit:
            reports_query = reports_query.limit(limit)
            
        reports = reports_query.all()
        return jsonify({
            'reports': [report.to_dict() for report in reports]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@report_bp.route('/reports/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    try:
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        return jsonify({
            'report': report.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@report_bp.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['title', 'description', 'location', 'danger_level']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new report
        report = Report(
            title=data['title'],
            description=data['description'],
            location=data['location'],
            danger_level=data['danger_level'],
            user_id=current_user_id
        )
        
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report created successfully',
            'report': report.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@report_bp.route('/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check if user owns the report or is admin
        if report.user_id != current_user_id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized to edit this report'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields
        if 'title' in data:
            report.title = data['title']
        if 'description' in data:
            report.description = data['description']
        if 'location' in data:
            report.location = data['location']
        if 'danger_level' in data:
            report.danger_level = data['danger_level']
        if 'status' in data and current_user.role == 'admin':
            report.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Report updated successfully',
            'report': report.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@report_bp.route('/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        report = Report.query.get(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check if user owns the report or is admin
        if report.user_id != current_user_id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized to delete this report'}), 403
        
        db.session.delete(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@report_bp.route('/user/reports', methods=['GET'])
@jwt_required()
def get_user_reports():
    try:
        current_user_id = get_jwt_identity()
        reports = Report.query.filter_by(user_id=current_user_id).order_by(Report.date_reported.desc()).all()
        
        return jsonify({
            'reports': [report.to_dict() for report in reports]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500