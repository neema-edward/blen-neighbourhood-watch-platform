from server.app import create_app, db
from server.models.user import User
from server.models.report import Report
from server.models.patrol import Patrol
from server.models.user_patrol import UserPatrol
from server.models.community_post import CommunityPost
from server.models.security_dog import SecurityDog
from datetime import datetime, timedelta

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        print("Creating users...")
        admin_user = User(
            username='admin',
            email='admin@neighborhood.com',
            password='admin123',
            role='admin'
        )
        
        resident1 = User(
            username='john_doe',
            email='john@email.com',
            password='password123',
            role='resident'
        )
        
        resident2 = User(
            username='jane_smith',
            email='jane@email.com',
            password='password123',
            role='resident'
        )
        
        db.session.add_all([admin_user, resident1, resident2])
        db.session.commit()
        
        print("Creating reports...")
        reports = [
            Report(
                title='Suspicious Activity on Main Street',
                description='Saw someone trying car door handles around 2 AM. They were wearing dark clothing and seemed to be checking multiple vehicles.',
                location='Main Street between 1st and 2nd Avenue',
                danger_level='red',
                user_id=resident1.id
            ),
            Report(
                title='Broken Street Light',
                description='The street light at the corner of Oak and Pine has been out for three days. Makes the area quite dark at night.',
                location='Corner of Oak Street and Pine Avenue',
                danger_level='orange',
                user_id=resident2.id
            ),
            Report(
                title='Stray Dog in Park',
                description='There is a friendly stray dog in Central Park. Appears to be well-fed but has no collar. Someone should check if it belongs to anyone.',
                location='Central Park near the playground',
                danger_level='green',
                user_id=resident1.id
            )
        ]
        
        db.session.add_all(reports)
        db.session.commit()
        
        print("Creating patrols...")
        patrols = [
            Patrol(
                name='Night Watch',
                description='Evening patrol covering the residential area from 8 PM to 12 AM. Focus on Main Street and surrounding neighborhoods.',
                scheduled_time=datetime.now() + timedelta(days=1, hours=20),
                location='Main Street Residential Area'
            ),
            Patrol(
                name='Park Safety Walk',
                description='Morning patrol of Central Park and surrounding areas. Check for any overnight incidents and ensure park safety.',
                scheduled_time=datetime.now() + timedelta(days=2, hours=8),
                location='Central Park and vicinity'
            )
        ]
        
        db.session.add_all(patrols)
        db.session.commit()
        
        print("Creating user patrol assignments...")
        user_patrols = [
            UserPatrol(user_id=admin_user.id, patrol_id=patrols[0].id, role_in_patrol='leader'),
            UserPatrol(user_id=resident1.id, patrol_id=patrols[0].id, role_in_patrol='member'),
            UserPatrol(user_id=resident2.id, patrol_id=patrols[1].id, role_in_patrol='leader'),
            UserPatrol(user_id=resident1.id, patrol_id=patrols[1].id, role_in_patrol='member'),
            UserPatrol(user_id=admin_user.id, patrol_id=patrols[1].id, role_in_patrol='member')
        ]
        
        db.session.add_all(user_patrols)
        db.session.commit()
        
        print("Creating community posts...")
        community_posts = [
            CommunityPost(
                title='Welcome to Neighborhood Watch',
                content='Welcome to our new neighborhood watch platform! Here you can report incidents, join patrols, and stay informed about community safety. Please remember to be respectful and accurate in your reports.',
                created_by=admin_user.id,
                is_alert=False
            ),
            CommunityPost(
                title='ALERT: Increased Break-in Activity',
                content='We have received multiple reports of attempted break-ins in the Main Street area over the past week. Please ensure your doors and windows are locked, and report any suspicious activity immediately. Extra patrols have been scheduled for this area.',
                created_by=admin_user.id,
                is_alert=True
            )
        ]
        
        db.session.add_all(community_posts)
        db.session.commit()
        
        print("Creating security dogs...")
        security_dogs = [
            SecurityDog(
                name='Rex',
                company='Guardian Security Services',
                assigned_to=resident1.id,
                status='assigned'
            ),
            SecurityDog(
                name='Bella',
                company='SafeWatch Security',
                assigned_to=None,
                status='available'
            )
        ]
        
        db.session.add_all(security_dogs)
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Created {len([admin_user, resident1, resident2])} users")
        print(f"Created {len(reports)} reports")
        print(f"Created {len(patrols)} patrols")
        print(f"Created {len(user_patrols)} user patrol assignments")
        print(f"Created {len(community_posts)} community posts")
        print(f"Created {len(security_dogs)} security dogs")
        print("\nLogin credentials:")
        print("Admin: admin / admin123")
        print("Resident 1: john_doe / password123")
        print("Resident 2: jane_smith / password123")

if __name__ == '__main__':
    seed_database()