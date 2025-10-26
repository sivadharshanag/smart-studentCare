import React, { useState } from "react";
import axios from "axios";
import "./program.css";
import { Player } from "@lottiefiles/react-lottie-player";


const Program = () => {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!semester || !subject || !category || !file) {
      setMessage("❗ Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("category", category);
    formData.append("note", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message || "✅ Uploaded successfully!");
      setSemester("");
      setSubject("");
      setCategory("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  return (
    <section id="program" className="upload-section" style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafd' }}>
      <div className="upload-grid" style={{ width: '100%', maxWidth: '1200px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Upload Form Card */}
        <form onSubmit={handleUpload} className="upload-form" style={{ flex: '1 1 340px', minWidth: '280px', maxWidth: '420px', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Upload Notes</h2>

          <label>Semester</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
            <option value="">-- Select Semester --</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Semester 3">Semester 3</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 6">Semester 6</option>
            <option value="Semester 7">Semester 7</option>
            <option value="Semester 8">Semester 8</option>
          </select>

          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Subject Name"
            required
          />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">-- Select Category --</option>
            <option value="Syllabus">Syllabus</option>
            <option value="CAT">CAT</option>
            <option value="Question Paper">Question Paper</option>
            <option value="Notes">Notes</option>
          </select>

          <label>Choose File (PDF/DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button type="submit">Upload Note</button>
          {message && <p className="upload-message">{message}</p>}
        </form>

        {/* Info Card */}
        <div className="syllabus-illustration">
          <div className="illustration-card">
           
<video
  src="/signup-animation.mp4"
  autoPlay
  loop
  muted
  playsInline
  style={{ height: "200px", width: "100%", margin: "auto", borderRadius: "12px" }}
></video>
            <div className="card-header">
              <div className="card-avatar">
                <div className="avatar-dot"></div>
              </div>
              <div className="card-info">
                <div className="info-line long"></div>
                <div className="info-line short"></div>
              </div>
              <div className="card-icon"></div>
            </div>

            <div className="card-chart"></div>

            <div className="syllabus-content">
              <div className="syllabus-item">
                <div className="item-number">1</div>
                <div className="item-content">
                  <div className="item-title">Organized Uploads</div>
                  <div className="item-description">Store and manage notes semester-wise and subject-wise.</div>
                </div>
              </div>
              <div className="syllabus-item">
                <div className="item-number">2</div>
                <div className="item-content">
                  <div className="item-title">Easy Retrieval</div>
                  <div className="item-description">Each subject is divided into syllabus, CAT, question paper and notes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Program;
