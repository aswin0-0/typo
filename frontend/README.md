# SkillType Frontend - React + Vite

A modern, fast typing speed test application built with React and Vite.

## 🚀 Features

- ⌨️ **Real-time Typing Test** - Type words with live WPM and accuracy tracking
- ⏱️ **Time Penalty System** - Mistakes cost you 2-3 seconds (the unique twist!)
- 🏆 **Global Leaderboard** - Compete with typists worldwide
- 📊 **Detailed Statistics** - Track your progress over time
- 🎯 **Multiple Word Lists** - Easy, Medium, Hard, and Programming vocabulary
- 🔐 **Authentication** - Secure JWT-based user authentication
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 📋 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   └── PrivateRoute.jsx
│   ├── layout/              # Layout components
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── TypingTest.jsx   # Main typing test
│   │   ├── Results.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Profile.jsx
│   │   ├── NotFound.jsx
│   │   ├── TypingTest.css
│   │   ├── Results.css
│   │   ├── Leaderboard.css
│   │   ├── Profile.css
│   │   └── Pages.css
│   ├── api.js               # API client with axios
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json
```

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

The app will run at `http://localhost:3000`

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## 📝 Key Pages

### Home
Landing page with features and call-to-action

### Login / Register  
User authentication pages with JWT token management

### Typing Test
Main typing interface with:
- Word list selection
- Real-time typing with live metrics
- 60-second timer (decreases with mistakes)
- WPM calculation
- Accuracy tracking
- Results submission

### Results
View all your typing test results with filtering by:
- Recent
- Best WPM
- Best Accuracy

### Leaderboard
Global rankings showing:
- Best WPM
- Average WPM
- Best Accuracy
- Total tests

### Profile
Personal dashboard displaying:
- Best/Average WPM
- Best/Average Accuracy
- Total tests and typing time
- Recent results

## 🔌 API Integration

API calls are managed through `src/api.js` using axios:

```javascript
// Authentication
authAPI.register(data)
authAPI.login(credentials)

// Word Lists
wordListAPI.getAll()
wordListAPI.getByDifficulty(difficulty)

// Results
resultsAPI.submitResult(data)
resultsAPI.getMyResults()
resultsAPI.getRecent(limit)

// Statistics
statisticsAPI.getLeaderboard(metric, limit)
```

### JWT Token Management

Tokens are stored in localStorage:
- `accessToken` - Sent with every API request
- `refreshToken` - For refreshing expired tokens

Automatic token refresh on 401 errors.

## 🎨 Styling

- Dark theme with accent colors
- CSS Variables for consistent theming
- Responsive grid layouts
- Smooth animations and transitions
- Mobile-friendly design

## 🚀 Running Locally

### Prerequisites
- Node.js (v16+)
- Backend Django server running on `http://localhost:8000`

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🔗 Backend Integration

Frontend connects to Django backend at:
```
http://localhost:8000/api
```

CORS is configured in Django settings for `localhost:3000`

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM renderer
- **react-router-dom** - Client-side routing
- **axios** - HTTP client for API calls
- **vite** - Build tool and dev server

## 🎯 How the Time Penalty Works

1. User starts typing test
2. For each incorrect word:
   - 2-3 seconds are deducted from remaining time
   - Timer updates immediately
   - Mistake count increases
3. WPM calculation uses adjusted duration

## 🐛 Troubleshooting

**API connection issues:**
- Ensure Django backend is running on port 8000
- Check CORS settings in Django

**Login not working:**
- Clear localStorage (tokens)
- Verify credentials in Django admin

**Page not loading:**
- Check browser console for errors
- Ensure all backend endpoints are available

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy `dist/` folder to your hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

3. Update API_URL in `src/api.js` for production backend

## 📞 Support

For issues or questions, check:
- Console logs (F12)
- Network tab in DevTools
- Django backend logs
- API documentation in `/backend/API_DOCUMENTATION.md`
