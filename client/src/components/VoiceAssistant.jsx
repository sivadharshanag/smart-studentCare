import React, { useState, useEffect, useRef } from 'react';
import './VoiceAssistant.css';

const VoiceAssistant = ({ onTranscript, onSpeaking, isListening, onStartListening, onStopListening }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [synthesis, setSynthesis] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsProcessing(true);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setCurrentTranscript(finalTranscript);
        setInterimTranscript(interimTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsProcessing(false);
      };
      
      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsProcessing(false);
      };
      
      setRecognition(recognitionInstance);
      setSynthesis(SpeechSynthesis);
    }
  }, [onTranscript]);

  const startListening = () => {
    if (recognition && !isProcessing) {
      recognition.start();
      onStartListening();
    }
  };

  const stopListening = () => {
    if (recognition && isProcessing) {
      recognition.stop();
      onStopListening();
    }
  };

  const speak = (text, onComplete) => {
    if (synthesis) {
      // Stop any ongoing speech
      synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        onSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeaking(false);
        if (onComplete) onComplete();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        onSpeaking(false);
      };
      
      synthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
      onSpeaking(false);
    }
  };

  // Expose methods to parent component
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    speak,
    stopSpeaking,
    startListening,
    stopListening
  }));

  if (!isSupported) {
    return (
      <div className="voice-assistant-error">
        <div className="error-icon">🎤</div>
        <h3>Voice Assistant Not Supported</h3>
        <p>Your browser doesn't support speech recognition or synthesis. Please use a modern browser like Chrome, Firefox, or Edge.</p>
      </div>
    );
  }

  return (
    <div className="voice-assistant">
      <div className="voice-controls">
        <button
          className={`voice-btn listen-btn ${isProcessing ? 'active' : ''}`}
          onClick={isProcessing ? stopListening : startListening}
          disabled={isSpeaking}
        >
          <span className="voice-icon">
            {isProcessing ? '⏹️' : '🎤'}
          </span>
          <span className="voice-label">
            {isProcessing ? 'Stop Listening' : 'Start Listening'}
          </span>
        </button>

        <button
          className={`voice-btn speak-btn ${isSpeaking ? 'active' : ''}`}
          onClick={isSpeaking ? stopSpeaking : () => speak('Hello! I am your AI interviewer. Are you ready to begin?')}
          disabled={isProcessing}
        >
          <span className="voice-icon">
            {isSpeaking ? '⏹️' : '🔊'}
          </span>
          <span className="voice-label">
            {isSpeaking ? 'Stop Speaking' : 'Test Voice'}
          </span>
        </button>
      </div>

      <div className="transcript-display">
        <div className="transcript-label">Live Transcript:</div>
        <div className="transcript-content">
          {currentTranscript && (
            <div className="final-transcript">{currentTranscript}</div>
          )}
          {interimTranscript && (
            <div className="interim-transcript">{interimTranscript}</div>
          )}
          {!currentTranscript && !interimTranscript && (
            <div className="transcript-placeholder">Your speech will appear here...</div>
          )}
        </div>
      </div>

      <div className="voice-status">
        <div className={`status-indicator ${isProcessing ? 'listening' : ''}`}>
          <div className="pulse-dot"></div>
          <span>{isProcessing ? 'Listening...' : 'Ready'}</span>
        </div>
        <div className={`status-indicator ${isSpeaking ? 'speaking' : ''}`}>
          <div className="pulse-dot"></div>
          <span>{isSpeaking ? 'Speaking...' : 'Silent'}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
