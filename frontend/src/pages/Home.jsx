import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Pages.css';

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTest = () => {
    if (isAuthenticated) {
      navigate('/test');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>⌨️ SkillType</h1>
          <p className="hero-subtitle">Master Your Typing Speed with Our Unique Time Penalty Challenge</p>
          <p className="hero-description">
            Test your typing speed and accuracy with a twist! Make mistakes and lose time! 
            Race against others on the leaderboard and become the SkillType champion.
          </p>
          <button className="hero-button" onClick={handleStartTest}>
            {isAuthenticated ? 'Start Typing Test' : 'Get Started'}
          </button>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Time Challenge</h3>
            <p>Make mistakes and lose precious seconds from your timer!</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Metrics</h3>
            <p>Track WPM, accuracy, and performance metrics in real-time.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Global Leaderboard</h3>
            <p>Compete with typists worldwide and claim your spot at the top.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progress Tracking</h3>
            <p>Track your improvement over time with detailed statistics.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Multiple Word Lists</h3>
            <p>Choose from easy, medium, hard, and programming word lists.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Precision Challenge</h3>
            <p>Every keystroke counts—accuracy is rewarded, mistakes penalized.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register & Login</h3>
            <p>Create your account to start typing and track your progress.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Word List</h3>
            <p>Select a difficulty level that matches your skill.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Type Test</h3>
            <p>Type words as they appear. Mistakes cost you 2-3 seconds!</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>View Results</h3>
            <p>See your WPM, accuracy, and compare with the leaderboard.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Challenge Yourself?</h2>
        <p>Join thousands of typists competing to master their speed and accuracy.</p>
        <button className="cta-button" onClick={handleStartTest}>
          {isAuthenticated ? 'Take a Test Now' : 'Join SkillType'}
        </button>
      </section>
    </div>
  );
}

export default Home;
