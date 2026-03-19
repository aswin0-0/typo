# Monkeytype Clone - Backend API Documentation

## Project Overview

This is a Django REST API backend for a **Monkeytype Clone** typing test application with a unique time penalty feature.

### Key Features:
- **User Authentication**: Register, login with JWT tokens
- **Typing Tests**: Core typing test engine with real-time performance tracking
- **Time Penalty System**: Mistakes reduce elapsed time by 2-3 seconds (the "catch"!)
- **Performance Metrics**: WPM, accuracy, raw WPM, mistake count tracking
- **Statistics & Leaderboard**: Track personal stats and compete on the leaderboard
- **Multiple Word Lists**: Different difficulty levels (easy, medium, hard)

---

## Database Models

### 1. **UserProfile**
Extended user profile for storing additional user information
- `user` - OneToOne relationship with Django User
- `created_at`, `updated_at` - Timestamps

### 2. **WordList**
Collection of words for typing tests
- `name` - Unique name for the word list
- `description` - Details about the word list
- `words` - JSON field containing array of words
- `difficulty` - Level (easy, medium, hard)
- `created_at`, `updated_at` - Timestamps

### 3. **TypingTestResult** ⭐ (Main Model)
Stores individual typing test results with all performance data
- **Test Configuration**:
  - `duration_seconds` - Length of the test
  - `test_mode` - Time-based or words-based
  
- **Performance Metrics**:
  - `words_typed` - Total words typed
  - `correct_characters` - Correctly typed characters
  - `incorrect_characters` - Mistakes
  - `total_characters_attempted` - Total input
  - `wpm` - Words Per Minute (final score)
  - `raw_wpm` - WPM before penalties
  - `accuracy` - Accuracy percentage (0-100)
  
- **Time Penalty System** (The Catch!):
  - `mistakes_count` - Total mistakes made
  - `time_penalty_seconds` - Total time deducted (2-3 sec per mistake)
  - `adjusted_duration` - Actual duration after penalties
  
- **Result Status**:
  - `passed` - Whether the test was considered passing
  - `completed` - Test completion status
  - `notes` - Optional notes about the test

### 4. **UserStatistics**
Aggregated statistics for each user
- `total_tests` - Number of tests taken
- `best_wpm` - Best WPM score
- `average_wpm` - Average WPM
- `best_accuracy` - Best accuracy
- `average_accuracy` - Average accuracy
- Various character and time tracking fields

---

## API Endpoints

### Authentication
```
POST   /api/auth/register/register/        - Register new user
POST   /api/auth/token/                    - Get JWT token (login)
POST   /api/auth/token/refresh/            - Refresh JWT token
```

**Register Request**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "password_confirm": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Token Request**:
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

### User Profiles
```
GET    /api/users/profile/me/              - Get current user's profile
GET    /api/users/profile/{id}/            - Get user profile
```

### Word Lists
```
GET    /api/word-lists/                    - Get all word lists
GET    /api/word-lists/{id}/               - Get specific word list
GET    /api/word-lists/by_difficulty/     - Filter by difficulty (?difficulty=easy)
```

### Typing Test Results
```
POST   /api/results/                       - Submit a typing test result
GET    /api/results/                       - Get user's results (paginated)
GET    /api/results/my_results/            - Get user's results
GET    /api/results/recent/                - Get recent results (?limit=10)
GET    /api/results/best_results/          - Get best results (?metric=wpm&limit=10)
GET    /api/results/statistics/            - Get user statistics
GET    /api/results/{id}/                  - Get specific result
```

### Statistics & Leaderboard
```
GET    /api/statistics/                    - Get all statistics
GET    /api/statistics/my_statistics/      - Get user's statistics
GET    /api/statistics/leaderboard/        - Get global leaderboard
       (?metric=best_wpm&limit=100)
```

---

## Sample API Responses

### Get Word Lists
```bash
GET /api/word-lists/
```
Response:
```json
[
  {
    "id": 1,
    "name": "Common English Words - Easy",
    "description": "Basic everyday English words",
    "words": ["the", "be", "to", "of", "and", ...],
    "difficulty": "easy",
    "created_at": "2024-03-19T10:30:00Z"
  }
]
```

### Submit Typing Test Result
```bash
POST /api/results/
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Request:
```json
{
  "word_list": 2,
  "duration_seconds": 60,
  "test_mode": "time",
  "words_typed": 65,
  "correct_characters": 312,
  "incorrect_characters": 8,
  "total_characters_attempted": 320,
  "wpm": 62.4,
  "raw_wpm": 65.0,
  "accuracy": 97.5,
  "mistakes_count": 8,
  "time_penalty_seconds": 16.0,
  "adjusted_duration": 44.0,
  "passed": true,
  "completed": true,
  "notes": "Great session!"
}
```

### Leaderboard Response
```bash
GET /api/statistics/leaderboard/?metric=best_wpm&limit=10
```

Response:
```json
[
  {
    "rank": 1,
    "username": "speed_king",
    "best_wpm": 125.5,
    "average_wpm": 105.3,
    "best_accuracy": 99.2,
    "total_tests": 42
  },
  {
    "rank": 2,
    "username": "type_master",
    "best_wpm": 118.3,
    "average_wpm": 98.7,
    "best_accuracy": 98.8,
    "total_tests": 38
  }
]
```

---

## Configuration

### CORS Settings (settings.py)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```
Update this when deploying the React frontend to a different domain.

### JWT Configuration (settings.py)
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

---

## Running the Server

### Setup:
```bash
# Activate virtual environment
.\typo\Scripts\Activate.ps1

# Install dependencies
pip install djangorestframework djangorestframework-simplejwt django-cors-headers

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Load sample word lists
python manage.py load_word_lists
```

### Start Server:
```bash
python manage.py runserver
```
Server runs at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin/`

---

## Next Steps

1. **Create React Frontend** - Build the typing test UI with Vite
2. **Implement Typing Engine Logic** - Real-time keystroke tracking
3. **Time Penalty Calculation** - Backend logic for deducting time
4. **Statistics Aggregation** - Auto-update UserStatistics after each test
5. **WebSocket Integration** - Real-time leaderboard updates (optional)

---

## Testing the API

Use **Postman** or **curl** to test endpoints:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123456","password_confirm":"test123456"}'

# Get Token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123456"}'

# Get Word Lists with Token
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/word-lists/
```
