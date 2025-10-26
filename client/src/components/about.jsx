import { useEffect, useState } from "react"; 
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
    <>
      <video
        className="background-video global-bg-video"
        autoPlay
        loop
        muted
        playsInline
      > 
        <source src="/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <section id="about" className="about-section-with-video">
        <div className="hero-content">
          <div className="hero-grid">
            {/* Left side: Welcome Message */}
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome, {name || "Guest"}!
                <br />
                You are logged in as:{" "}
                <span style={{ color: "#4b2e05", fontWeight: "bold", fontSize: "1.25em" }}>
                  {role || "N/A"}
                </span>
              </h1><br/>
              <p className="hero-description">
                Explore our intelligent student assistant to upload and retrieve notes
                semester-wise, subject-wise, and category-wise.
              </p>
              <button
                className="cta-button"
                style={{
                  background: '#000 !important',
                  color: '#000',
                  fontWeight: 900,
                  border: 'none',
                  borderRadius: '22px',
                  padding: '12px 28px',
                  fontSize: '1.08em',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                  letterSpacing: '1.2px',
                  marginTop: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s, color 0.2s',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  WebkitTextFillColor: '#000',
                }}
                onClick={() => window.location.href = '/start'}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#222 !important';
                  e.currentTarget.style.transform = 'scale(1.06)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.WebkitTextFillColor = '#000';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000 !important';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.13)';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.WebkitTextFillColor = '#000';
                }}
              >
                Take Live Interview test
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
