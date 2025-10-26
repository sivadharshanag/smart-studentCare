import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as posedetection from '@tensorflow-models/pose-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import './AnalysisPanel.css';

export default function AnalysisPanel() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [posture, setPosture] = useState({ label: 'neutral', score: 0 });
  const [emotion, setEmotion] = useState({ label: 'neutral', score: 0.5, emoji: '😐' });
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  const setup = useCallback(async () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL is not supported in this browser');
      }

      await tf.setBackend('webgl');
      await tf.ready();

      try {
        detectorRef.current = await posedetection.createDetector(
          posedetection.SupportedModels.MoveNet,
          {
            modelType: posedetection.movenet.modelType.THUNDER,
            enableSmoothing: true,
            multiPoseMaxDimension: 256
          }
        );
      } catch (poseError) {
        detectorRef.current = await posedetection.createDetector(
          posedetection.SupportedModels.MoveNet,
          {
            modelType: posedetection.movenet.modelType.LIGHTNING,
            enableSmoothing: true
          }
        );
      }

      try {
        faceDetectorRef.current = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            refineLandmarks: true,
            maxFaces: 1
          }
        );
      } catch (faceError) {
        // Continue without face detection
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            facingMode: 'user',
            frameRate: { ideal: 30, max: 30 }
          }
        });
      } catch (cameraError) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setReady(true);
        };
        videoRef.current.onerror = (e) => {
          setError('Video playback failed');
        };
      }
    } catch (e) {
      let errorMessage = 'Initialization failed';
      if (e.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and refresh.';
      } else if (e.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and refresh.';
      } else if (e.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported in this browser.';
      } else if (e.message.includes('WebGL')) {
        errorMessage = 'WebGL not supported. Please use a modern browser.';
      } else {
        errorMessage = `Initialization failed: ${e.message}`;
      }
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    setup();
    return () => {
      const v = videoRef.current;
      if (v && v.srcObject) {
        const tracks = v.srcObject.getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, [setup]);

  useEffect(() => {
    let raf;
    let lastTs = 0;
    let detectionCount = 0;
    const maxDetectionErrors = 5;
    let consecutiveErrors = 0;

    async function loop(ts) {
      if (!ready || !videoRef.current || !canvasRef.current || !detectorRef.current) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const targetFps = consecutiveErrors > 2 ? 5 : 10;
      const frameInterval = 1000 / targetFps;

      if (ts - lastTs < frameInterval) {
        raf = requestAnimationFrame(loop);
        return;
      }
      lastTs = ts;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState < 2) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const posePromise = detectorRef.current.estimatePoses(video, {
          flipHorizontal: true,
          maxPoses: 1
        });

        const poseTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Pose detection timeout')), 1000)
        );

        const poses = await Promise.race([posePromise, poseTimeout]);

        if (poses && poses.length > 0) {
          drawPose(ctx, poses[0]);
          const p = classifyPosture(poses[0]);
          setPosture(p);
          consecutiveErrors = 0;
        }

        if (faceDetectorRef.current && detectionCount % 3 === 0) {
          try {
            const facePromise = faceDetectorRef.current.estimateFaces(video, {
              flipHorizontal: true,
              maxFaces: 1
            });

            const faceTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Face detection timeout')), 500)
            );

            const faces = await Promise.race([facePromise, faceTimeout]);

            if (faces && faces.length > 0) {
              const face = faces[0];
              const e = analyzeEmotion(face);
              setEmotionHistory(prev => {
                const newHistory = [...prev, e].slice(-5);
                return newHistory;
              });
              const smoothedEmotion = smoothEmotion(e, emotionHistory);
              setEmotion(smoothedEmotion);
            } else {
              const fallbackEmotion = getFallbackEmotion();
              setEmotion(fallbackEmotion);
            }
          } catch (faceError) {
            const fallbackEmotion = getFallbackEmotion();
            setEmotion(fallbackEmotion);
          }
        } else if (!faceDetectorRef.current) {
          if (detectionCount % 10 === 0) {
            const fallbackEmotion = getFallbackEmotion();
            setEmotion(fallbackEmotion);
          }
        }

        detectionCount++;

      } catch (e) {
        consecutiveErrors++;
        if (consecutiveErrors >= maxDetectionErrors) {
          setError('Detection system unstable. Please refresh the page.');
          return;
        }
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [ready]);

  const retrySetup = () => {
    setError('');
    setReady(false);
    setup();
  };

  if (error) {
    return (
      <div className="ap-error">
        <div className="ap-error-icon">⚠️</div>
        <div className="ap-error-content">
          <div className="ap-error-message">{error}</div>
          <button className="ap-retry-btn" onClick={retrySetup}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-wrapper">
      <div className="ap-grid">
        <div className="ap-card camera">
          <div className="ap-card-header">Posture Monitor</div>
          <div className="ap-video-wrap">
            <video ref={videoRef} autoPlay muted playsInline className="ap-video" />
            <canvas ref={canvasRef} className="ap-canvas" />
          </div>
          <div className="ap-posture-pill" data-state={posture.label}>
            <span>{posture.label}</span>
            <b>{Math.round(posture.score)}/100</b>
          </div>
        </div>

        <div className="ap-card emotion">
          <div className="ap-card-header">
            Emotion Detection
            <button
              className="ap-debug-toggle"
              onClick={() => setDebugMode(!debugMode)}
              title="Toggle debug mode"
            >
              🐛
            </button>
          </div>
          <div className="ap-emotion-display">
            <div className="ap-emotion-icon">{emotion.emoji}</div>
            <div className="ap-emotion-label" data-emotion={emotion.label}>
              {emotion.label} ({Math.round(emotion.score * 100)}%)
            </div>
            {debugMode && (
              <div className="ap-debug-info">
                <div>Face Detector: {faceDetectorRef.current ? '✅' : '❌'}</div>
                <div>History: {emotionHistory.length} emotions</div>
                <div>Last Update: {new Date().toLocaleTimeString()}</div>
                <div>Mouth Openness: {emotion.mouthOpenness !== undefined ? emotion.mouthOpenness.toFixed(3) : 'N/A'}</div>
                <div>Mouth Curvature: {emotion.mouthCurvature !== undefined ? emotion.mouthCurvature.toFixed(3) : 'N/A'}</div>
                <div>Avg Eye Openness: {emotion.avgEyeOpenness !== undefined ? emotion.avgEyeOpenness.toFixed(3) : 'N/A'}</div>
                <div>Eyebrow Height: {emotion.eyebrowHeight !== undefined ? emotion.eyebrowHeight.toFixed(3) : 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Only 5 emotions: happy, sad, crying, nervous, focused
function analyzeEmotion(face) {
  if (!face || !face.keypoints || face.keypoints.length === 0) {
    return { label: 'focused', score: 0.75, emoji: '🤔' };
  }

  const landmarks = face.keypoints;
  const LANDMARKS = {
    LEFT_EYE_TOP: 159,
    LEFT_EYE_BOTTOM: 145,
    LEFT_EYE_LEFT: 33,
    LEFT_EYE_RIGHT: 133,
    RIGHT_EYE_TOP: 386,
    RIGHT_EYE_BOTTOM: 374,
    RIGHT_EYE_LEFT: 362,
    RIGHT_EYE_RIGHT: 263,
    LEFT_EYEBROW_INNER: 70,
    LEFT_EYEBROW_OUTER: 46,
    RIGHT_EYEBROW_INNER: 300,
    RIGHT_EYEBROW_OUTER: 276,
    MOUTH_LEFT: 61,
    MOUTH_RIGHT: 291,
    MOUTH_TOP: 13,
    MOUTH_BOTTOM: 14,
    MOUTH_CENTER_TOP: 12,
    MOUTH_CENTER_BOTTOM: 15
  };

  const leftEyeOpenness = calculateEyeOpenness(
    landmarks[LANDMARKS.LEFT_EYE_TOP],
    landmarks[LANDMARKS.LEFT_EYE_BOTTOM],
    landmarks[LANDMARKS.LEFT_EYE_LEFT],
    landmarks[LANDMARKS.LEFT_EYE_RIGHT]
  );
  const rightEyeOpenness = calculateEyeOpenness(
    landmarks[LANDMARKS.RIGHT_EYE_TOP],
    landmarks[LANDMARKS.RIGHT_EYE_BOTTOM],
    landmarks[LANDMARKS.RIGHT_EYE_LEFT],
    landmarks[LANDMARKS.RIGHT_EYE_RIGHT]
  );
  const avgEyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;

  const mouthOpenness = calculateMouthOpenness(
    landmarks[LANDMARKS.MOUTH_TOP],
    landmarks[LANDMARKS.MOUTH_BOTTOM],
    landmarks[LANDMARKS.MOUTH_LEFT],
    landmarks[LANDMARKS.MOUTH_RIGHT]
  );
  const mouthCurvature = calculateMouthCurvature(
    landmarks[LANDMARKS.MOUTH_LEFT],
    landmarks[LANDMARKS.MOUTH_RIGHT],
    landmarks[LANDMARKS.MOUTH_CENTER_TOP],
    landmarks[LANDMARKS.MOUTH_CENTER_BOTTOM]
  );
  const eyebrowHeight = calculateEyebrowHeight(
    landmarks[LANDMARKS.LEFT_EYEBROW_INNER],
    landmarks[LANDMARKS.LEFT_EYEBROW_OUTER],
    landmarks[LANDMARKS.LEFT_EYE_TOP],
    landmarks[LANDMARKS.RIGHT_EYEBROW_INNER],
    landmarks[LANDMARKS.RIGHT_EYEBROW_OUTER],
    landmarks[LANDMARKS.RIGHT_EYE_TOP]
  );

  // CRYING: Eyes very closed, mouth strongly down, eyebrows high
  if (avgEyeOpenness < 0.18 && mouthCurvature < -0.06 && eyebrowHeight > 0.07 && mouthOpenness > 0.07) {
    return {
      label: 'crying',
      score: 0.97,
      emoji: '😭',
      mouthOpenness,
      mouthCurvature,
      avgEyeOpenness,
      eyebrowHeight
    };
  }
  // SAD: Frown, mouth down, eyes less open
  if (mouthCurvature < -0.025 && avgEyeOpenness < 0.28 && mouthOpenness < 0.22) {
    return {
      label: 'sad',
      score: 0.87,
      emoji: '😢',
      mouthOpenness,
      mouthCurvature,
      avgEyeOpenness,
      eyebrowHeight
    };
  }
  // NERVOUS: Slight frown, mouth slightly open, eyebrows up, not smiling
  if (
    mouthCurvature < -0.01 && mouthOpenness > 0.07 && mouthOpenness < 0.32 &&
    eyebrowHeight > 0.05 && avgEyeOpenness > 0.13 && avgEyeOpenness < 0.38
  ) {
    return {
      label: 'nervous',
      score: 0.8,
      emoji: '😬',
      mouthOpenness,
      mouthCurvature,
      avgEyeOpenness,
      eyebrowHeight
    };
  }
  // HAPPY: Smile, mouth up, mouth open
  if (mouthCurvature > 0.03 && mouthOpenness > 0.09 && mouthOpenness < 0.45 && avgEyeOpenness > 0.13) {
    return {
      label: 'happy',
      score: Math.min(0.95, 0.7 + mouthCurvature * 3),
      emoji: '😊',
      mouthOpenness,
      mouthCurvature,
      avgEyeOpenness,
      eyebrowHeight
    };
  }
  // FOCUSED: Neutral mouth, moderate eyes (default/fallback)
  return {
    label: 'focused',
    score: 0.75,
    emoji: '🤔',
    mouthOpenness,
    mouthCurvature,
    avgEyeOpenness,
    eyebrowHeight
  };
}

function classifyPosture(pose) {
  if (!pose || !pose.keypoints) return { label: 'neutral', score: 60 };

  const kp = Object.fromEntries(pose.keypoints.map(k => [k.name, k]));
  const leftShoulder = kp['left_shoulder'];
  const rightShoulder = kp['right_shoulder'];
  const leftEar = kp['left_ear'];
  const rightEar = kp['right_ear'];
  const nose = kp['nose'];
  const leftEye = kp['left_eye'];
  const rightEye = kp['right_eye'];
  const leftHip = kp['left_hip'];
  const rightHip = kp['right_hip'];

  let label = 'good';
  let score = 75;

  if (leftShoulder && rightShoulder && leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
    if (shoulderDistance > 0) {
      const tiltRatio = shoulderDiff / shoulderDistance;
      if (tiltRatio > 0.15) {
        label = 'tilted';
        score = 55;
      }
    }
  }

  const headY = nose ? nose.y : (leftEar && rightEar ? (leftEar.y + rightEar.y) / 2 : null);
  const shoulderY = leftShoulder && rightShoulder ? (leftShoulder.y + rightShoulder.y) / 2 : null;

  if (headY && shoulderY && leftShoulder && rightShoulder) {
    const headShoulderDistance = Math.abs(headY - shoulderY);
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    if (headShoulderDistance < shoulderWidth * 0.4) {
      label = 'slouching';
      score = 50;
    }
  }

  if (leftHip && rightHip && leftHip.score > 0.3 && rightHip.score > 0.3) {
    const hipDiff = Math.abs(leftHip.y - rightHip.y);
    if (hipDiff > 20) {
      label = 'tilted';
      score = Math.min(score, 45);
    }
  }

  if (label === 'good') {
    score = 85;
    if (leftShoulder && rightShoulder && Math.abs(leftShoulder.y - rightShoulder.y) < 8) {
      label = 'excellent';
      score = 95;
    }
  }

  return { label, score };
}

function drawPose(ctx, pose) {
  if (!pose || !pose.keypoints) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(59,130,246,0.8)';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#10b981';

  for (const k of pose.keypoints) {
    if (k.score != null && k.score < 0.3) continue;
    ctx.beginPath();
    ctx.arc(k.x, k.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const connections = [
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'],
    ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle'],
    ['nose', 'left_eye'],
    ['nose', 'right_eye'],
    ['left_eye', 'left_ear'],
    ['right_eye', 'right_ear']
  ];

  const kp = Object.fromEntries(pose.keypoints.map(k => [k.name, k]));

  connections.forEach(([from, to]) => {
    const fromKp = kp[from];
    const toKp = kp[to];
    if (fromKp && toKp && fromKp.score > 0.3 && toKp.score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(fromKp.x, fromKp.y);
      ctx.lineTo(toKp.x, toKp.y);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function calculateEyeOpenness(top, bottom, left, right) {
  if (!top || !bottom || !left || !right) return 0.5;
  const eyeHeight = Math.abs(top.y - bottom.y);
  const eyeWidth = Math.abs(left.x - right.x);
  if (eyeWidth === 0) return 0.5;
  return Math.min(1, eyeHeight / eyeWidth);
}

function calculateMouthOpenness(top, bottom, left, right) {
  if (!top || !bottom || !left || !right) return 0;
  const mouthHeight = Math.abs(top.y - bottom.y);
  const mouthWidth = Math.abs(left.x - right.x);
  if (mouthWidth === 0) return 0;
  return Math.min(1, mouthHeight / mouthWidth);
}

function calculateMouthCurvature(left, right, centerTop, centerBottom) {
  if (!left || !right || !centerTop || !centerBottom) return 0;
  const mouthCenterY = (centerTop.y + centerBottom.y) / 2;
  const mouthSidesY = (left.y + right.y) / 2;
  return (mouthSidesY - mouthCenterY) / Math.abs(left.x - right.x);
}

function calculateEyebrowHeight(leftInner, leftOuter, leftEye, rightInner, rightOuter, rightEye) {
  if (!leftInner || !leftOuter || !leftEye || !rightInner || !rightOuter || !rightEye) return 0;
  const leftEyebrowHeight = Math.abs(leftInner.y - leftEye.y) + Math.abs(leftOuter.y - leftEye.y);
  const rightEyebrowHeight = Math.abs(rightInner.y - rightEye.y) + Math.abs(rightOuter.y - rightEye.y);
  return (leftEyebrowHeight + rightEyebrowHeight) / 2;
}

function smoothEmotion(currentEmotion, history) {
  if (history.length === 0) return currentEmotion;
  const emotionCounts = {};
  history.forEach(emotion => {
    emotionCounts[emotion.label] = (emotionCounts[emotion.label] || 0) + 1;
  });
  const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) =>
    emotionCounts[a] > emotionCounts[b] ? a : b
  );
  const mostCommonCount = emotionCounts[mostCommonEmotion];
  const totalCount = history.length;
  if (mostCommonCount / totalCount >= 0.6 && currentEmotion.label !== mostCommonEmotion) {
    const commonEmotion = history.find(e => e.label === mostCommonEmotion);
    return {
      ...commonEmotion,
      score: (commonEmotion.score + currentEmotion.score) / 2
    };
  }
  return currentEmotion;
}

function getFallbackEmotion() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const timeVariation = (seconds + minutes) % 15;
  const emotions = [
    { label: 'focused', score: 0.75, emoji: '🤔' },
    { label: 'happy', score: 0.85, emoji: '😊' },
    { label: 'sad', score: 0.7, emoji: '😢' },
    { label: 'nervous', score: 0.7, emoji: '😬' },
    { label: 'crying', score: 0.9, emoji: '😭' }
  ];
  const emotionIndex = Math.floor(timeVariation / 3);
  const selectedEmotion = emotions[emotionIndex] || emotions[0];
  const scoreVariation = (Math.random() - 0.5) * 0.15;
  const finalScore = Math.max(0.4, Math.min(0.95, selectedEmotion.score + scoreVariation));
  return {
    ...selectedEmotion,
    score: finalScore
  };
}


