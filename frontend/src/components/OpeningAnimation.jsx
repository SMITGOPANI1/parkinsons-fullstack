// import React, { useEffect, useState } from "react";
// import "../pages/authpage.css";

// export default function OpeningAnimation() {
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       const el = document.getElementById("openingScreen");
//       if (el) {
//         el.style.opacity = "0";
//         el.style.transition = "opacity 1s ease-out";
//         setTimeout(() => {
//           setVisible(false);
//         }, 1000);
//       } else {
//         setVisible(false);
//       }
//     }, 4000);

//     return () => clearTimeout(timeout);
//   }, []);

//   if (!visible) return null;

//   return (
//     <div className="opening-screen" id="openingScreen">
//       <div className="opening-logo-container">
//         <div className="opening-circle">
//           <div className="opening-icon">
//             <svg
//               width="80"
//               height="80"
//               viewBox="0 0 80 80"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <rect
//                 x="28"
//                 y="10"
//                 width="24"
//                 height="32"
//                 rx="12"
//                 fill="rgba(255,255,255,0.95)"
//                 stroke="rgba(255,255,255,0.5)"
//                 strokeWidth="2"
//               />
//               <path
//                 d="M40 42L40 58"
//                 stroke="rgba(255,255,255,0.95)"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//               />
//               <path
//                 d="M30 58L50 58"
//                 stroke="rgba(255,255,255,0.95)"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </div>
//         </div>
//         <div className="opening-brand">ParkiScan</div>
//         <div className="opening-tagline">AI-Powered Voice Detection</div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "../pages/authpage.css";

export default function OpeningAnimation() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById("openingScreen");
      if (el) {
        el.style.opacity = "0";
        el.style.transition = "opacity 1s ease-out";
        setTimeout(() => {
          setVisible(false);
        }, 1000);
      } else {
        setVisible(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="opening-screen" id="openingScreen">
      <div className="opening-logo-container">
        <div className="opening-circle">
          <div className="opening-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="28"
                y="10"
                width="24"
                height="32"
                rx="12"
                fill="rgba(255,255,255,0.95)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />
              <path
                d="M40 42L40 58"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M30 58L50 58"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="opening-brand">ParkiScan</div>
        <div className="opening-tagline">AI-Powered Voice Detection</div>
      </div>
    </div>
  );
}
