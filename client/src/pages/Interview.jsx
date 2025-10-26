import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnalysisPanel from '../components/AnalysisPanel';
import GrammarCorrection from '../components/GrammarCorrection';
import './styles/Interview.css';

const Interview = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const resumeTextFromStorage = (() => { try { return localStorage.getItem('resumeText') || ''; } catch (e) { return ''; } })();
  const resumeText = state?.resumeText || resumeTextFromStorage || '';

  const [serverQuestions, setServerQuestions] = useState([]);
  const [loadingQs, setLoadingQs] = useState(false);
  const [qsError, setQsError] = useState('');

  useEffect(() => {
    async function fetchQs() {
      if (!resumeText) return;
      try {
        setLoadingQs(true);
        setQsError('');
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, count: 10 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch questions');
        setServerQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (e) {
        setQsError(e.message);
      } finally {
        setLoadingQs(false);
      }
    }
    fetchQs();
  }, [resumeText]);

  const fallbackQuestions = useMemo(() => {
    const qs = generateQuestions(resumeText);
    return qs && qs.length ? qs : [
      'Give a short elevator pitch about yourself based on your resume.',
      'Describe a challenging problem you solved recently and your approach.',
      'How do you structure your learning when picking up a new technology?'
    ];
  }, [resumeText]);

  const questions = serverQuestions.length ? serverQuestions : fallbackQuestions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(Array(questions.length).fill(''));
  
  // AI Analysis States
  const [currentEmotion, setCurrentEmotion] = useState({ emotion: 'neutral', confidence: 0 });
  const [currentPosture, setCurrentPosture] = useState({ posture: 'good', score: 0 });
  const [grammarCorrections, setGrammarCorrections] = useState([]);
  const [grammarScore, setGrammarScore] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (!resumeText || resumeText.length < 5) {
      navigate('/resume-display');
    }
  }, [resumeText, navigate]);

  const handleResponseChange = (value) => {
    const updated = [...responses];
    updated[currentQuestion] = value;
    setResponses(updated);
  };


  const handleEmotionChange = (emotionData) => {
    setCurrentEmotion(emotionData);
  };

  const handlePostureChange = (postureData) => {
    setCurrentPosture(postureData);
  };

  const handleGrammarCorrections = (corrections, score) => {
    setGrammarCorrections(corrections);
    setGrammarScore(score);
  };


  const previousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const report = computeEnhancedReport(resumeText, questions, responses, {
        emotions: currentEmotion,
        posture: currentPosture,
        grammar: { score: grammarScore, corrections: grammarCorrections }
      });
      navigate('/analysis', { state: { report, questions, responses, resumeText } });
    }
  };

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h1>🎤 AI Interview Session</h1>
        <p>Question {currentQuestion + 1} of {questions.length}</p>
        <div className="analysis-toggle">
          <button 
            className={`toggle-btn ${showAnalysis ? 'active' : ''}`}
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            {showAnalysis ? 'Hide Analysis' : 'Show AI Analysis'}
          </button>
        </div>
      </div>

      {loadingQs && (
        <div style={{ margin: '8px 0' }}>Generating personalized questions...</div>
      )}
      {qsError && (
        <div style={{ margin: '8px 0', color: '#ef4444' }}>Could not fetch server questions: {qsError}</div>
      )}

      {showAnalysis && (
        <div className="ai-analysis-panel">
          <AnalysisPanel text={responses[currentQuestion]} />
        </div>
      )}

      <div className="interview-content">
        <div className="interview-section">
          <div className="question-container">
            <div className="question-header">
              <h3>Current Question</h3>
            </div>
            <div className="question-text">
              <p>{questions[currentQuestion]}</p>
            </div>
          </div>

          <div className="response-section">
            <div className="response-header">
              <h3>Your Response</h3>
              <div className="response-stats">
                <span className="word-count">
                  {responses[currentQuestion] ? responses[currentQuestion].split(/\s+/).length : 0} words
                </span>
                <span className="char-count">
                  {responses[currentQuestion] ? responses[currentQuestion].length : 0} characters
                </span>
              </div>
            </div>
            <div className="transcript-container">
              <textarea
                className="response-textarea"
                placeholder="Type your answer here (60–120 seconds worth of content is ideal)..."
                value={responses[currentQuestion]}
                onChange={(e) => handleResponseChange(e.target.value)}
                rows={8}
              />
            </div>
            <div className="response-actions">
              <button 
                className="action-btn edit-btn"
                onClick={() => handleResponseChange('')}
                disabled={!responses[currentQuestion]}
              >
                ✏️ Clear Response
              </button>
            </div>
          </div>
        </div>

        {responses[currentQuestion] && (
          <div className="grammar-analysis">
            <GrammarCorrection
              text={responses[currentQuestion]}
              onCorrections={handleGrammarCorrections}
            />
          </div>
        )}

        <div className="interview-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {currentQuestion + 1} of {questions.length} questions completed
          </span>
        </div>

        <div className="interview-controls">
          <button 
            className="control-btn prev-btn"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>
          <button 
            className="control-btn next-btn"
            onClick={nextQuestion}
          >
            {currentQuestion === questions.length - 1 ? 'Finish & View Analysis' : 'Next →'}
          </button>
        </div>
      </div>

      <div className="interview-footer">
        <button 
          className="exit-btn"
          onClick={() => navigate('/resume-display')}
        >
          ← Exit Interview
        </button>
      </div>
    </div>
  );
};

