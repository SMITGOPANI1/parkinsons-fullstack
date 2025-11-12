import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./detect.css";

function Detect() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const chunksRef = useRef([]);

  // 🔹 Fetch all saved recordings
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

  // 🎤 Start recording
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
        setUploadedFile(null); // clear upload if new recording
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
      setResult(null);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  // ⏹ Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    }
    setRecording(false);
  };

  // 📁 Handle uploaded file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAudioURL(URL.createObjectURL(file));
      chunksRef.current = []; // clear recorded audio
      setResult(null);
    }
  };

  // 🧠 Predict audio
  const uploadAndPredict = async () => {
    let formData = new FormData();

    if (uploadedFile) {
      formData.append("audio", uploadedFile);
    } else if (chunksRef.current.length) {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      formData.append("audio", blob, "recording.webm");
    } else {
      alert("Please record or upload an audio file first.");
      return;
    }

    setLoading(true);
    setResult(null);

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

        {/* 🎛️ Controls */}
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

        {/* 📁 Upload Button */}
        <div className="upload-section">
          <label htmlFor="audioUpload" className="upload-label">
            📁 Upload Audio File
          </label>
          <input
            type="file"
            id="audioUpload"
            accept=".wav,.webm"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* 🎧 Audio Player */}
        {audioURL && (
          <div className="audio-box">
            <audio controls src={audioURL}></audio>
          </div>
        )}

        {/* 🧾 Prediction Results */}
       {result && (
  <div
    className={`result-box ${
      result.prediction === 1 ? "red" : "green"
    }`}
  >
    <h3>🧠 Parkinson’s Detection Result</h3>
    <p>
      <strong>Prediction:</strong>{" "}
      {result.prediction === 1
        ? "Parkinson’s Detected"
        : "No Parkinson’s Detected"}
    </p>
    <p>
      <strong>Risk:</strong> {(result.score * 100).toFixed(1)}%
    </p>
  </div>
)}

        {/* 🎵 Saved Recordings */}
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
