# 🤖 AI-Powered HR Interview Bot

## Overview
A comprehensive HR interview simulation system that acts like a real HR professional with advanced AI capabilities including:

- **Resume Analysis**: AI-powered parsing of PDF/DOCX resumes to extract skills, experience, and projects
- **Voice Assistant**: Natural conversation with speech-to-text and text-to-speech
- **Camera Integration**: Real-time video analysis during interviews
- **Emotion Detection**: Facial emotion analysis using TensorFlow.js
- **Posture Correction**: Live posture monitoring and feedback
- **Grammar Correction**: AI-powered English grammar suggestions
- **Comprehensive Dashboard**: Detailed performance analytics and reports

## 🚀 Features

### 1. Resume Upload & AI Analysis
- Upload PDF, DOCX, or TXT resume files via dedicated upload page (`/uploadresume`)
- Real-time file parsing with progress indicators
- Advanced resume text extraction using PDF.js and Mammoth.js
- Intelligent section detection (Education, Experience, Skills, Projects)
- Automatic extraction of contact information, social links, and professional details
- Seamless navigation to resume display page with parsed content

### 2. Resume Display & Analysis
- Dedicated resume display page (`/resume-display`) showing parsed content
- Structured display of extracted information:
  - Professional summary/profile
  - Education details with CGPA/GPA extraction
  - Work experience and internships
  - Technical skills and competencies
  - Projects and achievements
  - Contact information and social links
- Interactive UI with smooth animations using Framer Motion
- Ready integration point for interview question generation

### 3. Voice Assistant
- Natural speech-to-text conversion using Web Speech API
- Text-to-speech for AI interviewer questions
- Support for voice or text responses
- Interruption handling and conversation flow

### 4. Camera & Video Analysis
- Real-time camera access with proper permissions
- Live video feed with mirror effect
- Privacy indicators and controls
- High-quality video stream for analysis

### 5. Emotion Detection
- Real-time facial emotion analysis using TensorFlow.js
- Detects: Happy, Sad, Angry, Surprised, Confused, Neutral
- Live emotion indicators during interview
- Emotion timeline tracking throughout session

### 6. Posture Detection & Correction
- Real-time posture analysis using PoseNet/BlazePose
- Detects: Excellent, Good, Slouching, Tilted posture
- Live feedback for posture improvement
- Posture timeline tracking

### 7. Grammar Correction
- AI-powered grammar analysis of spoken/typed responses
- Real-time suggestions for improvement
- Common grammar issue detection
- Professional language recommendations

### 8. Real-time Feedback System
- Live coaching during interview
- Posture alerts and corrections
- Emotion guidance and tips
- Speaking pace recommendations

### 9. Comprehensive Dashboard
- Overall interview score calculation
- Detailed performance breakdown
- Emotion analysis charts
- Posture feedback summary
- Grammar improvement suggestions
- Downloadable performance reports

## 🛠️ Technical Implementation

### Frontend Technologies
- **React 19.1.0**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing for seamless navigation
- **TensorFlow.js**: Machine learning for emotion and posture detection
- **Web Speech API**: Browser-native speech recognition and synthesis
- **PDF.js**: PDF text extraction and parsing
- **Mammoth.js**: DOCX document parsing
- **Framer Motion**: Smooth animations and transitions

### AI Models Used
- **Face Landmarks Detection**: MediaPipe FaceMesh for emotion analysis
- **Pose Detection**: MoveNet for posture analysis
- **Grammar Analysis**: Custom rule-based grammar checking

### High-Accuracy AI Components (Server-Assisted)
- **AI Question Generation (Resume-aware)**: `google/flan-t5-large` (or `flan-ul2` if you have GPU VRAM)
- **Sentiment Analysis (Answers)**: `cardiffnlp/twitter-roberta-base-sentiment-latest` (robust polarity)
- **Toxicity/Emotion (Optional)**: `j-hartmann/emotion-english-distilroberta-base`
- These models run in a Python virtual environment for reproducibility and isolation.

### Key Components

#### 1. UploadResume.jsx (Resume Upload Component)
```javascript
// Resume upload and parsing functionality
- File upload with drag-and-drop support
- Multi-format support (PDF, DOCX, TXT)
- Real-time file parsing using PDF.js and Mammoth.js
- Automatic navigation to resume display page
- Error handling for unsupported file types
```

#### 2. ResumeDisplay.jsx (Resume Analysis Component)
```javascript
// Resume content display and analysis
- Advanced resume text parsing with section detection
- Structured display of extracted information
- Contact information and social links extraction
- Education, experience, and skills categorization
- Interactive UI with smooth animations
```

#### 3. resumeParser.js (Utility)
```javascript
// Resume parsing utilities
- Text extraction and section identification
- Contact information parsing (email, phone)
- Skills, education, and experience extraction
- Summary generation from resume content
```

#### 4. Interview.jsx (Main Component - Planned)
```javascript
// Main interview orchestrator (to be implemented)
- Manages interview stages (upload → setup → interview → completion)
- Handles voice recognition and text-to-speech
- Coordinates all analysis components
- Generates comprehensive scoring
```

