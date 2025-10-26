import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Analysis.css';

export default function Analysis() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state?.report;
  const questions = state?.questions || [];
  const responses = state?.responses || [];

  if (!report) {
    return (
      <div className="analysis-empty">
        <h2>No analysis available</h2>
        <button className="btn" onClick={() => navigate('/resume-display')}>Go to Resume</button>
      </div>
    );
  }

  const { total, breakdown, skills, aiAnalysis } = report;

  return (
    <div className="analysis-container">
      <header className="analysis-header">
        <h1>📊 Interview Analysis</h1>
        <p>Performance report and insights</p>
      </header>

      <main className="analysis-content">
        <section className="score-card">
          <div className="score-circle">
            <div className="score-fill" style={{ background: `conic-gradient(#22c55e ${total*3.6}deg, #e5e7eb 0deg)` }} />
            <div className="score-text">{total}%</div>
          </div>
          <div className="score-meta">
            <h3>Overall Score</h3>
            <p>Based on response length, relevance, and clarity</p>
          </div>
        </section>

        <section className="breakdown">
          <h3>Category Breakdown</h3>
          <div className="bar">
            <span>Length</span>
            <div className="track"><div className="fill" style={{ width: `${breakdown.length}%` }} /></div>
            <b>{breakdown.length}%</b>
          </div>
          <div className="bar">
            <span>Relevance</span>
            <div className="track"><div className="fill" style={{ width: `${breakdown.relevance}%` }} /></div>
            <b>{breakdown.relevance}%</b>
          </div>
          <div className="bar">
            <span>Clarity</span>
            <div className="track"><div className="fill" style={{ width: `${breakdown.clarity}%` }} /></div>
            <b>{breakdown.clarity}%</b>
          </div>
          {breakdown.emotion && (
            <div className="bar">
              <span>Emotion</span>
              <div className="track"><div className="fill emotion-fill" style={{ width: `${breakdown.emotion}%` }} /></div>
              <b>{breakdown.emotion}%</b>
            </div>
          )}
          {breakdown.posture && (
            <div className="bar">
              <span>Posture</span>
              <div className="track"><div className="fill posture-fill" style={{ width: `${breakdown.posture}%` }} /></div>
              <b>{breakdown.posture}%</b>
            </div>
          )}
          {breakdown.grammar && (
            <div className="bar">
              <span>Grammar</span>
              <div className="track"><div className="fill grammar-fill" style={{ width: `${breakdown.grammar}%` }} /></div>
              <b>{breakdown.grammar}%</b>
            </div>
          )}
        </section>

        <section className="skills-section">
          <h3>Detected Resume Skills</h3>
          <div className="skills-grid">
            {skills.length ? skills.map((s, i) => <span key={i} className="chip">{s}</span>) : <i>No skills detected</i>}
          </div>
        </section>

        {aiAnalysis && (
          <section className="ai-analysis-section">
            <h3>AI Analysis Results</h3>
            <div className="ai-analysis-grid">
              {aiAnalysis.emotion && (
                <div className="ai-analysis-card">
                  <h4>Emotion Analysis</h4>
                  <div className="emotion-result">
                    <span className="emotion-emoji">
                      {aiAnalysis.emotion.emotion === 'happy' ? '😊' :
                       aiAnalysis.emotion.emotion === 'sad' ? '😢' :
                       aiAnalysis.emotion.emotion === 'angry' ? '😠' :
                       aiAnalysis.emotion.emotion === 'surprised' ? '😲' :
                       aiAnalysis.emotion.emotion === 'confused' ? '😕' : '😐'}
                    </span>
                    <div className="emotion-details">
                      <div className="emotion-name">{aiAnalysis.emotion.emotion}</div>
                      <div className="emotion-confidence">
                        {Math.round(aiAnalysis.emotion.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {aiAnalysis.posture && (
                <div className="ai-analysis-card">
                  <h4>Posture Analysis</h4>
                  <div className="posture-result">
                    <div 
                      className="posture-indicator"
                      style={{ 
                        backgroundColor: aiAnalysis.posture.posture === 'excellent' ? '#10b981' :
                                       aiAnalysis.posture.posture === 'good' ? '#3b82f6' :
                                       aiAnalysis.posture.posture === 'slouching' ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {aiAnalysis.posture.posture}
                    </div>
                    <div className="posture-score">
                      {Math.round(aiAnalysis.posture.score)}/100
                    </div>
                  </div>
                </div>
              )}
              
              {aiAnalysis.grammar && (
                <div className="ai-analysis-card">
                  <h4>Grammar Analysis</h4>
                  <div className="grammar-result">
                    <div className="grammar-score-circle">
                      <span>{aiAnalysis.grammar.score}</span>
                    </div>
                    <div className="grammar-details">
                      <div className="grammar-label">Grammar Score</div>
                      <div className="grammar-corrections">
                        {aiAnalysis.grammar.corrections?.length || 0} suggestions
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="qa-section">
          <h3>Responses Overview</h3>
          <div className="qa-list">
            {questions.map((q, idx) => (
              <div key={idx} className="qa-card">
                <div className="q">Q{idx+1}. {q}</div>
                <div className="a">{responses[idx] || <i>No response</i>}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="analysis-actions">
        <button className="btn secondary" onClick={() => navigate('/resume-display')}>← Back to Resume</button>
        <button className="btn primary" onClick={() => navigate('/interview', { state })}>Retake Interview →</button>
      </footer>
    </div>
  );
}