// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import OpeningAnimation from "./components/OpeningAnimation";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Detect from "./components/Detect";
// import "./pages/authpage.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <OpeningAnimation />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/detect" element={<Detect />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Detect from "./components/Detect";
import Home from "./pages/Home"; // ✅ add this import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ New Home Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/detect" element={<Detect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
