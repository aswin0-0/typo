import { useState, useEffect } from 'react';
import { statisticsAPI } from '../api';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('best_wpm');

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await statisticsAPI.getLeaderboard(sortBy, 100);
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="leaderboard-page"><p>Loading leaderboard...</p></div>;
  }

  return (
    <div className="leaderboard-page">
      <h1>🏆 Global Leaderboard</h1>

      <div className="leaderboard-controls">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="best_wpm">Best WPM</option>
          <option value="average_wpm">Average WPM</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {leaderboard.length === 0 ? (
        <div className="no-data">
          <p>No leaderboard data available yet.</p>
        </div>
      ) : (
        <div className="leaderboard-container">
          <div className="leaderboard-table">
            {leaderboard.map((entry, index) => (
              <div key={index} className="leaderboard-row">
                <div className="rank">
                  {index === 0 && <span className="medal">🥇</span>}
                  {index === 1 && <span className="medal">🥈</span>}
                  {index === 2 && <span className="medal">🥉</span>}
                  {index > 2 && <span className="number">#{entry.rank}</span>}
                </div>

                <div className="username">
                  <span>{entry.username}</span>
                </div>

                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-label">Best WPM</span>
                    <span className="stat-value">{entry.best_wpm.toFixed(2)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg WPM</span>
                    <span className="stat-value">{entry.average_wpm.toFixed(2)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Best Acc</span>
                    <span className="stat-value">{entry.best_accuracy.toFixed(2)}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tests</span>
                    <span className="stat-value">{entry.total_tests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
