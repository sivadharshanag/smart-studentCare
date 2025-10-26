import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import mammoth from "mammoth";
import { useNavigate } from "react-router-dom";
import "./Uploadresume.css";

// Configure PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const Uploadresume = () => {
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStep("Starting file processing...");

    const extension = file.name.split(".").pop().toLowerCase();
    let text = "";

    try {
      if (extension === "pdf") {
        text = await parsePDF(file);
      } else if (extension === "docx") {
        text = await parseDOCX(file);
      } else if (extension === "txt") {
        text = await parseTXT(file);
      } else {
        throw new Error("Unsupported file type");
      }

      setProgress(100);
      setProcessingStep("Resume parsed successfully! Redirecting...");
      try {
        localStorage.setItem('resumeText', text);
      } catch (e) {}
      
      // Small delay to show completion
      setTimeout(() => {
        navigate("/resume-display", { state: { resumeText: text } });
      }, 1000);

    } catch (error) {
      setProcessingStep(`Error: ${error.message}`);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep("");
        setProgress(0);
      }, 3000);
    }
  };

  // PDF Parsing with progress
  const parsePDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          setProcessingStep("Loading PDF document...");
          setProgress(20);
          
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          
          setProcessingStep("Extracting text from PDF pages...");
          setProgress(40);
          
          let text = "";
          const totalPages = pdf.numPages;
          
          for (let i = 0; i < totalPages; i++) {
            setProcessingStep(`Processing page ${i + 1} of ${totalPages}...`);
            setProgress(40 + ((i + 1) / totalPages) * 40);
            
            const page = await pdf.getPage(i + 1);
            const content = await page.getTextContent();
            text += content.items.map((s) => s.str).join(" ") + " ";
          }
          
          setProcessingStep("Finalizing text extraction...");
          setProgress(90);
          
          resolve(text);
        } catch (error) {
          reject(new Error("Failed to parse PDF: " + error.message));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read PDF file"));
      reader.readAsArrayBuffer(file);
    });
  };

  // DOCX Parsing with progress
  const parseDOCX = async (file) => {
    return new Promise((resolve, reject) => {
      try {
        setProcessingStep("Loading DOCX document...");
        setProgress(30);
        
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            setProcessingStep("Extracting text from DOCX...");
            setProgress(60);
            
            const arrayBuffer = event.target.result;
            const result = await mammoth.extractRawText({ arrayBuffer });
            
            setProcessingStep("Finalizing text extraction...");
            setProgress(90);
            
            resolve(result.value);
          } catch (error) {
            reject(new Error("Failed to parse DOCX: " + error.message));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read DOCX file"));
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(new Error("Failed to process DOCX file"));
      }
    });
  };

  // TXT Parsing with progress
  const parseTXT = async (file) => {
    return new Promise((resolve, reject) => {
      try {
        setProcessingStep("Reading text file...");
        setProgress(50);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setProcessingStep("Finalizing text extraction...");
          setProgress(90);
          resolve(event.target.result);
        };
        reader.onerror = () => reject(new Error("Failed to read text file"));
        reader.readAsText(file);
      } catch (error) {
        reject(new Error("Failed to process text file"));
      }
    });
  };

  const resetForm = () => {
    setFileName("");
    setIsProcessing(false);
    setProcessingStep("");
    setProgress(0);
    // Reset file input
    const fileInput = document.getElementById("resume-upload");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="upload-container">
      {/* Left side image */}
      <div className="upload-left">
        <img src="/uploadresume.jpg" alt="Interview" className="upload-image" />
        <div className="overlay-text">
          <h2 className="typing-text">🚀 Ready for your Dream Job?</h2>
          <p>Upload your resume & let AI guide you</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="upload-right">
        <h2 className="title">Upload Your Resume</h2>
        <p className="subtitle">Supported formats: PDF, DOCX, TXT</p>

        {!isProcessing ? (
          <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="resume-upload" className="custom-file-upload">
              {fileName ? fileName : "Choose a Resume File"}
            </label>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              disabled={isProcessing}
            />

            {fileName && (
              <button 
                type="button" 
                className="reset-btn"
                onClick={resetForm}
              >
                Choose Different File
              </button>
            )}

            <button type="submit" className="upload-btn" disabled={!fileName || isProcessing}>
              {fileName ? "Process Resume" : "Upload Resume"}
            </button>
          </form>
        ) : (
          <div className="processing-container">
            <div className="processing-header">
              <div className="processing-icon">📄</div>
              <h3>Processing Your Resume</h3>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{Math.round(progress)}%</span>
            </div>
            
            <p className="processing-step">{processingStep}</p>
            
            <div className="processing-tips">
              <h4>💡 What's happening?</h4>
              <ul>
                <li>AI is analyzing your resume structure</li>
                <li>Extracting key information and skills</li>
                <li>Organizing content into categories</li>
                <li>Preparing for intelligent display</li>
              </ul>
            </div>
          </div>
        )}

        <div className="upload-features">
          <h4>✨ AI-Powered Features</h4>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Smart Text Extraction</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Structured Analysis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Skill Identification</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Professional Display</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploadresume;
