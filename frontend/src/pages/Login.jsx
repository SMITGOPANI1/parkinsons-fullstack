// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/authpage.css";
import { auth, provider } from "../firebase"; // expects your firebase.js exports
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   // if user already logged in, redirect to detect
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigate("/detect", { replace: true });
  //     }
  //   });
  //   return () => unsub();
  // }, [navigate]);
 

  // Disabled auto-redirect so login always appears after animation
useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/detect", { replace: true });
    }
  });
  return () => unsub();
}, [navigate]);




  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email) return document.getElementById("signinEmail")?.focus();
    if (!password || password.length < 8) {
      document.getElementById("signinPassword")?.focus();
      return setErr("Password must be at least 8 characters.");
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will redirect
    } catch (error) {
      setErr(error.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };



  // Disabled auto-redirect so login always appears after animation
 

  const handleGoogle = async () => {
    setErr("");
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will redirect
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
    <>
      {/* Mesh background is global via CSS - you can include a small mesh here if you need */}
      <div id="signinPage" className="auth-page active">
        <div className="auth-header">
          <a
            href="#"
            className="auth-back"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0 });
              // optional: call showPage('home') if you have that function globally
              const home = document.getElementById("homePage");
              const signin = document.getElementById("signinPage");
              if (home && signin) {
                home.classList.add("active");
                signin.classList.remove("active");
              }
            }}
          >
            ← Back to Home
          </a>
          <h2 className="auth-header-title">Sign In to ParkiScan</h2>
          <div style={{ width: 120 }} />
        </div>

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-logo-circle" aria-hidden>
              {/* same SVG */}
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

            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to access your dashboard</p>

            <form id="signInForm" className="auth-form" onSubmit={handleEmailSignIn}>
              <div className="form-group">
                <label className="form-label" htmlFor="signinEmail">Email Address</label>
                <input
                  type="email"
                  id="signinEmail"
                  className="form-input"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signinPassword">Password</label>
                <div className="password-wrapper">
                  <input
                    type="password"
                    id="signinPassword"
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="password-toggle" onClick={() => togglePassword("signinPassword")}> 🔒 </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span>Remember me</span>
                </label>
                {/* we aren't using forgot (you said no OTP) but keep link hidden or disabled */}
                <a href="#" className="link-text" onClick={(e) => e.preventDefault()} style={{ opacity: 0.6, pointerEvents: "none" }}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div style={{ color: "#ff8080", marginBottom: 12 }}>{err}</div>

            <div className="divider"><span className="divider-line" /> <span className="divider-text">OR</span> <span className="divider-line" /></div>

            <div className="social-buttons">
              <button className="btn-social" onClick={handleGoogle} disabled={loading} title="Sign in with Google">
                <span style={{ fontSize: 18 }}>G</span>
                <span>Google</span>
              </button>
              <button className="btn-social" onClick={(e) => e.preventDefault()} title="Facebook disabled">
                <span style={{ fontSize: 18 }}>f</span>
                <span>Facebook</span>
              </button>
            </div>

            <p className="auth-footer">
              Don't have an account?{" "}
              <a
                href="#"
                className="link-text"
                onClick={(e) => {
                  e.preventDefault();
                  // swap to signup page in DOM (keeps structure same)
                  const signup = document.getElementById("signupPage");
                  const signin = document.getElementById("signinPage");
                  if (signup && signin) {
                    signup.classList.add("active");
                    signin.classList.remove("active");
                  }
                }}
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
