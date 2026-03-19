import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordListAPI, resultsAPI } from '../api';
import './TypingTest.css';

function TypingTest() {
  const navigate = useNavigate();
  const [wordLists, setWordLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [originalTimeLeft, setOriginalTimeLeft] = useState(60);
  const [stats, setStats] = useState({
    correctCharacters: 0,
    incorrectCharacters: 0,
    totalCharacters: 0,
    mistakes: 0,
    timePenalty: 0,
  });
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const TIME_PENALTY_PER_MISTAKE = 2; // seconds
  const INITIAL_TIME = 60; // seconds

  useEffect(() => {
    loadWordLists();
  }, []);

  const loadWordLists = async () => {
    try {
      const response = await wordListAPI.getAll();
      setWordLists(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load word lists:', err);
      setLoading(false);
    }
  };

  const handleSelectList = (listId) => {
    const list = wordLists.find((l) => l.id === listId);
    setSelectedList(list);
    setWords(list.words);
    setCurrentWordIndex(0);
    setUserInput('');
    setTimeLeft(INITIAL_TIME);
    setOriginalTimeLeft(INITIAL_TIME);
    setStats({
      correctCharacters: 0,
      incorrectCharacters: 0,
      totalCharacters: 0,
      mistakes: 0,
      timePenalty: 0,
    });
    setTestCompleted(false);
    setResults(null);
  };

  const startTest = () => {
    if (!selectedList) {
      alert('Please select a word list first!');
      return;
    }
    setTestStarted(true);
    inputRef.current?.focus();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endTest = async () => {
    setTestStarted(false);
    setTestCompleted(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate final WPM and accuracy
    const adjustedDuration = (originalTimeLeft - stats.timePenalty) / 60;
    const rawWPM = (stats.totalCharacters / 5) / (originalTimeLeft / 60);
    const finalWPM = (stats.correctCharacters / 5) / (adjustedDuration > 0 ? adjustedDuration : 0.1);
    const accuracy = stats.totalCharacters > 0 
      ? (stats.correctCharacters / stats.totalCharacters) * 100 
      : 0;

    const testResult = {
      word_list: selectedList.id,
      duration_seconds: originalTimeLeft,
      test_mode: 'time',
      words_typed: currentWordIndex,
      correct_characters: stats.correctCharacters,
      incorrect_characters: stats.incorrectCharacters,
      total_characters_attempted: stats.totalCharacters,
      wpm: Math.max(0, finalWPM),
      raw_wpm: Math.max(0, rawWPM),
      accuracy: Math.min(100, Math.max(0, accuracy)),
      mistakes_count: stats.mistakes,
      time_penalty_seconds: stats.timePenalty,
      adjusted_duration: Math.max(0, originalTimeLeft - stats.timePenalty),
      passed: accuracy > 75,
      completed: true,
      notes: '',
    };

    try {
      await resultsAPI.submitResult(testResult);
      setResults(testResult);
    } catch (err) {
      console.error('Failed to submit result:', err);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (!testStarted && input.length > 0) {
      startTest();
    }

    const currentWord = words[currentWordIndex];
    const typedChars = input.split('');
    let correct = 0;
    let incorrect = 0;

    typedChars.forEach((char, index) => {
      if (index < currentWord.length) {
        if (char === currentWord[index]) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        incorrect++;
      }
    });

    // Check if space is pressed to move to next word
    if (input.endsWith(' ')) {
      const typedWord = input.trim();
      const isCorrect = typedWord === currentWord;

      setStats((prev) => {
        const newStats = { ...prev };
        if (isCorrect) {
          newStats.correctCharacters += typedWord.length;
        } else {
          newStats.incorrectCharacters += Math.abs(typedWord.length - currentWord.length);
          if (typedWord !== currentWord) {
            newStats.mistakes++;
            // Apply time penalty
            const penalty = Math.min(TIME_PENALTY_PER_MISTAKE, timeLeft - 1);
            newStats.timePenalty += penalty;
            setTimeLeft((prev) => Math.max(1, prev - penalty));
          }
        }
        newStats.totalCharacters += typedWord.length;
        return newStats;
      });

      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      setUserInput('');
    }
  };

  if (loading) {
    return <div className="typing-test">Loading...</div>;
  }

  if (testCompleted && results) {
    return (
      <div className="typing-test">
        <div className="results-container">
          <h2>Test Completed!</h2>

          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">WPM</span>
              <span className="result-value">{results.wpm.toFixed(2)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Accuracy</span>
              <span className="result-value">{results.accuracy.toFixed(2)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Mistakes</span>
              <span className="result-value">{results.mistakes_count}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Time Penalty</span>
              <span className="result-value">{results.time_penalty_seconds.toFixed(1)}s</span>
            </div>
          </div>

          <div className="results-details">
            <p><strong>Raw WPM:</strong> {results.raw_wpm.toFixed(2)}</p>
            <p><strong>Adjusted Duration:</strong> {results.adjusted_duration.toFixed(1)}s</p>
            <p><strong>Words Typed:</strong> {results.words_typed}</p>
            <p><strong>Correct Characters:</strong> {results.correct_characters}</p>
            <p><strong>Incorrect Characters:</strong> {results.incorrect_characters}</p>
          </div>

          <div className="results-actions">
            <button className="btn-primary" onClick={() => loadWordLists()}>
              Take Another Test
            </button>
            <button className="btn-secondary" onClick={() => navigate('/results')}>
              View All Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedList) {
    return (
      <div className="typing-test">
        <h2>Select a Word List</h2>
        <div className="word-lists-grid">
          {wordLists.map((list) => (
            <button
              key={list.id}
              className="word-list-card"
              onClick={() => handleSelectList(list.id)}
            >
              <h3>{list.name}</h3>
              <p className="difficulty">{list.difficulty.toUpperCase()}</p>
              <p className="description">{list.description}</p>
              <p className="word-count">{list.words.length} words</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="typing-test">
      <div className="test-header">
        <h2>{selectedList.name}</h2>
        <div className="test-stats">
          <div className="stat">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">WPM:</span>
            <span className="stat-value">
              {testStarted ? ((stats.correctCharacters / 5) / ((originalTimeLeft - timeLeft + 1) / 60)).toFixed(2) : 0}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">
              {stats.totalCharacters > 0 
                ? ((stats.correctCharacters / stats.totalCharacters) * 100).toFixed(2) 
                : 0}%
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Mistakes:</span>
            <span className="stat-value">{stats.mistakes}</span>
          </div>
        </div>
      </div>

      <div className="test-display">
        <div className="words-container">
          {words.map((word, index) => (
            <span
              key={index}
              className={`word ${index === currentWordIndex ? 'current' : ''} ${
                index < currentWordIndex ? 'completed' : ''
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {!testStarted && (
        <div className="start-message">
          <p>Click the input field and start typing to begin the test</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        className="typing-input"
        placeholder="Start typing here..."
        value={userInput}
        onChange={handleInputChange}
        disabled={testCompleted || timeLeft === 0}
        autoFocus
      />

      {testStarted && (
        <button className="end-test-btn" onClick={endTest}>
          End Test
        </button>
      )}
    </div>
  );
}

export default TypingTest;
