import { useState, useEffect } from 'react';
import { resultsAPI, profileAPI } from '../api';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, statsRes, resultsRes] = await Promise.all([
        profileAPI.getProfile(),
        resultsAPI.getStatistics(),
        resultsAPI.getRecent(5),
      ]);

      setProfile(profileRes.data);
      setStatistics(statsRes.data);
      setRecentResults(resultsRes.data);
    } catch (err) {
      setError('Failed to load profile data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="profile-page"><div className="error-message">{error}</div></div>;
  }

  const username = localStorage.getItem('username');

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{username?.charAt(0).toUpperCase() || 'U'}</span>
        </div>
        <div className="profile-info">
          <h1>{username}</h1>
          <p className="profile-joined">
            Joined: {profile?.user && new Date(profile.user.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>

      {statistics && (
        <div className="statistics-grid">
          <div className="stat-card">
            <h3>Typing Tests</h3>
            <p className="value">{statistics.total_tests}</p>
            <p className="label">tests completed</p>
          </div>

          <div className="stat-card">
            <h3>Best WPM</h3>
            <p className="value">{statistics.best_wpm.toFixed(2)}</p>
            <p className="label">words per minute</p>
          </div>

          <div className="stat-card">
            <h3>Average WPM</h3>
            <p className="value">{statistics.average_wpm.toFixed(2)}</p>
            <p className="label">across all tests</p>
          </div>

          <div className="stat-card">
            <h3>Best Accuracy</h3>
            <p className="value">{statistics.best_accuracy.toFixed(2)}%</p>
            <p className="label">highest accuracy</p>
          </div>

          <div className="stat-card">
            <h3>Average Accuracy</h3>
            <p className="value">{statistics.average_accuracy.toFixed(2)}%</p>
            <p className="label">average accuracy</p>
          </div>

          <div className="stat-card">
            <h3>Total Typing Time</h3>
            <p className="value">{(statistics.total_typing_time / 60).toFixed(0)}m</p>
            <p className="label">minutes typed</p>
          </div>
        </div>
      )}

      <div className="recent-results-section">
        <h2>Recent Results</h2>
        {recentResults.length === 0 ? (
          <p className="no-results">No results yet. Take your first test!</p>
        ) : (
          <div className="results-list">
            {recentResults.map((result) => (
              <div key={result.id} className="result-item">
                <div className="result-date">
                  {new Date(result.created_at).toLocaleDateString()}
                </div>
                <div className="result-stats">
                  <span className="wpm">{result.wpm.toFixed(2)} WPM</span>
                  <span className="accuracy">{result.accuracy.toFixed(2)}%</span>
                  <span className="mistakes">{result.mistakes_count} mistakes</span>
                </div>
                <div className="result-badge">
                  {result.passed ? (
                    <span className="badge passed">✓ Passed</span>
                  ) : (
                    <span className="badge failed">✗ Try Again</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
