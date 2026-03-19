# SkillType - Quick Start Guide

Get SkillType running in 5 minutes! 🚀

## Prerequisites

- Python 3.8+
- Node.js 16+
- Git

## 🔧 Setup

### 1. Clone & Navigate
```bash
cd c:\Users\aswin\projects\skilltype
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend\speedtype

# Activate virtual environment (Windows)
..\..\typo\Scripts\activate

# Create superuser (optional - only first time)
python manage.py createsuperuser
# Username: admin, Email: admin@admin.com, Password: admin

# Start backend server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`  
Admin panel: `http://localhost:8000/admin/` (login with admin/admin)

### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

## ✅ Quick Test

### 1. Visit Home Page
```
http://localhost:3000
```

### 2. Register New Account
- Click "Register"
- Fill in details (min password 8 chars)
- Submit

### 3. Take Typing Test
- Click "Start Typing Test"
- Select a word list (Easy recommended)
- Start typing to begin
- Watch the timer and make mistakes carefully!

### 4. View Results
- Check your WPM, Accuracy, Time Penalty
- View results history
- Check global leaderboard

## 📊 API Testing

### Get Word Lists
```bash
curl http://localhost:8000/api/word-lists/
```

### Login & Get Token
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Submit Test Result
```bash
curl -X POST http://localhost:8000/api/results/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "word_list": 1,
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
    "completed": true
  }'
```

## 🔑 Admin Credentials

- Username: `admin`
- Password: `admin`
- URL: `http://localhost:8000/admin/`

## 📁 Project Structure

```
skilltype/
├── backend/           # Django API
│   └── speedtype/
│       └── typemaster/  # Main app
├── frontend/          # React + Vite
│   └── src/
├── typo/             # Virtual environment
└── README.md
```

## 🚨 Troubleshooting

### Backend won't start
```bash
# Make sure you're in the right directory
cd backend/speedtype

# Activate virtual environment
..\..\typo\Scripts\activate

# Check if port 8000 is available
python manage.py runserver 0.0.0.0:8001  # Use different port if needed
```

### Frontend won't connect to backend
- Check backend is running (`http://localhost:8000`)
- Check console for CORS errors
- Verify API URL in `frontend/src/api.js`

### Can't login
- Check credentials in Django admin
- Make sure backend is running
- Clear browser cache and localStorage

### Port already in use
```bash
# Backend on different port
python manage.py runserver 0.0.0.0:8001

# Frontend on different port (edit vite.config.js)
# Or use npm run dev -- --port 3001
```

## 📝 Common Commands

### Backend
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Load sample word lists
python manage.py load_word_lists

# Create superuser
python manage.py createsuperuser

# Access Django shell
python manage.py shell
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check dependencies
npm list
```

## 🎮 Feature Guide

### Time Penalty System
- **Start**: You get 60 seconds
- **Mistake**: Each wrong word costs 2-3 seconds
- **Result**: Your final time = 60s - (mistakes × 2-3s)
- **WPM**: Calculated based on adjusted duration

### Difficulty Levels
- **Easy**: Common English words
- **Medium**: General vocabulary
- **Hard**: Challenging words
- **Programming**: Tech terminology

### Leaderboard
- Sort by Best WPM or Average WPM
- See top 100 typists
- Check your ranking

### Statistics
- Track personal best WPM
- Monitor accuracy trends
- View total typing time
- See mistake counts

## 🔐 Authentication Flow

1. Register → Create account
2. Login → Get JWT token (24 hours)
3. Store token in localStorage
4. Send token with every API request
5. Auto-refresh on expiry
6. Auto-logout on invalid token

## 📞 Need Help?

Check the documentation:
- [Backend API Docs](./backend/API_DOCUMENTATION.md)
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

Or check console output for error messages!

---

**Happy Typing! 🎯**
