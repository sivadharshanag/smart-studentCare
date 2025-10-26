import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import About from "../components/about";
import Program from "../components/program";
import Courses from "../components/courses";

import "./styles/home.css";

const Home = () => {
  const [activeSection, setActiveSection] = useState("about");
  const navigate = useNavigate();

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Track active section on scroll
      const sections = ["about", "program", "courses"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header
        className="header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderRadius: 0,
          width: '100vw',
          maxWidth: '100vw',
          margin: 0,
          transition: 'none',
        }}
      >
        <div className="header-content">
          <div className="header-inner">
            {/* Logo */}
            <div className="logo">
              <div className="logo-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <span className="logo-text">StudCare</span>
            </div>

            {/* Navigation */}
            <nav className="nav">
              {[
                { id: "about", label: "ABOUT" },
                { id: "program", label: "UPLOAD" },
                { id: "courses", label: "RETRIEVE" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
              {/* Logout Button */}
              <button 
                className="nav-item logout-btn"
                onClick={handleLogout}
                style={{
                  marginLeft: 24,
                  background: 'linear-gradient(90deg,rgb(208, 88, 255) 0%,rgb(226, 25, 240) 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '22px',
                  padding: '8px 26px',
                  fontWeight: 800,
                  fontSize: '1.08em',
                  boxShadow: '0 2px 16px rgba(255,88,88,0.13)',
                  letterSpacing: '1.2px',
                  transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s, color 0.2s',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textTransform: 'uppercase',
                  WebkitTextFillColor: '#fff',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'linear-gradient(90deg,rgb(240, 25, 236) 0%,rgb(255, 88, 222) 100%)';
                  e.currentTarget.style.transform = 'scale(1.06)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,88,88,0.18)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.WebkitTextFillColor = '#fff';
                  Array.from(e.currentTarget.children).forEach(child => {
                    if (child.tagName === 'svg') {
                      child.setAttribute('stroke', '#fff');
                    }
                  });
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'linear-gradient(90deg,rgb(236, 88, 255) 0%,rgb(29, 25, 240) 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(255,88,88,0.13)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.WebkitTextFillColor = '#fff';
                  Array.from(e.currentTarget.children).forEach(child => {
                    if (child.tagName === 'svg') {
                      child.setAttribute('stroke', '#fff');
                    }
                  });
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                LOGOUT
              </button>
            </nav>

            {/* Right side */}
            <div className="header-right">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              {/* Removed SCAN NOTES button */}
            </div>
          </div>
        </div>
      </header>

      {/* About Section with Video Background */}
      <section id="about" className="about-section-with-video">
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/study.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <About />
      </section>

      {/* Other Sections */}
      <Program />
      <Courses />
    </div>
  );
};

export default Home;