#### 5. CameraAnalysis.jsx (Planned)
```javascript
// Real-time video analysis (to be implemented)
- Camera access and permissions
- TensorFlow.js model loading
- Emotion detection from facial landmarks
- Posture analysis from body keypoints
```

## 📋 Usage Instructions

### Step 1: Resume Upload
1. Navigate to `/uploadresume` route
2. Upload your resume (PDF, DOCX, or TXT)
3. Wait for AI analysis to complete
4. Review extracted information on resume display page

### Step 2: Resume Review
1. Review parsed resume content on `/resume-display` page
2. Verify extracted information accuracy
3. Check contact details, education, experience, and skills
4. Proceed to interview setup when ready

### Step 3: Camera Setup (Planned)
1. Grant camera permissions when prompted
2. Position yourself in front of camera
3. Ensure good lighting and clear view
4. Test camera and AI analysis

### Step 4: Interview Session (Planned)
1. Click "Start Personalized Interview"
2. Listen to AI-generated questions based on your resume
3. Respond via voice or text input
4. Receive real-time feedback on posture and emotions
5. Navigate between questions as needed

### Step 5: Performance Review (Planned)
1. Complete all interview questions
2. Review comprehensive performance dashboard
3. Analyze emotion and posture timelines
4. Review grammar suggestions
5. Download detailed report

## 🎯 Scoring System (Planned)

### Overall Score Calculation (100%)
- **Response Quality (40%)**: Completeness and depth of answers
- **Emotional Analysis (30%)**: Positive emotion maintenance
- **Posture Analysis (20%)**: Professional posture maintenance
- **Grammar Score (10%)**: Language accuracy and professionalism

### Performance Levels
- **85-100%**: Excellent - Ready for real interviews
- **70-84%**: Good - Minor improvements needed
- **55-69%**: Fair - Practice recommended
- **Below 55%**: Needs significant improvement

## 🔧 Installation & Setup

### Prerequisites
```bash
Node.js 16+ 
npm or yarn
Modern browser with camera/microphone access
```

### Installation
```bash
# Install dependencies
cd client
npm install @tensorflow/tfjs @tensorflow-models/face-landmarks-detection @tensorflow-models/pose-detection pdf-parse mammoth pdfjs-dist framer-motion

# Start development server
npm start
```

### Backend AI Environment (Python, High Accuracy)
```bash
# From repository root
cd server

# Create and activate a virtual environment (Windows PowerShell)
python -m venv .venv
. .venv/Scripts/Activate.ps1

# Upgrade pip and install core dependencies
python -m pip install --upgrade pip wheel

# Transformers + tokenizers + sentencepiece
pip install transformers==4.44.2 accelerate==0.34.2 sentencepiece==0.2.0

# PyTorch CPU build (Windows). For CUDA, see pytorch.org for the right index URL
pip install torch==2.4.1 torchvision==0.19.1 torchaudio==2.4.1 --index-url https://download.pytorch.org/whl/cpu

# NLP utilities
pip install pandas==2.2.2 numpy==2.0.2

# Optional (if you want Python-side posture/vision processing)
pip install opencv-python==4.10.0.84 mediapipe==0.10.14
```

### Model Notes
- Prefer `flan-t5-large` for question generation on CPU. Use `flan-ul2` only if you have a strong GPU.
- Sentiment uses a RoBERTa model fine-tuned for general text; fast and accurate.
- Posture runs on the client with TFJS MoveNet/BlazePose; Python `mediapipe` is optional for offline batch analysis.

### Browser Requirements
- Chrome 60+ (recommended)
- Firefox 55+
- Safari 11+
- Edge 79+

### Permissions Required
- Camera access for video analysis (planned)
- Microphone access for voice recognition (planned)
- File system access for resume upload

## 🎨 UI/UX Features

### Modern Design
- Gradient backgrounds and smooth animations
- Responsive design for all screen sizes
- Accessibility-compliant interface
- Dark mode support

### Resume Upload Interface
- Clean, intuitive upload form
- Drag-and-drop file support
- Real-time file validation
- Progress indicators for file processing
- Error handling for unsupported formats

### Resume Display Interface
- Structured layout for parsed content
- Smooth animations using Framer Motion
- Interactive elements for better UX
- Professional styling with modern design

### Real-time Indicators (Planned)
- Live emotion display with emojis
- Posture status with color coding
- Voice recording indicators
- Progress tracking throughout interview

### Interactive Elements
- Drag-and-drop file upload
- Voice control buttons (planned)
- Real-time feedback notifications (planned)
- Smooth transitions between stages

## 📊 Analytics & Reporting (Planned)

### Real-time Metrics
- Current emotion state
- Live posture status
- Grammar suggestions count
- Response completion rate

### Detailed Reports
- Interview session summary
- Emotion timeline graph
- Posture analysis breakdown
- Grammar improvement areas
- Downloadable JSON reports

## 🔒 Privacy & Security

### Data Handling
- All processing done locally in browser
- No data sent to external servers
- Camera/audio streams not recorded (planned)
- Resume content processed client-side only

