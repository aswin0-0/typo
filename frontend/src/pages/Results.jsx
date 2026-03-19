import { useState, useEffect } from 'react';
import { resultsAPI } from '../api';
import './Results.css';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    loadResults();
  }, [filter]);

  const loadResults = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (filter === 'best-wpm') {
        response = await resultsAPI.getBestResults('wpm', 50);
      } else if (filter === 'best-accuracy') {
        response = await resultsAPI.getBestResults('accuracy', 50);
      } else {
        response = await resultsAPI.getRecent(50);
      }
      setResults(response.data);
    } catch (err) {
      setError('Failed to load results.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="results-page"><p>Loading...</p></div>;
  }

  return (
    <div className="results-page">
      <h1>My Typing Test Results</h1>

      <div className="results-filters">
        <button
          className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
          onClick={() => setFilter('recent')}
        >
          Recent
        </button>
        <button
          className={`filter-btn ${filter === 'best-wpm' ? 'active' : ''}`}
          onClick={() => setFilter('best-wpm')}
        >
          Best WPM
        </button>
        <button
          className={`filter-btn ${filter === 'best-accuracy' ? 'active' : ''}`}
          onClick={() => setFilter('best-accuracy')}
        >
          Best Accuracy
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results.length === 0 ? (
        <div className="no-results">
          <p>No typing test results found. Take your first test!</p>
        </div>
      ) : (
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Raw WPM</th>
                <th>Mistakes</th>
                <th>Time Penalty</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className={result.passed ? 'passed' : 'failed'}>
                  <td>{new Date(result.created_at).toLocaleDateString()} {new Date(result.created_at).toLocaleTimeString()}</td>
                  <td className="wpm-value">{result.wpm.toFixed(2)}</td>
                  <td className="accuracy-value">{result.accuracy.toFixed(2)}%</td>
                  <td>{result.raw_wpm.toFixed(2)}</td>
                  <td>{result.mistakes_count}</td>
                  <td className="penalty-value">-{result.time_penalty_seconds.toFixed(1)}s</td>
                  <td>{result.adjusted_duration.toFixed(1)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Results;
