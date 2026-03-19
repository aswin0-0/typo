# Backend API Setup - Quick Reference

## ✅ Completed
- Django project structure (`speedtype`)
- Django app (`typemaster`) with complete models
- REST Framework integration with JWT authentication
- CORS configuration
- 4 Word Lists loaded (easy, medium, hard, programming)
- Django admin interface configured
- Signal handlers for automatic profile/stats creation

## Models Created

### Core Models:
1. **UserProfile** - Extended user information
2. **WordList** - Collections of words for tests
3. **TypingTestResult** - Individual test records with full metrics ⭐
4. **UserStatistics** - Aggregated user statistics

### Key Fields in TypingTestResult:
- Performance: `wpm`, `raw_wpm`, `accuracy`, `words_typed`
- Time Penalty: `mistakes_count`, `time_penalty_seconds`, `adjusted_duration`
- Status: `passed`, `completed`, `notes`

## API Endpoints

### Authentication
- `POST /api/auth/register/register/` - Register new user
- `POST /api/auth/token/` - Get JWT token
- `POST /api/auth/token/refresh/` - Refresh token

### Core Endpoints
- `GET/POST /api/results/` - Typing test results
- `GET /api/results/leaderboard/` - Leaderboard
- `GET /api/statistics/` - User statistics
- `GET /api/word-lists/` - Available word lists

## Running the Backend

```bash
# Navigate to backend
cd backend/speedtype

# Start server
python manage.py runserver

# Server runs at http://localhost:8000
# Admin at http://localhost:8000/admin/
```

## Environment Setup Done
Django 6.0.3 configured  
Django REST Framework installed  
JWT authentication (djangorestframework-simplejwt)  
CORS headers enabled  
Database migrations applied  
Sample data loaded  
