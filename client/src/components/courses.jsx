import React, { useEffect, useState } from "react";
import axios from "axios";
import "./courses.css";

const Courses = () => {
  const [notesData, setNotesData] = useState({});
  const [expandedSemester, setExpandedSemester] = useState("");
  const [expandedSubject, setExpandedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios
      .get("http://localhost:5000/api/upload/notes")
      .then((res) => setNotesData(res.data))
      .catch((err) => console.error("Error fetching notes", err));
  };

  const toggleSemester = (sem) => {
    setExpandedSemester(expandedSemester === sem ? "" : sem);
    setExpandedSubject("");
  };

  const toggleSubject = (subject) => {
    setExpandedSubject(expandedSubject === subject ? "" : subject);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const res = await axios.delete(
          `http://localhost:5000/api/upload/delete/${noteId}`,
        );
        if (res.status === 200) {
          alert(res.data.message || "🗑️ Note deleted successfully!");
          fetchNotes();
        } else {
          alert("⚠️ Failed to delete the note.");
        }
      } catch (err) {
        console.error("Delete failed", err);
        alert("❌ Error deleting the note.");
      }
    }
  };

  const matchesSearch = (sem, subj, cat, file) => {
    const term = searchTerm.toLowerCase();
    return (
      sem.toLowerCase().includes(term) ||
      subj.toLowerCase().includes(term) ||
      cat.toLowerCase().includes(term) ||
      file.filename.toLowerCase().includes(term)
    );
  };

  return (
    <section id="courses" className="courses-section">
      <div className="courses-grid">
        {/* Header Section */}
        <div className="header-section">
          <div className="container">
            <h1 className="main-title">📁 Explore Notes</h1>
            <p className="main-subtitle">
              Discover and access your learning materials with organized course
              content
            </p>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <svg
                  className="search-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  className="search-input"
                  type="text"
                  placeholder="🔍 Search notes, subjects, or semesters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="container">
            <div className="content-grid">
              {/* Left Side - Professional Image */}
              <div className="image-section">
                <img
                  src="./retrive.jpg"
                  alt="Professional Education"
                  className="professional-image"
                />
              </div>

              {/* Right Side - Notes Grid */}
              <div className="notes-section">
                <div className="notes-grid">
                  {Object.keys(notesData).map((sem) => {
                    const filteredSubjects = Object.keys(notesData[sem]).filter(
                      (subj) =>
                        Object.keys(notesData[sem][subj]).some((cat) =>
                          notesData[sem][subj][cat].some((file) =>
                            matchesSearch(sem, subj, cat, file),
                          ),
                        ),
                    );

                    if (filteredSubjects.length === 0) return null;

                    return (
                      <div key={sem} className="semester-card">
                        <div
                          className={`semester-header ${expandedSemester === sem ? "expanded" : ""}`}
                          onClick={() => toggleSemester(sem)}
                        >
                          <div className="card-icon">
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="semester-icon-svg"
                            >
                              <path
                                d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                fill="white"
                                className="pulse-dot"
                              />
                            </svg>
                          </div>
                          <h3 className="card-title">{sem}</h3>
                          <p className="card-description">
                            {filteredSubjects.length} subjects available with
                            comprehensive study materials
                          </p>
                          <div className="expand-indicator">
                            {expandedSemester === sem ? "−" : "+"}
                          </div>
                        </div>

                        {expandedSemester === sem && (
                          <div className="expanded-content">
                            {filteredSubjects.map((subj) => {
                              const filteredCategories = Object.keys(
                                notesData[sem][subj],
                              ).filter((cat) =>
                                notesData[sem][subj][cat].some((file) =>
                                  matchesSearch(sem, subj, cat, file),
                                ),
                              );

                              return (
                                <div key={subj} className="subject-card">
                                  <div
                                    className={`subject-header ${expandedSubject === subj ? "expanded" : ""}`}
                                    onClick={() => toggleSubject(subj)}
                                  >
                                    <div className="subject-icon">
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="subject-icon-svg"
                                      >
                                        <path
                                          d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="8"
                                          y="10"
                                          width="8"
                                          height="1"
                                          fill="white"
                                          className="loading-bar"
                                        />
                                        <rect
                                          x="8"
                                          y="12"
                                          width="6"
                                          height="1"
                                          fill="white"
                                          className="loading-bar-2"
                                        />
                                        <rect
                                          x="8"
                                          y="14"
                                          width="4"
                                          height="1"
                                          fill="white"
                                          className="loading-bar-3"
                                        />
                                      </svg>
                                    </div>
                                    <span className="subject-name">{subj}</span>
                                    <span className="category-badge">
                                      {filteredCategories.length} categories
                                    </span>
                                  </div>

                                  {expandedSubject === subj && (
                                    <div className="categories-container">
                                      {filteredCategories.map((cat) => (
                                        <div
                                          key={cat}
                                          className="category-section"
                                        >
                                          <h4 className="category-title">
                                            {cat}
                                          </h4>
                                          <div className="files-list">
                                            {notesData[sem][subj][cat]
                                              .filter((file) =>
                                                matchesSearch(
                                                  sem,
                                                  subj,
                                                  cat,
                                                  file,
                                                ),
                                              )
                                              .map((file) => (
                                                <div
                                                  key={file.id}
                                                  className="file-item"
                                                >
                                                  <div className="file-content">
                                                    <span className="file-icon">
                                                      <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        className="file-icon-svg"
                                                      >
                                                        <path
                                                          d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                                                          fill="currentColor"
                                                        />
                                                        <path
                                                          d="M14 2V8H20"
                                                          stroke="white"
                                                          strokeWidth="2"
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          className="file-corner"
                                                        />
                                                        <line
                                                          x1="8"
                                                          y1="12"
                                                          x2="16"
                                                          y2="12"
                                                          stroke="white"
                                                          strokeWidth="1"
                                                          className="file-line-1"
                                                        />
                                                        <line
                                                          x1="8"
                                                          y1="15"
                                                          x2="14"
                                                          y2="15"
                                                          stroke="white"
                                                          strokeWidth="1"
                                                          className="file-line-2"
                                                        />
                                                        <line
                                                          x1="8"
                                                          y1="18"
                                                          x2="12"
                                                          y2="18"
                                                          stroke="white"
                                                          strokeWidth="1"
                                                          className="file-line-3"
                                                        />
                                                      </svg>
                                                    </span>
                                                   <div className="file-info">
  <a
    href={file.url}
    target="_blank"
    rel="noreferrer"
    className="file-name"
  >
    {file.filename}
  </a>
  <span className="file-meta">
    {file.uploadDate && new Date(file.uploadDate).toLocaleDateString()}
  </span>
</div>
                                                  </div>
                                                  {userRole === "uploader" && (
                                                    <button
                                                      className="delete-btn"
                                                      onClick={() =>
                                                        handleDelete(file.id)
                                                      }
                                                      title="Delete file"
                                                    >
                                                      ❌
                                                    </button>
                                                  )}
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {Object.keys(notesData).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No notes found</h3>
                <p>Start by uploading your first notes to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;