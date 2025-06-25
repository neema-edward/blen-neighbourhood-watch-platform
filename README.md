# Neighborhood Watch Platform

A comprehensive community safety platform where residents can report incidents, organize patrols, and stay informed about neighborhood security concerns. Built with React frontend and Flask REST API backend.

## Features

### Core Functionality
- **Incident Reporting**: Create, view, edit, and delete incident reports with danger level classification
- **Community Patrols**: Join and manage neighborhood patrol groups with role assignments
- **Community Updates**: Admin-posted announcements and alerts for community-wide communication
- **Security Dog Management**: Admin tools for managing and assigning security dogs to residents
- **User Profiles**: Personal dashboards showing user activity and patrol participation

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication system
- **Role-based Access**: Admin and resident roles with appropriate permissions
- **Protected Routes**: Secure API endpoints and frontend route protection

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Dynamic content updates without page refreshes
- **Form Validation**: Comprehensive client and server-side validation using Formik and Yup
- **Interactive UI**: Modern interface with hover states and smooth transitions

## 🏗 Architecture

### Frontend (React)
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **Formik + Yup** for form handling and validation
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for consistent iconography

### Backend (Flask)
- **Flask** with modular blueprint architecture
- **SQLAlchemy** ORM for database operations
- **Flask-JWT-Extended** for authentication
- **Flask-Migrate** for database migrations
- **Flask-CORS** for cross-origin requests

##  Data Models

### User
- `id`, `username`, `email`, `password_hash`, `role` (resident/admin)
- Relationships: reports, user_patrols, community_posts, assigned_dog

### Report
- `id`, `title`, `description`, `date_reported`, `location`, `status`, `danger_level`, `user_id`
- Validation: description min 10 chars, location regex, danger level enum

### Patrol
- `id`, `name`, `description`, `scheduled_time`, `location`
- Relationships: user_patrols (many-to-many through UserPatrol)

### UserPatrol (Association Table)
- `id`, `user_id`, `patrol_id`, `role_in_patrol` (leader/member)

### CommunityPost
- `id`, `title`, `content`, `date_posted`, `created_by`, `is_alert`
- Admin-only creation, alert flag for urgent notifications

### SecurityDog
- `id`, `name`, `assigned_to`, `company`, `status` (available/assigned)
- Admin-managed, optional user assignment

## 🛠 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd neighborhood-watch-platform
```

2. **Install Python dependencies**
```bash
pip install flask flask-sqlalchemy flask-migrate flask-jwt-extended flask-cors python-dotenv werkzeug
```
```bash
pipenv install && pipenv shell

3. **Initialize the database**
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

4. **Seed the database with sample data**
```bash
PYTHONPATH=. python server/seed.py
```

5. **Start the Flask server**
```bash
export FLASK_APP=server.app:create_app
export FLASK_RUN_PORT=5000
flask run
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies**
```bash
npm install
```

2. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Authentication

### Default Users
The seed script creates three users:

- **Admin**: `admin` / `admin123`
- **Resident 1**: `john_doe` / `password123`
- **Resident 2**: `jane_smith` / `password123`

### JWT Token Flow
1. User logs in with username/password
2. Server validates credentials and returns JWT token
3. Client stores token and includes it in subsequent requests
4. Protected routes verify token before processing requests

## Pages & Features

### Public Access
- **Login/Register**: Authentication forms with validation

### Authenticated Users
- **Home**: Dashboard with recent reports and community stats
- **Reports**: View all reports, create new reports, filter by danger level/status
- **Patrols**: View available patrols, join/leave patrols, see patrol schedules
- **Community**: View community posts and alerts
- **Profile**: Personal dashboard with user's reports and patrol participation

### Admin Only
- **Security Dogs**: Manage security dog assignments and availability
- **Community Posts**: Create announcements and alerts for the community

##  Design Features

### Color-Coded System
- **Danger Levels**: Green (low), Orange (medium), Red (high)
- **Status Indicators**: Visual status badges for reports and assignments
- **Role Badges**: Different colors for admin vs resident roles

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Flexible grid layouts that adapt to screen size
- Touch-friendly interface elements

### Interactive Elements
- Hover states on buttons and cards
- Loading spinners for async operations
- Form validation with real-time feedback
- Smooth transitions and animations

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Reports
- `GET /api/reports` - Get all reports (with optional limit)
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report (owner/admin only)
- `DELETE /api/reports/:id` - Delete report (owner/admin only)
- `GET /api/user/reports` - Get current user's reports

### Patrols
- `GET /api/patrols` - Get all patrols
- `POST /api/patrols` - Create patrol (admin only)
- `GET /api/user-patrols` - Get user's patrol memberships
- `POST /api/user-patrols` - Join a patrol
- `DELETE /api/user-patrols/:id` - Leave a patrol

### Community
- `GET /api/community-posts` - Get all community posts
- `POST /api/community-posts` - Create post (admin only)
- `PUT /api/community-posts/:id` - Update post (admin only)
- `DELETE /api/community-posts/:id` - Delete post (admin only)

### Security Dogs
- `GET /api/security-dogs` - Get all dogs (admin only)
- `POST /api/security-dogs` - Create dog record (admin only)
- `PUT /api/security-dogs/:id` - Update dog assignment (admin only)
- `DELETE /api/security-dogs/:id` - Delete dog record (admin only)

### Statistics
- `GET /api/stats` - Get community statistics

## Sample Data

The seed script creates:
- **3 Users**: 1 admin, 2 residents
- **3 Reports**: Various danger levels and locations
- **2 Patrols**: Night watch and park safety
- **5 User-Patrol Assignments**: Mixed roles and participation
- **2 Community Posts**: Welcome message and security alert
- **2 Security Dogs**: One assigned, one available

## Deployment Considerations

### Environment Variables
```bash
DATABASE_URL=your_database_url
JWT_SECRET_KEY=your_jwt_secret
SECRET_KEY=your_flask_secret
```

### Production Setup
1. Use PostgreSQL instead of SQLite
2. Set secure secret keys
3. Enable HTTPS
4. Configure proper CORS settings
5. Set up proper logging
6. Use production WSGI server (Gunicorn)

##  Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for instant alerts
- **Map Integration**: Visual incident mapping with Leaflet.js
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Incident trends and patrol effectiveness metrics
- **Comment System**: Discussion threads on reports and posts
- **File Uploads**: Photo attachments for incident reports

### Technical Improvements
- **Caching**: Redis for improved performance
- **Search**: Full-text search for reports and posts
- **API Rate Limiting**: Prevent abuse with request throttling
- **Automated Testing**: Unit and integration test suites
- **CI/CD Pipeline**: Automated deployment and testing

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions or issues, please create an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for safer communities**