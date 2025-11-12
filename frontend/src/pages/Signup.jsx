// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/authpage.css";
import { auth, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name) return document.getElementById("signupName")?.focus();
    if (!email) return document.getElementById("signupEmail")?.focus();
    if (!password || password.length < 8) {
      document.getElementById("signupPassword")?.focus();
      return setErr("Password must be at least 8 characters.");
    }
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // set displayName if possible
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      navigate("/detect", { replace: true });
    } catch (error) {
      setErr(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/detect", { replace: true });
    } catch (error) {
      setErr(error.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (id) => {
    const input = document.getElementById(id);
    const btn = input?.parentElement?.querySelector(".password-toggle");
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (btn) btn.textContent = "👁️";
    } else {
      input.type = "password";
      if (btn) btn.textContent = "🔒";
    }
  };

  return (
    <div id="signupPage" className="auth-page">
      <div className="auth-header">
        <a
          href="#"
          className="auth-back"
          onClick={(e) => {
            e.preventDefault();
            const home = document.getElementById("homePage");
            const signup = document.getElementById("signupPage");
            if (home && signup) {
              home.classList.add("active");
              signup.classList.remove("active");
            }
          }}
        >
          ← Back to Home
        </a>
        <h2 className="auth-header-title">Create Your Account</h2>
        <div style={{ width: 120 }} />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo-circle" aria-hidden>
            <svg
              width="50"
              height="50"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="30"
                y="15"
                width="20"
                height="28"
                rx="10"
                fill="url(#micGradient)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <path
                d="M 40 43 L 40 55"
                stroke="url(#standGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 32 55 L 48 55"
                stroke="url(#standGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="micGradient" x1="40" y1="15" x2="40" y2="43" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="50%" stopColor="#0066ff" />
                  <stop offset="100%" stopColor="#8a2be2" />
                </linearGradient>
                <linearGradient id="standGradient" x1="40" y1="43" x2="40" y2="55" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0066ff" />
                  <stop offset="100%" stopColor="#00f5ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join ParkiScan to get started</p>

          <form id="signUpForm" className="auth-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label" htmlFor="signupName">Full Name</label>
              <input
                type="text"
                id="signupName"
                className="form-input"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signupEmail">Email Address</label>
              <input
                type="email"
                id="signupEmail"
                className="form-input"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signupPhone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="signupPhone"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signupPassword">Password</label>
              <div className="password-wrapper">
                <input
                  type="password"
                  id="signupPassword"
                  className="form-input"
                  placeholder="Create a strong password (min. 8 characters)"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="password-toggle" onClick={() => togglePassword("signupPassword")}> 🔒 </button>
              </div>
            </div>

            <label className="checkbox-label" style={{ marginBottom: 20 }}>
              <input type="checkbox" className="checkbox-input" required />
              <span>
                I agree to the{" "}
                <a href="#" className="link-text" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="link-text" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </span>
            </label>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div style={{ color: "#ff8080", marginBottom: 12 }}>{err}</div>

          <div className="divider"><span className="divider-line" /> <span className="divider-text">OR</span> <span className="divider-line" /></div>

          <div className="social-buttons">
            <button className="btn-social" onClick={handleGoogle} disabled={loading} title="Sign up with Google">
              <span style={{ fontSize: 18 }}>G</span>
              <span>Google</span>
            </button>
            <button className="btn-social" onClick={(e) => e.preventDefault()}>
              <span style={{ fontSize: 18 }}>f</span>
              <span>Facebook</span>
            </button>
          </div>

          <p className="auth-footer">
            Already have an account?{" "}
            <a
              href="#"
              className="link-text"
              onClick={(e) => {
                e.preventDefault();
                const signup = document.getElementById("signupPage");
                const signin = document.getElementById("signinPage");
                if (signup && signin) {
                  signin.classList.add("active");
                  signup.classList.remove("active");
                }
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

