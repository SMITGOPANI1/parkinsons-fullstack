import React, { useEffect, useRef, useState } from "react";

export default function HomeIntro({
  companyName = "ParkiScan",
  heroTitle = "Early Detection Saves Lives",
  heroSubtitle = "Advanced voice analysis using artificial intelligence to detect early signs of Parkinson's disease. Fast, accurate, and completely non-invasive screening.",
}) {
  const [openingVisible, setOpeningVisible] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const heroRef = useRef(null);

  // Opening animation (4.2s)
  useEffect(() => {
    const t = setTimeout(() => setOpeningVisible(false), 4200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.background = "#0f0f23";
    document.body.style.color = "#ffffff";
  }, []);

  // Hero spotlight
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x =
        (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y =
        (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--hover", "1");
    }
    function onLeave() {
      el.style.setProperty("--hover", "0");
    }
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchend", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchend", onLeave);
    };
  }, [heroRef]);

  function showPage(p) {
    const pages = [
      "home",
      "features",
      "learnmore",
      "about",
      "contact",
      "terms",
      "privacy",
    ];
    if (!pages.includes(p)) return;
    setActivePage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLearnMore() {
    showPage("about");
  }

  return (
    <div className="parkiscan-homeintro-root">
      <style>{`
        html,body{margin:0;padding:0;box-sizing:border-box;font-family:'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif;background:#0f0f23;color:#fff;overflow-x:hidden;}
        .mesh-background{position:fixed;inset:0;z-index:-1;background:linear-gradient(135deg,#1a1a3e 0%,#0f0f23 50%,#1a0033 100%);}
        .mesh-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.55;animation:blobFloat 22s ease-in-out infinite;}
        .mesh-blob:nth-child(1){width:500px;height:500px;top:-240px;left:-240px;background:linear-gradient(135deg,#00f5ff,#0066ff);}
        .mesh-blob:nth-child(2){width:420px;height:420px;top:45%;right:-210px;background:linear-gradient(135deg,#ff00ff,#ff0099);animation-delay:-7s;}
        .mesh-blob:nth-child(3){width:620px;height:620px;bottom:-300px;left:50%;background:linear-gradient(135deg,#00ff88,#00ccff);animation-delay:-14s;}
        @keyframes blobFloat{0%,100%{transform:translate3d(0,0,0) scale(1);}33%{transform:translate3d(80px,-80px,0) scale(1.07);}66%{transform:translate3d(-80px,80px,0) scale(0.95);}}
        .opening-screen{position:fixed;inset:0;background:#0f0f23;display:flex;align-items:center;justify-content:center;z-index:10000;}
        .opening-logo-container{display:flex;flex-direction:column;align-items:center;gap:10px;animation:logoIn 1.1s cubic-bezier(.2,.9,.3,1) both;}
        .opening-circle{width:180px;height:180px;border-radius:50%;background:conic-gradient(from 150deg,#00f5ff30,#0066ff30,#ff00ff30);display:flex;align-items:center;justify-content:center;box-shadow:0 22px 120px rgba(0,0,0,0.6);}
        .opening-icon{width:84px;height:84px;border-radius:12px;background:linear-gradient(135deg,#fff,#00f5ff);display:grid;place-items:center;transform:rotate(-8deg);}
        .opening-brand{font-weight:900;font-size:36px;background:linear-gradient(90deg,#00f5ff,#ff00ff);-webkit-background-clip:text;color:transparent;}
        @keyframes logoIn{0%{transform:scale(.6);opacity:0;}100%{transform:scale(1);opacity:1;}}
        nav{position:fixed;top:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:18px;padding:10px 20px;border-radius:40px;background:rgba(255,255,255,0.03);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.04);z-index:900;}
        .nav-logo{font-weight:900;font-size:18px;background:linear-gradient(90deg,#00f5ff,#ff00ff);-webkit-background-clip:text;color:transparent;cursor:pointer;}
        .nav-links{display:flex;gap:14px;}
        .nav-link{font-weight:700;color:rgba(255,255,255,0.85);font-size:13px;padding:6px;cursor:pointer;position:relative;}
        .nav-link::after{content:'';position:absolute;left:0;bottom:-6px;height:3px;width:0;background:linear-gradient(90deg,#00f5ff,#ff00ff);transition:width .22s;}
        .nav-link:hover::after{width:100%;}
        .nav-btn{margin-left:12px;padding:9px 16px;border-radius:999px;background:linear-gradient(90deg,#00f5ff,#0066ff);border:none;color:#001220;font-weight:900;cursor:pointer;}
        .hero{min-height:80vh;display:flex;align-items:center;justify-content:center;padding:84px 28px;}
        .hero-content{max-width:980px;text-align:center;position:relative;padding:32px;border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.006));backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.03);box-shadow:0 30px 90px rgba(0,0,0,0.6);}
        .hero-title{font-size:44px;line-height:1.02;font-weight:900;margin-bottom:12px;background:linear-gradient(90deg,#fff,#00f5ff,#ff00ff);-webkit-background-clip:text;color:transparent;}
        .hero-subtitle{color:rgba(255,255,255,0.78);font-size:16px;max-width:820px;margin:8px auto 22px;}
        .hero-buttons{display:flex;gap:12px;justify-content:center;}
        .btn-primary{padding:12px 26px;border-radius:999px;border:none;font-weight:900;cursor:pointer;background:linear-gradient(90deg,#00f5ff,#0066ff);}
        .btn-secondary{padding:10px 22px;border-radius:999px;border:1px solid rgba(255,255,255,0.06);background:transparent;font-weight:800;cursor:pointer;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* Background blobs */}
      <div className="mesh-background" aria-hidden>
        <div className="mesh-blob" />
        <div className="mesh-blob" />
        <div className="mesh-blob" />
      </div>

      {/* Opening Animation */}
      {openingVisible && (
        <div className="opening-screen" role="dialog" aria-label="Opening animation">
          <div className="opening-logo-container">
            <div className="opening-circle">
              <div className="opening-icon" aria-hidden>
                <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
                  <rect
                    x="28"
                    y="10"
                    width="24"
                    height="32"
                    rx="12"
                    fill="rgba(255,255,255,0.96)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                  />
                  <path
                    d="M 40 42 L 40 58"
                    stroke="rgba(255,255,255,0.96)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 58 L 50 58"
                    stroke="rgba(255,255,255,0.96)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="opening-brand">{companyName}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!openingVisible && (
        <nav>
          <div className="nav-logo" onClick={() => showPage("home")}>
            {companyName}
          </div>
          <div className="nav-links">
            <div className="nav-link" onClick={() => showPage("features")}>
              Features
            </div>
            <div className="nav-link" onClick={() => showPage("about")}>
              About
            </div>
            <div className="nav-link" onClick={() => handleLearnMore()}>
              Learn More
            </div>
            <div className="nav-link" onClick={() => showPage("contact")}>
              Contact
            </div>
          </div>
          <button
            className="nav-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Sign In
          </button>
        </nav>
      )}

      {/* Hero Section */}
      {!openingVisible && activePage === "home" && (
        <section className="hero">
          <div
            className="hero-content"
            ref={heroRef}
            style={{ "--mx": "50%", "--my": "50%", "--hover": 0 }}
          >
            <div className="hero-badge">✨ AI-Powered Detection Platform</div>
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-subtitle">{heroSubtitle}</p>
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => (window.location.href = "/login")}
              >
                Get Started
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleLearnMore()}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
