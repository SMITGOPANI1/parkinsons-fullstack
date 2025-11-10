
// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import "./detect.css";

// function Detect() {
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioURL, setAudioURL] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [recordings, setRecordings] = useState([]);
//   const chunksRef = useRef([]);

//   // Fetch list of saved recordings
//   const fetchRecordings = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:5000/recordings");
//       setRecordings(res.data.recordings.reverse());
//     } catch (err) {
//       console.log("Failed to fetch recordings");
//     }
//   };

//   useEffect(() => {
//     fetchRecordings();
//   }, []);

//   const startRecording = async () => {
//     chunksRef.current = [];
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mr = new MediaRecorder(stream);
//       mr.ondataavailable = (e) => {
//         if (e.data.size > 0) chunksRef.current.push(e.data);
//       };
//       mr.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         setAudioURL(URL.createObjectURL(blob));
//       };
//       mr.start();
//       setMediaRecorder(mr);
//       setRecording(true);
//       setResult(null);
//     } catch (err) {
//       alert("Microphone access denied.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       mediaRecorder.stream.getTracks().forEach((t) => t.stop());
//     }
//     setRecording(false);
//   };

//   const uploadAndPredict = async () => {
//     if (!chunksRef.current.length) {
//       alert("Record audio first.");
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//     const formData = new FormData();
//     formData.append("audio", blob, "recording.webm");

//     try {
//       const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setResult(res.data);
//       fetchRecordings();
//     } catch (err) {
//       console.error(err);
//       alert("Prediction failed — check backend.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="detect-page">
//       <div className="detect-panel">
//         <h1>🧠 Parkinson’s Detection System</h1>

//         <div className="controls">
//           <button
//             onClick={recording ? stopRecording : startRecording}
//             className={recording ? "stop-btn" : "record-btn"}
//           >
//             {recording ? "Stop Recording" : "Start Recording"}
//           </button>

//           <button
//             onClick={uploadAndPredict}
//             disabled={loading}
//             className="predict-btn"
//           >
//             {loading ? "Predicting..." : "Predict"}
//           </button>
//         </div>

//         {audioURL && (
//           <div className="audio-box">
//             <audio controls src={audioURL}></audio>
//           </div>
//         )}

//         {result && (
//           <div className="result-box">
//             <h3>
//               {result.prediction === 1
//                 ? "⚠️ Possible Parkinson’s"
//                 : "✅ No Parkinson’s Detected"}
//             </h3>
//             <p>Confidence: {(result.score * 100).toFixed(1)}%</p>
//           </div>
//         )}

//         <h2 className="list-title">🎧 Saved Recordings</h2>
//         <div className="recordings-list">
//           {recordings.length === 0 ? (
//             <p>No recordings available.</p>
//           ) : (
//             recordings.map((url, i) => (
//               <div key={i} className="recording-item">
//                 <span>Recording {i + 1}</span>
//                 <a href={url} target="_blank" rel="noreferrer">
//                   ▶ Play
//                 </a>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Detect;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./detect.css";

function Detect() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const chunksRef = useRef([]);

  const fetchRecordings = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/recordings");
      setRecordings(res.data.recordings.reverse());
    } catch (err) {
      console.log("No recordings found");
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const startRecording = async () => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
      setResult(null);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    }
    setRecording(false);
  };

  const uploadAndPredict = async () => {
    if (!chunksRef.current.length) {
      alert("Please record audio first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      fetchRecordings();
    } catch (err) {
      console.error(err);
      alert("Prediction failed — check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detect-page">
      <div className="detect-panel">
        <h1>🧠 Parkinson’s Voice Detection System</h1>

        <div className="controls">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={recording ? "stop-btn" : "record-btn"}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>

          <button
            onClick={uploadAndPredict}
            disabled={loading}
            className="predict-btn"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>

        {audioURL && (
          <div className="audio-box">
            <audio controls src={audioURL}></audio>
          </div>
        )}

        {result && (
            <div
    className={`result-box ${
      result.prediction === 1 ? "red" : "green"
    }`}
  >
    <p className="result-line">
      <strong>Prediction:</strong>{" "}
      {result.prediction === 1
        ? "Parkinson’s Detected"
        : "No Parkinson’s Detected"}
    </p>
    <p className="result-line">
      <strong>Risk:</strong> {(result.score * 100).toFixed(1)}%
    </p>
  </div>
          // <div
          //   className="result-box"
          //   style={{
          //     borderColor: result.prediction === 1 ? "#e74c3c" : "#27ae60",
          //     color: result.prediction === 1 ? "#ff6b6b" : "#2ecc71",
          //   }}
          // >
          //   <p className="result-line">
          //     <strong>Prediction:</strong>{" "}
          //     {result.prediction === 1
          //       ? "Parkinson’s Detected"
          //       : "No Parkinson’s Detected"}
          //   </p>
          //   <p className="result-line">
          //     <strong>Risk:</strong> {(result.score * 100).toFixed(1)}%
          //   </p>
          // </div>
        )}

        <h2 className="list-title">🎧 Saved Recordings</h2>
        <div className="recordings-list">
          {recordings.length === 0 ? (
            <p>No recordings available.</p>
          ) : (
            recordings.map((url, i) => (
              <div key={i} className="recording-item">
                <span>Recording {i + 1}</span>
                <a href={url} target="_blank" rel="noreferrer">
                  ▶ Play
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Detect;
