import { useState, useEffect } from 'react';
import { resultsAPI } from '../api';
import './Results.css';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('recent');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

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

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return <div className="results-page"><p>Loading...</p></div>;
  }

  return (
    <div className="results-page">
      <h1>My Typing Test Results</h1>

      <div className="results-filters">
        <button
          className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
          onClick={() => {
            setFilter('recent');
            setSortConfig({ key: 'created_at', direction: 'desc' });
          }}
        >
          Recent
        </button>
        <button
          className={`filter-btn ${filter === 'best-wpm' ? 'active' : ''}`}
          onClick={() => {
            setFilter('best-wpm');
            setSortConfig({ key: 'wpm', direction: 'desc' });
          }}
        >
          Best WPM
        </button>
        <button
          className={`filter-btn ${filter === 'best-accuracy' ? 'active' : ''}`}
          onClick={() => {
            setFilter('best-accuracy');
            setSortConfig({ key: 'accuracy', direction: 'desc' });
          }}
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
                <th onClick={() => handleSort('created_at')} style={{cursor: 'pointer'}}>
                  Date {sortConfig.key === 'created_at' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('wpm')} style={{cursor: 'pointer'}}>
                  WPM {sortConfig.key === 'wpm' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('accuracy')} style={{cursor: 'pointer'}}>
                  Accuracy {sortConfig.key === 'accuracy' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('raw_wpm')} style={{cursor: 'pointer'}}>
                  Raw WPM {sortConfig.key === 'raw_wpm' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('mistakes_count')} style={{cursor: 'pointer'}}>
                  Mistakes {sortConfig.key === 'mistakes_count' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('time_penalty_seconds')} style={{cursor: 'pointer'}}>
                  Time Penalty {sortConfig.key === 'time_penalty_seconds' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('adjusted_duration')} style={{cursor: 'pointer'}}>
                  Duration {sortConfig.key === 'adjusted_duration' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result) => (
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
