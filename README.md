# 📚 Smart StudentCare Assistant

> ✨ An intelligent full-stack MERN + ML/DL application for uploading, retrieving, and recommending categorized academic notes. Includes GenAI chatbot and resume-based smart suggestions.

---

## 📌 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🚀 Features](#-features)
- [🗂 Folder Structure](#-folder-structure)
- [⚙️ Installation & Setup Guide](#-installation--setup-guide)
  - [📁 1. Clone the Repository](#1-clone-the-repository)
  - [🔧 2. Backend Setup (Node.js + MongoDB)](#2-backend-setup-nodejs--mongodb)
  - [💻 3. Frontend Setup (React.js)](#3-frontend-setup-reactjs)
  - [🤖 4. ML/DL Model Server Setup (Python)](#4-mldl-model-server-setup-python)
- [🔄 Application Flow](#-application-flow)
- [🖼️ Screenshots](#-screenshots)
- [🧰 Tech Stack](#-tech-stack)
- [👤 Author](#-author)
- [📝 License](#-license)
- [💡 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)

---

## 🎯 Project Overview

**Smart StudentCare Assistant** is a GenAI-powered platform where:

- ✍️ **Uploaders** can upload categorized academic content  
- 🔎 **Retrievers** can access notes structured by semester and subject  
- 🧠 **ML/DL models** provide:
  - Auto-summarization
  - Resume-based recommendations
- 🤖 **Chatbot** suggests study materials based on questions

---

## 🚀 Features

- 🔐 Auth system for Uploaders & Retrievers
- 📁 Semester → Subject → Category (Syllabus, CAT, QP, Notes)
- 💬 GenAI chatbot with note linking
- 🧾 Resume analysis for personalized learning path
- 📄 MongoDB GridFS file storage
- 📱 Responsive and modern UI with TailwindCSS

---

## 🗂 Folder Structure
smart-studentCare/
├── client/ # React Frontend
│ ├── src/pages/ # Upload, Retrieve, Resume
│ ├── src/components/
│ ├── App.jsx
│ └── ...
│
├── server/ # Node.js Backend
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ └── .env
│
├── ml-models/ # Python ML Microservices
│ ├── summarizer.py
│ ├── resume_analysis.py
│ ├── requirements.txt
│ └── ...
│
├── .gitignore
└── README.md

yaml
Copy
Edit


---

## ⚙️ Installation & Setup Guide

### 📁 1. Clone the Repository

```bash
git clone https://github.com/sivadharshana/smart-studentCare.git
cd smart-studentCare

Create a .env file in the server/ directory:

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/studentCare
Then run:

bash
Copy
Edit
npm start
💻 3. Frontend Setup (React.js)
bash
Copy
Edit
cd ../client
npm install
npm start
Frontend will run at: http://localhost:3000

🤖 4. ML/DL Model Server Setup (Python)
bash
Copy
Edit
cd ../ml-models
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
