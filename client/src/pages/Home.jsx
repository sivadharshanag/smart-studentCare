import React, { useState, useEffect } from "react";
import About from "../components/about";
import Program from "../components/program";
import Courses from "../components/courses";
import Reviews from "../components/reviews";
import "./styles/home.css";
import { useNavigate } from "react-router-dom";


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

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "program", "courses", "reviews"];
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

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
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
                { id: "reviews", label: "DSA ROADMAP" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
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
              <button className="sign-in-btn" onClick={() => navigate("/scan")}>
  SCAN NOTES
</button>

            </div>
          </div>
        </div>
      </header>

      {/* Sections */}
      <About />
      <Program />
      <Courses />
      <Reviews />
    </div>
  );
};

export default Home;
