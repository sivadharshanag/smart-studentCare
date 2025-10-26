import { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./styles/login.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  
  const navigate = useNavigate();

  const isFilled = (field) => data[field].trim().length > 0;

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", data);
    
    // ✅ Store token, name, and role in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("role", res.data.role);

    navigate("/home"); // or wherever you want
  } catch (err) {
    alert("Login failed!");
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        {/* LEFT FORM */}
        <div className="login-form-side">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Login to continue your journey 🌸</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className={`input-group ${isFilled("email") ? "valid" : ""}`}>
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                required
              />
              {isFilled("email") && <span className="tick">✔️</span>}
            </div>

            <div className={`input-group ${isFilled("password") ? "valid" : ""}`}>
              <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
                required
              />
              {isFilled("password") && <span className="lock">🔒</span>}
            </div>

            <button type="submit" className="login-btn">Login 🚀</button>
            

<div className="signup-redirect">
  <p>Don't have an account?</p>
  <button type="button" className="signup-btn" onClick={() => navigate("/signup/uploader")}>
    Sign up as Uploader
  </button>
  <button type="button" className="signup-btn" onClick={() => navigate("/signup/retriever")}>
    Sign up as Retriever
  </button>
</div>

          </form>
        </div>

        {/* RIGHT IMAGE/VIDEO */}
        <div className="login-visual-side">
          <video autoPlay loop muted className="login-video">
            <source src="/signup-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="visual-caption">
            <h3>Grow Peacefully 🧡</h3>
            <p>Unlock your full potential with mindful moments and balance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
