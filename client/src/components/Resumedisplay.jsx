import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// removed unused parseResumeText import
import "./Resumedisplay.css";

const animationVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

// Improved offline parser for resume fields with robust section splitting
function advancedResumeParser(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const data = {
    profile: "",
    linkedinLinks: Array.from(text.matchAll(/https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9_\-\/.]+/gi)).map(m => m[0]),
    githubLinks: Array.from(text.matchAll(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_\-\/.]+/gi)).map(m => m[0]),
    leetcodeLinks: Array.from(text.matchAll(/https?:\/\/(www\.)?leetcode\.com\/[a-zA-Z0-9_\-\/.]+/gi)).map(m => m[0]),
    education: { schools: [], college: "", cgpa: "" },
    projects: [],
    experience: [],
    skills: [],
    others: []
  };

  // Section headers
  const sectionOrder = [
    "professional summary", "summary", "profile", "education", "projects", "experience", "internship", "technical skills", "skills"
  ];

  // Helper: Find section indices
  function findSectionIndices(sectionNames) {
    const indices = [];
    lines.forEach((line, idx) => {
      sectionNames.forEach(name => {
        if (line.toLowerCase().replace(/[^a-z]/g, "").startsWith(name.replace(/[^a-z]/g, "").toLowerCase())) {
          indices.push({ name, idx });
        }
      });
    });
    return indices;
  }
  const sectionIndices = findSectionIndices(sectionOrder);
  sectionIndices.sort((a, b) => a.idx - b.idx);

  // Helper: Extract section by header
  function extractSection(headerArr) {
    for (let header of headerArr) {
      const idx = sectionIndices.findIndex(s => s.name === header);
      if (idx !== -1) {
        const start = sectionIndices[idx].idx + 1;
        const end = (sectionIndices[idx + 1] ? sectionIndices[idx + 1].idx : lines.length);
        return lines.slice(start, end).filter(l => l.length > 0);
      }
    }
    return null;
  }

  // Profile/Professional Summary (only summary, not links)
  let profileLines = extractSection(["professional summary", "summary", "profile"]);
  if (profileLines && profileLines.length > 0) {
    // Remove lines that are just links
    data.profile = profileLines.filter(l => !/https?:\/\//i.test(l)).join(" ").replace(/\n/g, " ").trim();
  } else {
    // Fallback: first 3-5 lines that are not links
    data.profile = lines.filter(l => !/https?:\/\//i.test(l)).slice(0, 5).join(" ").trim();
  }

  // Education: extract schools, college, cgpa
  let eduLines = extractSection(["education"]);
  if (eduLines) {
    data.education.schools = eduLines.filter(l => /(school)/i.test(l));
    const collegeLine = eduLines.find(l => /(college|university|institute)/i.test(l));
    if (collegeLine) data.education.college = collegeLine;
    const cgpaMatch = eduLines.join(" ").match(/(cgpa|gpa|percentage)[:\-\s]*([0-9.]+)/i);
    if (cgpaMatch) data.education.cgpa = cgpaMatch[2];
  }

  // Projects: extract all project lines
  let projLines = extractSection(["projects"]);
  if (projLines) {
    data.projects = projLines.filter(p => p && !/^projects?/i.test(p));
  } else {
    data.projects = lines.filter(l => /project|•|^\s*[-*]/i.test(l)).map(l => l.replace(/projects?[:\-]?/i, "").replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);
  }

  // Experience/Internships: merge both sections
  let expLines = extractSection(["experience"]) || [];
  let internLines = extractSection(["internship"]) || [];
  let allExp = [...expLines, ...internLines];
  if (allExp.length > 0) {
    data.experience = allExp.filter(e => e && !/^(internship|experience)/i.test(e));
  } else {
    data.experience = lines.filter(l => /(intern|experience|engineer|developer|manager|analyst|consultant)/i.test(l)).filter(l => l.length > 10);
  }

  // Skills: merge technical skills and skills
  let skillLines = extractSection(["technical skills"]) || extractSection(["skills"]);
  if (skillLines) {
    data.skills = skillLines.join(",").split(/,|·|-/).map(s => s.trim()).filter(Boolean);
  } else {
    const skillLine = lines.find(l => l.toLowerCase().includes("skills") || (l.split(",").length > 3));
    if (skillLine) {
      data.skills = skillLine.split(/,|·|-/).map(s => s.replace(/skills[:\-]?/i, "").trim()).filter(Boolean);
    }
  }

  // Others: anything that didn't fit above
  data.others = lines.filter(l => l.length > 0 && !data.profile.includes(l) && !data.education.schools.some(s => s.includes(l)) && !data.projects.some(p => p.includes(l)) && !data.experience.some(e => e.includes(l)) && !data.skills.some(s => l.includes(s))).filter(Boolean);

  return data;
}

export default function Resumedisplay() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loadingQs, setLoadingQs] = useState(false);
  const [qsError, setQsError] = useState("");
  const [answerText, setAnswerText] = useState("");

  const parsedData = useMemo(() => {
    if (state?.resumeText) {
      return advancedResumeParser(state.resumeText);
    }
    return null;
  }, [state]);

  useEffect(() => {
    if (!parsedData) {
      navigate("/");
    }
  }, [parsedData, navigate]);

  useEffect(() => {
    async function fetchQuestions() {
      if (!state?.resumeText) return;
      try {
        setLoadingQs(true);
        setQsError("");
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/ai/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: state.resumeText, count: 8 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get questions");
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (e) {
        setQsError(e.message);
      } finally {
        setLoadingQs(false);
      }
    }
    fetchQuestions();
  }, [state]);

  if (!parsedData) {
    return null;
  }

  return (
    <div className="resume-display-container">
      {/* Profile Section */}
      <motion.div className="resume-section profile-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Professional Summary</motion.h2>
        <motion.p variants={animationVariants}>{parsedData.profile || 'No summary found.'}</motion.p>
        <div style={{ marginTop: 16 }}>
          <button
            className="upload-btn"
            onClick={() => navigate('/interview', { state: { resumeText: state?.resumeText || '' } })}
          >
            Start Personalized Interview →
          </button>
        </div>
        <div className="profile-links">
          {parsedData.linkedinLinks.length > 0 && (
            <div><b>LinkedIn:</b> {parsedData.linkedinLinks.map((l, i) => <a key={i} href={l} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>
          )}
          {parsedData.githubLinks.length > 0 && (
            <div><b>GitHub:</b> {parsedData.githubLinks.map((l, i) => <a key={i} href={l} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>
          )}
          {parsedData.leetcodeLinks.length > 0 && (
            <div><b>LeetCode:</b> {parsedData.leetcodeLinks.map((l, i) => <a key={i} href={l} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>
          )}
        </div>
      </motion.div>

      {/* Education Section */}
      <motion.div className="resume-section education-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Education</motion.h2>
        {parsedData.education.college && (
          <div className="college-info"><b>College/University:</b> {parsedData.education.college}</div>
        )}
        {parsedData.education.schools.length > 0 && (
          <div className="schools-list">
            <b>Schools:</b>
            <ul>
              {parsedData.education.schools.map((school, idx) => (
                <li key={idx}>{school}</li>
              ))}
            </ul>
          </div>
        )}
        {parsedData.education.cgpa && (
          <div className="cgpa-info"><b>CGPA:</b> {parsedData.education.cgpa}</div>
        )}
      </motion.div>

      {/* Projects Section */}
      <motion.div className="resume-section projects-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Projects</motion.h2>
        {parsedData.projects.length > 0 ? (
          <motion.ul className="resume-list" initial="hidden" animate="visible">
            {parsedData.projects.map((project, idx) => (
              <motion.li key={idx} className="resume-list-item" whileHover={{ scale: 1.08, background: "#f0f0f0" }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>{project}</motion.li>
            ))}
          </motion.ul>
        ) : <p>No projects found.</p>}
      </motion.div>

      {/* AI-Generated Questions */}
      <motion.div className="resume-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Personalized Interview Questions</motion.h2>
        {loadingQs && <p>Generating questions from your resume...</p>}
        {qsError && <p style={{ color: "#ef4444" }}>Error: {qsError}</p>}
        {!loadingQs && !qsError && questions.length > 0 && (
          <motion.ol initial="hidden" animate="visible">
            {questions.map((q, idx) => (
              <motion.li key={idx} style={{ marginBottom: 8 }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }}>{q}</motion.li>
            ))}
          </motion.ol>
        )}
      </motion.div>

      {/* Answer Box only (sentiment removed) */}
      <motion.div className="resume-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Try an Answer</motion.h2>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
          placeholder="Type your answer here..."
        />
      </motion.div>

      {/* Experience Section */}
      <motion.div className="resume-section experience-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Experience / Internships</motion.h2>
        {parsedData.experience.length > 0 ? (
          <motion.ul className="resume-list" initial="hidden" animate="visible">
            {parsedData.experience.map((exp, idx) => (
              <motion.li key={idx} className="resume-list-item" whileHover={{ scale: 1.04, background: "#f8f8f8" }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>{exp}</motion.li>
            ))}
          </motion.ul>
        ) : <p>No experience/internships found.</p>}
      </motion.div>

      {/* Skills Section */}
      <motion.div className="resume-section skills-section"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}>
        <motion.h2 variants={animationVariants}>Technical Skills</motion.h2>
        {parsedData.skills.length > 0 ? (
          <div className="skills-list">
            {parsedData.skills.map((skill, idx) => (
              <span key={idx} className="skill-chip">{skill}</span>
            ))}
          </div>
        ) : <p>No skills found.</p>}
      </motion.div>

      {/* Others Section */}
      {parsedData.others.length > 0 && (
        <motion.div className="resume-section others-section"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}>
          <motion.h2 variants={animationVariants}>Other Information</motion.h2>
          <motion.ul className="resume-list" initial="hidden" animate="visible">
            {parsedData.others.map((info, idx) => (
              <motion.li key={idx} className="resume-list-item" whileHover={{ scale: 1.04, background: "#f8f8f8" }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>{info}</motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </div>
  );
}
