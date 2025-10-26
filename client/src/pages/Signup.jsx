import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./styles/signup.css";

export default function Signup({ role }) {
  const navigate = useNavigate();

  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { ...data, role });
      alert("Registered successfully!");
      navigate("/login");

    } catch (err) {
      alert("Signup failed!");
    }
  };

  const isFilled = (field) => data[field].trim().length > 0;

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* LEFT FORM SIDE */}
        <div className="signup-form-side">
          <h1 className="signup-title">Sign up</h1>
          <p className="signup-subtitle">Welcome to Handspace – Let’s create account</p>
          
          <div className="social-login">
            <button className="social-btn google">Log in with Google</button>
           
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className={`input-group ${isFilled("name") ? "valid" : ""}`}>
              <input type="text" name="name" placeholder="Name" value={data.name} onChange={handleChange} required />
              {isFilled("name") && <span className="tick">✔️</span>}
            </div>
            <div className={`input-group ${isFilled("email") ? "valid" : ""}`}>
              <input type="email" name="email" placeholder="E-mail" value={data.email} onChange={handleChange} required />
              {isFilled("email") && <span className="tick">✔️</span>}
            </div>
            <div className={`input-group ${isFilled("password") ? "valid" : ""}`}>
              <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleChange} required />
              {isFilled("password") && <span className="pencil">✏️</span>}
            </div>

           
            <button type="submit" className="submit-btn">
  Sign Up <span role="img" aria-label="shoe">👟</span>
</button>

          </form>
        </div>
       
        {/* RIGHT SIDE ANIMATION */}
        <div className="signup-video-side">
          <video autoPlay loop muted className="signup-video">
           <source src="/signup-animation.mp4" type="video/mp4" />
   
            Your browser does not support the video tag.
          </video>
          <div className="video-caption">
            <h3>Find Your <span role="img" aria-label="lotus">🧘‍♀️</span> Balance</h3>
            <p>Helping you achieve clarity, harmony, and personal growth. Together, we create lasting change.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
