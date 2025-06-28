import React, { useEffect, useState } from "react";
import "./about.css";

const About = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <section id="about" className="hero-section">
      <div className="hero-content">
        <div className="hero-grid">
          {/* Left side: Welcome Message */}
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome, {name || "Guest"}!
              <br />
              You are logged in as:{" "}
              <span style={{ color: "#ffebcd", fontWeight: "bold" }}>
                {role || "N/A"}
              </span>
            </h1><br/>
            <p className="hero-description">
              Explore our intelligent student assistant to upload and retrieve notes
              semester-wise, subject-wise, and category-wise.
            </p>
            <button className="cta-button">GEN AI CHATBOT</button>
          </div>

          {/* Right side: Illustration */}
          <div className="hero-illustration">
            <div className="illustration-container">
              <div className="person-illustration">
                <div className="person-avatar">
                  <div className="avatar-inner"></div>
                </div>
                <div className="laptop"></div>
                <div className="chair">
                  <div className="chair-leg"></div>
                  <div className="chair-leg"></div>
                </div>
              </div>
              <div className="floating-element element-1"></div>
              <div className="floating-element element-2"></div>
              <div className="floating-element element-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
