# SkillType - Monkeytype Clone with Time Penalty Feature

A full-stack typing speed test application featuring a unique **time penalty system** where mistakes deduct precious seconds from your timer!

🎯 **The Catch**: Every mistake costs you 2-3 seconds in your test timer - making accuracy crucial!

## 🏗️ Architecture

```
SkillType/
├── backend/              # Django REST API
│   └── speedtype/
│       ├── typemaster/   # Main app
│       ├── manage.py
│       └── API docs
│
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layout/
│   │   └── api.js
│   └── vite.config.js
│
└── typo/                 # Python virtual environment
```

## ✅ Completed

### Backend (Django)
- ✅ Django REST Framework setup
- ✅ JWT Authentication (djangorestframework-simplejwt)
- ✅ CORS headers configured
- ✅ 4 Database Models:
  - UserProfile
  - WordList (4 pre-loaded: Easy, Medium, Hard, Programming)
  - TypingTestResult (with time penalty tracking)
  - UserStatistics
- ✅ Full API with 25+ endpoints
- ✅ Django Admin interface
- ✅ Signal handlers for auto-profile creation
- ✅ 4 Sample word lists loaded

### Frontend (React + Vite)
- ✅ React 18 + Vite setup
- ✅ React Router for SPA navigation
- ✅ Axios API client with JWT interceptors
- ✅ 8 Pages:
  - Home (landing page)
  - Login/Register (auth)
  - Typing Test (core gameplay)
  - Results (test history)
  - Leaderboard (global rankings)
  - Profile (user statistics)
  - NotFound (404)
- ✅ Real-time typing engine with:
  - 60-second timer
  - Character accuracy tracking
  - WPM calculation
  - Time penalty deduction
  - Mistake counting
- ✅ Responsive design (mobile + desktop)
- ✅ Dark theme with accent colors
- ✅ npm dependencies installed

## 🚀 Quick Start

### Start Backend
```bash
cd backend/speedtype
python manage.py runserver
# Server at http://localhost:8000
# Admin at http://localhost:8000/admin/ (username: admin, password: admin)
```

### Start Frontend
```bash
cd frontend
npm run dev
# App at http://localhost:3000
```

## 📊 Backend Models

### UserProfile
- Extended user information
- Auto-created on registration

### WordList
- Collections of typing words
- Difficulty levels (easy, medium, hard, programming)
- 4 pre-loaded lists

### TypingTestResult ⭐ (Core Model)
- Test configuration (duration, mode)
- Performance metrics (WPM, accuracy, words typed)
- **Time Penalty Fields**:
  - `mistakes_count` - Total mistakes
  - `time_penalty_seconds` - Total time deducted
  - `adjusted_duration` - Duration after penalties
- Results status (passed/completed)

### UserStatistics
- Best/Average WPM
- Best/Average Accuracy
- Total tests and typing time
- Character statistics

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register/register/    - Register
POST   /api/auth/token/                - Login (get JWT)
POST   /api/auth/token/refresh/        - Refresh token
```

### Typing Tests
```
POST   /api/results/                   - Submit test result
GET    /api/results/                   - Get results (paginated)
GET    /api/results/my_results/        - Get user results
GET    /api/results/recent/            - Get recent tests
GET    /api/results/best_results/      - Get best results
```

### Statistics & Leaderboard
```
GET    /api/statistics/my_statistics/  - Get user stats
GET    /api/statistics/leaderboard/    - Get global leaderboard
```

### Word Lists
```
GET    /api/word-lists/                - Get all lists
GET    /api/word-lists/by_difficulty/  - Get by difficulty
```

## 🎮 How It Works

1. **Register/Login** → Get JWT token stored in localStorage
2. **Select Word List** → Choose difficulty (easy to hard)
3. **Start Test** → Type words from the list
4. **Make Mistakes** → Each mistake deducts 2-3 seconds
5. **Finish Test** → Time runs out or you complete words
6. **View Results** → See WPM, accuracy, stats, time penalty
7. **Check Leaderboard** → Compare with global rankings

## 📱 Frontend Pages

| Page | Purpose |
|------|---------|
| Home | Landing page with features |
| Login | User authentication |
| Register | New user signup |
| TypingTest | Core typing interface |
| Results | View test history & stats |
| Leaderboard | Global rankings |
| Profile | Personal statistics |

## 🔧 Tech Stack

### Backend
- Django 6.0.3
- Django REST Framework
- djangorestframework-simplejwt (JWT)
- django-cors-headers (CORS)
- SQLite (database)

### Frontend
- React 18
- Vite 5
- React Router v6
- Axios
- Pure CSS (with CSS variables)

## 📝 Development Notes

### Backend
- All models with proper validators
- Automatic user profile/stats creation
- Time penalty calculation built-in
- Admin interface fully configured
- Watch endpoints for leaderboard rankings

### Frontend
- Real-time typing engine with character-by-character validation
- Time penalty deduction on mistakes
- JWT token auto-refresh on 401
- Responsive CSS Grid layouts
- Smooth animations and transitions

## 🔐 Security

- JWT tokens (24-hour expiry)
- Refresh tokens (7-day expiry)
- Password validation (min 8 chars)
- CORS restricted to localhost:3000
- Token stored in localStorage
- Auto-logout on 401 errors

## 🎯 Performance

- Vite for fast development and builds
- Optimized images and assets
- Lazy component loading with React Router
- Efficient API calls with axios interceptors
- CSS Grid for responsive layouts

## 📚 Documentation

- [Backend API Docs](./backend/API_DOCUMENTATION.md)
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend/speedtype
python manage.py makemigrations
python manage.py migrate
python manage.py manage.py load_word_lists
```

### Frontend API errors
- Check backend is running on port 8000
- Verify CORS settings in Django
- Clear browser cache/localStorage

### Can't login
- Verify user exists in Django admin
- Check password is correct
- Clear localStorage tokens

## 🚀 Next Steps

1. ✅ Backend API - DONE
2. ✅ Frontend App - DONE
3. 📱 Mobile optimization - Optional
4. 🌍 Deployment setup - Optional
5. 📊 Analytics - Optional

## 📄 License

MIT License - Feel free to use and modify!

---

**Created**: March 19, 2026  
**Status**: Fully Functional ✅

## Environment Setup Done
Django 6.0.3 configured  
Django REST Framework installed  
JWT authentication (djangorestframework-simplejwt)  
CORS headers enabled  
Database migrations applied  
Sample data loaded  
