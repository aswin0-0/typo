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
          <h1>skilltype</h1>
          <p className="hero-subtitle">a minimalist typing experience with a twist.</p>
          <p className="hero-description">
            test your speed. precision is rewarded, mistakes are penalized.
          </p>
          <button className="hero-button" onClick={handleStartTest}>
            {isAuthenticated ? 'start typing' : 'get started'}
          </button>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          <div className="feature-item">
            <h3>time penalty</h3>
            <p>mistakes cost precious seconds. type accurately.</p>
          </div>
          <div className="feature-item">
            <h3>real-time</h3>
            <p>track wpm, accuracy, and performance live.</p>
          </div>
          <div className="feature-item">
            <h3>leaderboards</h3>
            <p>compete globally and claim your spot at the top.</p>
          </div>
          <div className="feature-item">
            <h3>custom lists</h3>
            <p>easy, medium, hard, and programming words.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <h3>register</h3>
            <p>create your account to track your progress.</p>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>choose</h3>
            <p>select a difficulty level.</p>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>type</h3>
            <p>type words as they appear. avoid mistakes.</p>
          </div>
          <div className="step">
            <div className="step-number">04</div>
            <h3>review</h3>
            <p>analyze your wpm and accuracy.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <p>ready to focus?</p>
        <button className="cta-button" onClick={handleStartTest}>
          {isAuthenticated ? 'take a test' : 'join skilltype'}
        </button>
      </section>
    </div>
  );
}

export default Home;
