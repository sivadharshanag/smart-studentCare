import React, { useState, useEffect } from 'react';
import './GrammarCorrection.css';

const GrammarCorrection = ({ text, onCorrections }) => {
  const [corrections, setCorrections] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [grammarScore, setGrammarScore] = useState(0);

  useEffect(() => {
    if (text && text.trim().length > 0) {
      analyzeGrammar(text);
    } else {
      setCorrections([]);
      setGrammarScore(0);
    }
  }, [text]);

  const analyzeGrammar = async (inputText) => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic grammar rules (in a real app, this would use an AI service)
    const detectedCorrections = [];
    let score = 100;
    
    // Check for common grammar issues
    const issues = [
      {
        pattern: /\bi\b/g,
        replacement: 'I',
        message: 'Capitalize "I" when referring to yourself',
        severity: 'medium'
      },
      {
        pattern: /\b(its|it's)\b/g,
        replacement: (match) => match === 'its' ? "it's" : "its",
        message: 'Check "its" vs "it\'s" usage',
        severity: 'high'
      },
      {
        pattern: /\b(your|you're)\b/g,
        replacement: (match) => match === 'your' ? "you're" : "your",
        message: 'Check "your" vs "you\'re" usage',
        severity: 'high'
      },
      {
        pattern: /\b(there|their|they're)\b/g,
        replacement: (match) => {
          if (match === 'there') return "their/they're";
          if (match === 'their') return "there/they're";
          return "there/their";
        },
        message: 'Check "there", "their", "they\'re" usage',
        severity: 'high'
      },
      {
        pattern: /\b(than|then)\b/g,
        replacement: (match) => match === 'than' ? "then" : "than",
        message: 'Check "than" vs "then" usage',
        severity: 'medium'
      },
      {
        pattern: /\b(affect|effect)\b/g,
        replacement: (match) => match === 'affect' ? "effect" : "affect",
        message: 'Check "affect" vs "effect" usage',
        severity: 'medium'
      },
      {
        pattern: /\b(loose|lose)\b/g,
        replacement: (match) => match === 'loose' ? "lose" : "loose",
        message: 'Check "loose" vs "lose" usage',
        severity: 'medium'
      },
      {
        pattern: /\b(accept|except)\b/g,
        replacement: (match) => match === 'accept' ? "except" : "accept",
        message: 'Check "accept" vs "except" usage',
        severity: 'medium'
      }
    ];

    issues.forEach(issue => {
      const matches = inputText.match(issue.pattern);
      if (matches) {
        matches.forEach(match => {
          const replacement = typeof issue.replacement === 'function' 
            ? issue.replacement(match) 
            : issue.replacement;
          
          if (replacement !== match) {
            detectedCorrections.push({
              original: match,
              corrected: replacement,
              message: issue.message,
              severity: issue.severity,
              position: inputText.indexOf(match)
            });
            score -= issue.severity === 'high' ? 15 : 10;
          }
        });
      }
    });

    // Check for sentence structure issues
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      
      // Check for run-on sentences
      if (trimmed.split(',').length > 3) {
        detectedCorrections.push({
          original: trimmed,
          corrected: 'Consider breaking into shorter sentences',
          message: 'This sentence might be too long. Consider breaking it into shorter, clearer sentences.',
          severity: 'low',
          position: inputText.indexOf(trimmed)
        });
        score -= 5;
      }
      
      // Check for sentence fragments
      if (trimmed.length > 0 && !trimmed.match(/^[A-Z]/)) {
        detectedCorrections.push({
          original: trimmed,
          corrected: 'Capitalize the first letter',
          message: 'Sentence should start with a capital letter',
          severity: 'medium',
          position: inputText.indexOf(trimmed)
        });
        score -= 8;
      }
    });

    // Check for professional language suggestions
    const professionalSuggestions = [
      {
        pattern: /\b(awesome|amazing|cool)\b/gi,
        replacement: 'excellent',
        message: 'Use more professional language',
        severity: 'low'
      },
      {
        pattern: /\b(guys|dudes)\b/gi,
        replacement: 'team/colleagues',
        message: 'Use more professional language',
        severity: 'low'
      },
      {
        pattern: /\b(yeah|yep|nope)\b/gi,
        replacement: 'yes/no',
        message: 'Use more professional language',
        severity: 'low'
      }
    ];

    professionalSuggestions.forEach(suggestion => {
      const matches = inputText.match(suggestion.pattern);
      if (matches) {
        matches.forEach(match => {
          detectedCorrections.push({
            original: match,
            corrected: suggestion.replacement,
            message: suggestion.message,
            severity: suggestion.severity,
            position: inputText.indexOf(match)
          });
          score -= 3;
        });
      }
    });

    setCorrections(detectedCorrections);
    setGrammarScore(Math.max(0, score));
    setIsAnalyzing(false);
    
    if (onCorrections) {
      onCorrections(detectedCorrections, score);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  if (!text || text.trim().length === 0) {
    return (
      <div className="grammar-correction-empty">
        <div className="empty-icon">📝</div>
        <p>Start typing to see grammar suggestions</p>
      </div>
    );
  }

  return (
    <div className="grammar-correction">
      <div className="grammar-header">
        <h3>Grammar Analysis</h3>
        <div className="grammar-score">
          <div 
            className="score-circle"
            style={{ 
              background: `conic-gradient(${getScoreColor(grammarScore)} ${grammarScore * 3.6}deg, #e5e7eb 0deg)` 
            }}
          >
            <span className="score-text">{grammarScore}</span>
          </div>
          <div className="score-label">{getScoreLabel(grammarScore)}</div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="analyzing-indicator">
          <div className="loading-spinner"></div>
          <span>Analyzing grammar...</span>
        </div>
      )}

      {corrections.length > 0 ? (
        <div className="corrections-list">
          <h4>Suggestions ({corrections.length})</h4>
          {corrections.map((correction, index) => (
            <div 
              key={index} 
              className={`correction-item ${correction.severity}`}
            >
              <div className="correction-header">
                <span className="severity-icon">
                  {getSeverityIcon(correction.severity)}
                </span>
                <span className="severity-label">
                  {correction.severity.toUpperCase()}
                </span>
              </div>
              <div className="correction-content">
                <div className="correction-text">
                  <span className="original">"{correction.original}"</span>
                  <span className="arrow">→</span>
                  <span className="corrected">"{correction.corrected}"</span>
                </div>
                <div className="correction-message">
                  {correction.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isAnalyzing && (
        <div className="no-corrections">
          <div className="success-icon">✅</div>
          <p>Great! No grammar issues detected.</p>
        </div>
      )}

      <div className="grammar-tips">
        <h4>Professional Writing Tips</h4>
        <ul>
          <li>Use active voice instead of passive voice</li>
          <li>Be specific and concrete in your examples</li>
          <li>Use strong action verbs</li>
          <li>Keep sentences concise and clear</li>
          <li>Proofread for typos and grammar errors</li>
        </ul>
      </div>
    </div>
  );
};

export default GrammarCorrection;