### Privacy Features
- Clear privacy indicators
- Easy permission management
- Data deletion after session
- No persistent storage of sensitive data

## 🚀 Current Implementation Status

### ✅ Completed Features
- **Resume Upload System**: Fully functional with PDF, DOCX, TXT support
- **Resume Parsing**: Advanced text extraction and section detection
- **Resume Display**: Structured content display with modern UI
- **File Processing**: PDF.js and Mammoth.js integration
- **Navigation**: Seamless routing between upload and display pages

### 🔄 In Progress
- **Interview Bot Integration**: Connecting resume analysis to interview questions
- **AI Question Generation**: Based on parsed resume content

### 📋 Planned Features
- **Voice Assistant**: Speech recognition and synthesis
- **Camera Integration**: Real-time video analysis
- **Emotion Detection**: Facial emotion analysis
- **Posture Correction**: Live posture monitoring
- **Grammar Correction**: AI-powered language analysis
- **Performance Dashboard**: Comprehensive scoring and analytics

## 🧠 AI Question Generation, Sentiment, and Posture Analysis

### 1) Resume-Aware Question Generation (Python, Offline)
Use a question-generation prompt over extracted resume text. Example script:
```python
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# High-accuracy but CPU-friendly
MODEL_NAME = "google/flan-t5-large"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

def generate_questions(resume_text: str, num_questions: int = 8) -> list[str]:
    prompt = (
        "You are an expert HR interviewer. Read the candidate's resume text and "
        "generate concise, technical and behavioral interview questions that are directly "
        "grounded in the resume. Cover projects, skills, internships, impact, and edge cases.\n\n"
        f"Resume:\n{resume_text}\n\n"
        f"Return {num_questions} numbered questions only."
    )
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
    outputs = model.generate(
        **inputs,
        max_new_tokens=256,
        num_beams=5,
        temperature=0.7,
        top_p=0.9,
        do_sample=False,
    )
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    lines = [q.strip("- ") for q in text.splitlines() if q.strip()]
    return lines

if __name__ == "__main__":
    sample_resume = """
    Final-year B.Tech CSE student. Projects: Smart Notes App (React, Node.js),
    Resume parser (PDF.js, Mammoth), Interview bot, Camera-based posture analysis (TFJS MoveNet).
    Skills: React, Node.js, Express, MongoDB, Python, TensorFlow.js, Docker.
    Intern: Frontend at ABC, built dashboards and charts.
    """
    qs = generate_questions(sample_resume, num_questions=8)
    for q in qs:
        print(q)
```

Integrate by sending parsed resume text from `client` to a small Python endpoint (e.g., `POST /ai/questions`) that calls `generate_questions` and returns the list.

### 2) Sentiment Analysis of Answers (Python)
Run a high-quality sentiment classifier on candidate responses to gauge positivity/negativity:
```python
from transformers import pipeline

sentiment = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)

def analyze_sentiment(answer_text: str) -> dict:
    result = sentiment(answer_text)[0]
    # Example: { 'label': 'positive', 'score': 0.987 }
    return {"label": result["label"], "score": float(result["score"])}

if __name__ == "__main__":
    print(analyze_sentiment("I successfully delivered the project ahead of schedule."))
```

Expose via `POST /ai/sentiment` and call from the client after each answer.

### 3) Posture Analysis (Client, TFJS) — High Accuracy
Use `@tensorflow-models/pose-detection` with the BlazePose or MoveNet Thunder model for robust posture estimation:
```javascript
import * as posedetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

export async function createPoseDetector() {
  // BlazePose GHUM is accurate; MoveNet Thunder is also strong. Choose one.
  return posedetection.createDetector(posedetection.SupportedModels.BlazePose, {
    runtime: 'tfjs',
    modelType: 'full', // or 'heavy' when available for higher accuracy
    enableSmoothing: true,
  })
}

export async function analyzePosture(videoEl) {
  const detector = await createPoseDetector()
  const poses = await detector.estimatePoses(videoEl, { flipHorizontal: true })
  // Compute angles / classify posture here (excellent/good/slouching)
  return poses
}
```

Optional Python batch processing (offline videos) via MediaPipe:
```python
import cv2, mediapipe as mp

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(model_complexity=2, enable_segmentation=False)

cap = cv2.VideoCapture("input.mp4")
while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        break
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res = pose.process(rgb)
    # Inspect res.pose_landmarks for posture metrics
```

### Lightweight REST API (Optional)
Add endpoints in `server` to serve AI:
- `POST /ai/questions` → body: `{ resumeText: string, count?: number }` → returns: `{ questions: string[] }`
- `POST /ai/sentiment` → body: `{ answer: string }` → returns: `{ label: string, score: number }`

Run the Python environment before starting the server to ensure models are available.

## 🤝 Contributing

This HR Interview Bot represents a comprehensive solution for interview preparation with cutting-edge AI technology. The system provides valuable feedback to help candidates improve their interview performance through objective analysis of multiple factors.

## 📞 Support

For technical issues or feature requests, please refer to the component documentation and ensure all dependencies are properly installed.