function parseResume(resume) {
  const lower = resume.toLowerCase();
  const skills = Array.from(new Set((resume.match(/[A-Za-z][A-Za-z+#.\-]{1,30}/g) || [])
    .filter(w => /react|node|python|java|mern|mongodb|express|docker|git|fastapi|streamlit|machine|deep|cnn|resnet|rest|api|bootstrap|css|html|pandas|numpy|ml|dl|ai|kubernetes|postgres|sql|javascript/i.test(w))
    .map(s => s.toLowerCase())));

  const projects = [];
  const projectPatterns = [/parkinson/i, /forecast|stock/i, /learning\s+and\s+career/i, /doctor/i];
  projectPatterns.forEach(p => { if (p.test(lower)) projects.push(p.source); });

  const certifications = [];
  if (/azure ai engineer/i.test(lower)) certifications.push('Azure AI Engineer');
  if (/oracle certified/i.test(lower)) certifications.push('Oracle Certified');

  return { skills, projects, certifications };
}

function generateQuestions(text) {
  const base = [
    'Give a concise professional summary tailored to this role (30–45 seconds).',
    'Describe a complex problem you owned end‑to‑end. What was the context, your approach, and measurable outcome?',
    'How do you structure your learning path when adopting a new technology under deadlines?'
  ];

  if (!text) return base;

  const { skills, projects, certifications } = parseResume(text);
  const qs = [...base];

  // Skill-driven questions (professional phrasing)
  skills.slice(0, 8).forEach(skill => {
    qs.push(`Regarding ${skill}: describe a production scenario where you applied it. What architectural decisions did you make, what trade‑offs did you consider, and what metrics (latency, throughput, cost, accuracy) improved?`);
  });

  // Project-driven deep dives
  if (projects.length > 0) {
    qs.push('Select your most impactful project. Explain the problem statement, target users, high‑level architecture, and why you chose that stack over alternatives.');
    qs.push('Walk through the data flow/critical path of the system. Where were the bottlenecks and how did you mitigate them?');
    qs.push('What quality gates did you implement (testing, CI/CD, observability)? Share specific tools and failure scenarios you guarded against.');
    qs.push('How did you define success and measure it? Provide concrete KPIs (e.g., p95 latency, model F1, conversion rate) and improvements achieved.');
  }

  // Internship/experience cues
  if (/intern/i.test(text)) {
    qs.push('From your internship, cite one responsibility that matured into ownership. What changed in your decision‑making and stakeholder communication?');
  }

  // Certification-driven
  certifications.forEach(c => qs.push(`How has your ${c} certification influenced your design choices or security/compliance practices in real work? Give a concrete example.`));

  // Design/operability
  qs.push('Describe a time you simplified a design to reduce risk or cost without sacrificing core requirements.');

  // Behavioral with STAR guidance
  qs.push('Share a failure or critical incident. Use STAR: Situation, Task, Actions, Result, and the Lesson you applied later.');

  // Communication & collaboration
  qs.push('Explain a technical concept from your resume to a non‑technical stakeholder. How would you tailor the message and artifacts?');

  return Array.from(new Set(qs)).slice(0, 12);
}

function computeReport(resume, questions, responses) {
  const { skills } = parseResume(resume);
  const responseScores = responses.map((r) => {
    const lengthScore = Math.min(40, Math.floor((r.trim().split(/\s+/).length / 120) * 40));
    const skillHits = skills.reduce((acc, s) => acc + (new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(r) ? 1 : 0), 0);
    const relevanceScore = Math.min(40, skillHits * 5);
    const clarityScore = r ? 20 : 0;
    return { lengthScore, relevanceScore, clarityScore, total: lengthScore + relevanceScore + clarityScore };
  });

  const total = Math.round(responseScores.reduce((s, x) => s + x.total, 0) / Math.max(1, responses.length));
  const breakdown = {
    length: Math.round(responseScores.reduce((s, x) => s + x.lengthScore, 0) / Math.max(1, responses.length)),
    relevance: Math.round(responseScores.reduce((s, x) => s + x.relevanceScore, 0) / Math.max(1, responses.length)),
    clarity: Math.round(responseScores.reduce((s, x) => s + x.clarityScore, 0) / Math.max(1, responses.length)),
  };

  return { total, breakdown, skills, responses: responseScores };
}

function computeEnhancedReport(resume, questions, responses, aiData) {
  const { skills } = parseResume(resume);
  const responseScores = responses.map((r) => {
    const lengthScore = Math.min(40, Math.floor((r.trim().split(/\s+/).length / 120) * 40));
    const skillHits = skills.reduce((acc, s) => acc + (new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(r) ? 1 : 0), 0);
    const relevanceScore = Math.min(40, skillHits * 5);
    const clarityScore = r ? 20 : 0;
    return { lengthScore, relevanceScore, clarityScore, total: lengthScore + relevanceScore + clarityScore };
  });

  // Enhanced scoring with AI data
  const emotionScore = aiData.emotions ? 
    (aiData.emotions.emotion === 'happy' ? 30 : 
     aiData.emotions.emotion === 'neutral' ? 20 : 
     aiData.emotions.emotion === 'confused' ? 10 : 15) : 15;
  
  const postureScore = aiData.posture ? 
    (aiData.posture.posture === 'excellent' ? 20 : 
     aiData.posture.posture === 'good' ? 15 : 
     aiData.posture.posture === 'slouching' ? 8 : 5) : 10;
  
  const grammarScore = aiData.grammar ? aiData.grammar.score * 0.1 : 10;

  const total = Math.round(responseScores.reduce((s, x) => s + x.total, 0) / Math.max(1, responses.length));
  const enhancedTotal = Math.min(100, total + emotionScore + postureScore + grammarScore);
  
  const breakdown = {
    length: Math.round(responseScores.reduce((s, x) => s + x.lengthScore, 0) / Math.max(1, responses.length)),
    relevance: Math.round(responseScores.reduce((s, x) => s + x.relevanceScore, 0) / Math.max(1, responses.length)),
    clarity: Math.round(responseScores.reduce((s, x) => s + x.clarityScore, 0) / Math.max(1, responses.length)),
    emotion: emotionScore,
    posture: postureScore,
    grammar: grammarScore
  };

  return { 
    total: enhancedTotal, 
    breakdown, 
    skills, 
    responses: responseScores,
    aiAnalysis: {
      emotion: aiData.emotions,
      posture: aiData.posture,
      grammar: aiData.grammar
    }
  };
}

export default Interview; 