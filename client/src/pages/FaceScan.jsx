// FaceScan.jsx
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles/FaceScan.css";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

export default function FaceScan() {
  const webcamRef = useRef(null);
  const dashboardRef = useRef(null);
  const [studentId, setStudentId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [result, setResult] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const enteredId = prompt("Enter your student ID or roll number");

    if (!enteredId || !imageSrc) {
      alert("Student ID and image are required.");
      return;
    }
    setStudentId(enteredId);

    try {
      const response = await axios.post("http://127.0.0.1:5001/analyze", {
        image: imageSrc,
        student_id: enteredId,
        user_name: localStorage.getItem("name"),
      });

      if (!response.data.verified) {
        alert("Face verification failed.");
        return;
      }

      setResult(response.data);
      setEmotion(response.data.emotion);
      setTimestamp(response.data.time);

      const userName = localStorage.getItem("name");
      const res = await axios.get(`http://127.0.0.1:5001/attendance/${userName}`);
      setAttendance(res.data);

      dashboardRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error during face scan:", error);
      alert("Error during face scan.");
    }
  };

  const groupedByDate = attendance.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    acc[date] = true;
    return acc;
  }, {});

  const handleDateClick = (value) => {
    const clicked = new Date(value).toLocaleDateString();
    const logs = attendance.filter(
      (a) => new Date(a.timestamp).toLocaleDateString() === clicked
    );
    const emotes = logs.map((e) => e.emotion).join(", ");
    alert(`Attendance: ${logs.length} record(s)\nEmotions: ${emotes}`);
  };

  return (
    <div className="facescan-page">
      <section className="hero">
        <div className="text-content">
          <h1 className="headline">AI Face Attendance</h1>
          <p className="subline">Secure & Smart Logging with Emotions 📸</p>
          <button onClick={capture} className="start-button">Start Scan</button>
        </div>
        <div className="hero-gif">
          <img src="/gif2.gif" alt="Working Woman" />
        </div>
      </section>

      <section className="scanner-box">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <img src="/gif3.gif" alt="Scan Animation" className="scanner-gif" />
      </section>

      {result && (
        <div ref={dashboardRef} className="result-card">
          <h2>Scan Result</h2>
          <p><strong>ID:</strong> {studentId}</p>
          <p><strong>Emotion:</strong> {emotion}</p>
          <p><strong>Timestamp:</strong> {timestamp}</p>
          <img src="/gif1.gif" alt="Result Animation" className="result-gif" />
        </div>
      )}

      <section className="calendar-box">
        <h3>📅 Attendance Calendar</h3>
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const formatted = date.toLocaleDateString();
            return groupedByDate[formatted] ? "highlight" : null;
          }}
        />
      </section>
    </div>
  );
}