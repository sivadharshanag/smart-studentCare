import React, { useState } from 'react';
import './upload.css';

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({
          ...prev,
          [i]: progress
        }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setIsUploading(false);
    alert('Files uploaded successfully!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1>📤 Upload Documents</h1>
        <p>Upload your notes, documents, and study materials</p>
      </div>

      <div className="upload-content">
        <div 
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <h3>Drag & Drop Files Here</h3>
            <p>or click to browse files</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="file-input"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="files-list">
            <h3>Selected Files ({selectedFiles.length})</h3>
            <div className="files-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <div className="file-icon">
                      {file.type.includes('pdf') ? '📄' : 
                       file.type.includes('doc') ? '📝' : 
                       file.type.includes('image') ? '🖼️' : '📋'}
                    </div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  
                  {uploadProgress[index] !== undefined && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${uploadProgress[index]}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="upload-actions">
              <button 
                className="upload-btn"
                onClick={uploadFiles}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
              </button>
              
              <button 
                className="clear-btn"
                onClick={() => setSelectedFiles([])}
                disabled={isUploading}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        <div className="upload-info">
          <h3>📋 Supported File Types</h3>
          <div className="file-types">
            <span className="file-type">PDF</span>
            <span className="file-type">DOC/DOCX</span>
            <span className="file-type">TXT</span>
            <span className="file-type">PPT/PPTX</span>
            <span className="file-type">Images</span>
          </div>
          
          <div className="upload-tips">
            <h4>💡 Tips:</h4>
            <ul>
              <li>Maximum file size: 10MB per file</li>
              <li>You can upload multiple files at once</li>
              <li>Organize files with clear, descriptive names</li>
              <li>PDF files are recommended for best compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
