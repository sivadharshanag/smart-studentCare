import React, { useState, useEffect } from 'react';
import './retrieve.css';

const Retrieve = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  // Sample data - in real app, this would come from API
  useEffect(() => {
    const sampleFiles = [
      {
        id: 1,
        name: 'Data Structures Notes.pdf',
        category: 'Computer Science',
        size: '2.5 MB',
        uploadDate: '2024-01-15',
        downloads: 45,
        type: 'pdf',
        description: 'Comprehensive notes on data structures and algorithms'
      },
      {
        id: 2,
        name: 'React Components Guide.docx',
        category: 'Web Development',
        size: '1.8 MB',
        uploadDate: '2024-01-12',
        downloads: 32,
        type: 'doc',
        description: 'Complete guide to React components and hooks'
      },
      {
        id: 3,
        name: 'Database Design Principles.pdf',
        category: 'Database',
        size: '3.2 MB',
        uploadDate: '2024-01-10',
        downloads: 28,
        type: 'pdf',
        description: 'Database normalization and design patterns'
      },
      {
        id: 4,
        name: 'Machine Learning Basics.pptx',
        category: 'AI/ML',
        size: '5.1 MB',
        uploadDate: '2024-01-08',
        downloads: 67,
        type: 'ppt',
        description: 'Introduction to machine learning concepts'
      },
      {
        id: 5,
        name: 'JavaScript ES6 Features.txt',
        category: 'Programming',
        size: '0.8 MB',
        uploadDate: '2024-01-05',
        downloads: 23,
        type: 'txt',
        description: 'Modern JavaScript features and syntax'
      },
      {
        id: 6,
        name: 'System Design Interview.pdf',
        category: 'Interview Prep',
        size: '4.3 MB',
        uploadDate: '2024-01-03',
        downloads: 89,
        type: 'pdf',
        description: 'System design concepts for technical interviews'
      }
    ];
    setFiles(sampleFiles);
  }, []);

  const categories = ['all', 'Computer Science', 'Web Development', 'Database', 'AI/ML', 'Programming', 'Interview Prep'];

  const filteredFiles = files
    .filter(file => 
      selectedCategory === 'all' || file.category === selectedCategory
    )
    .filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        case 'downloads':
          return b.downloads - a.downloads;
        case 'date':
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'ppt': return '📊';
      case 'txt': return '📋';
      default: return '📁';
    }
  };

  const handleDownload = (file) => {
    // Simulate download
    alert(`Downloading ${file.name}...`);
    setFiles(prev => 
      prev.map(f => 
        f.id === file.id 
          ? { ...f, downloads: f.downloads + 1 }
          : f
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="retrieve-container">
      <div className="retrieve-header">
        <h1>📥 Browse & Download</h1>
        <p>Access your uploaded documents and study materials</p>
      </div>

      <div className="retrieve-content">
        {/* Search and Filters */}
        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="downloads">Sort by Downloads</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span>{filteredFiles.length} files found</span>
          {searchTerm && <span>for "{searchTerm}"</span>}
          {selectedCategory !== 'all' && <span>in {selectedCategory}</span>}
        </div>

        {/* Files Display */}
        <div className={`files-display ${viewMode}`}>
          {filteredFiles.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📭</div>
              <h3>No files found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredFiles.map(file => (
              <div key={file.id} className="file-card">
                <div className="file-header">
                  <div className="file-icon">{getFileIcon(file.type)}</div>
                  <div className="file-meta">
                    <h3 className="file-title">{file.name}</h3>
                    <span className="file-category">{file.category}</span>
                  </div>
                </div>

                <div className="file-description">
                  <p>{file.description}</p>
                </div>

                <div className="file-stats">
                  <div className="stat">
                    <span className="stat-label">Size:</span>
                    <span className="stat-value">{file.size}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Uploaded:</span>
                    <span className="stat-value">{formatDate(file.uploadDate)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Downloads:</span>
                    <span className="stat-value">{file.downloads}</span>
                  </div>
                </div>

                <div className="file-actions">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(file)}
                  >
                    ⬇️ Download
                  </button>
                  <button className="preview-btn">
                    👁️ Preview
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Retrieve;
