import React, { useEffect, useState } from "react";
import "./Start.css";
import { FaLaptopCode, FaUserTie, FaComments, FaBook, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const quotes = [
  "Believe in yourself, and all that you are.",
  "Success is the sum of small efforts repeated daily.",
  "Your only limit is your mind.",
  "Push yourself, because no one else will do it for you.",
  "Dream it. Wish it. Do it."
];

export default function Start() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const gridData = [
    { img: "inter1.webp", icon: <FaLaptopCode />, text: "Coding Practice" },
    { img: "inter2.webp", icon: <FaUserTie />, text: "HR Interview Prep" },
    { img: "inter3.webp", icon: <FaComments />, text: "Group Discussion" },
    { img: "inter4.png", icon: <FaBook />, text: "Aptitude & Reasoning" },
    { img: "inter5.jpg", icon: <FaCheckCircle />, text: "Mock Tests" }
  ];

  return (
    <div className="start-container">
      {/* Background splashes */}
      <div className="bg-splash"></div>
      <div className="bg-splash delay"></div>

      {/* Hero Section */}
      <header className="hero">
        <h1>
          Interview <span>Preparation</span> Hub
        </h1>
        <p className="subtitle">
          Boost your confidence with practice, mock sessions, and expert guidance.
        </p>
        <div className="quote">{quotes[currentQuote]}</div>
      </header>

      {/* Grid Section */}
      <div className="grid-container">
        {gridData.map((item, idx) => (
          <div key={idx} className="grid-item">
            <img src={item.img} alt="interview" className="grid-img" />
            <div className="overlay">
              <div className="icon">{item.icon}</div>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <button className="start-btn" onClick={() => navigate("/uploadresume")}>
        🚀 Start Test
      </button>
    </div>
  );
}