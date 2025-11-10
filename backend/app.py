# # app.py — Flask backend for Parkinson’s detection
# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import os
# import tempfile
# from datetime import datetime
# from pydub import AudioSegment
# import librosa
# import numpy as np
# import joblib

# # -------------------------------
# # 🔹 Setup
# # -------------------------------
# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Set ffmpeg path (adjust if your path differs)
# AudioSegment.converter = r"C:\Program Files\ffmpeg\bin\ffmpeg.exe"

# # -------------------------------
# # 🔹 Load trained model
# # -------------------------------
# MODEL_PATH = "model.pkl"
# try:
#     model = joblib.load(MODEL_PATH)
#     print("✅ Model loaded successfully.")
#     print("Classes learned:", getattr(model, "classes_", "Unknown"))
# except Exception as e:
#     print("⚠️ Failed to load model:", e)
#     model = None

# # -------------------------------
# # 🔹 Feature Extraction
# # -------------------------------
# def extract_features(y, sr):
#     """Extract 13 MFCC mean features from audio input."""
#     try:
#         mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
#         return np.mean(mfccs, axis=1)
#     except Exception as e:
#         print("Feature extraction failed:", e)
#         return np.zeros(13)

# # -------------------------------
# # 🔹 Prediction Function
# # -------------------------------
# def predict_from_features(features):
#     """Predict Parkinson’s using trained model with safe padding."""
#     if model is None:
#         return {"prediction": 0, "score": 0.0, "note": "Model not loaded"}

#     try:
#         expected_len = model.n_features_in_
#         current_len = len(features)

#         # Pad or trim to expected feature count
#         if current_len < expected_len:
#             padded = np.pad(features, (0, expected_len - current_len))
#         elif current_len > expected_len:
#             padded = features[:expected_len]
#         else:
#             padded = features

#         pred = model.predict([padded])[0]

#         # Safe probability extraction
#         probs = model.predict_proba([padded])[0]
#         if len(probs) > 1:
#             prob = probs[1]
#         else:
#             prob = probs[0]  # only one class in training (safety fallback)

#         print(f"Prediction: {pred}, Score: {prob:.2f}")

#         return {
#             "prediction": int(pred),
#             "score": round(float(prob), 2),
#             "note": "Real model prediction successful",
#         }

#     except Exception as e:
#         print("Prediction error:", e)
#         return {"prediction": 0, "score": 0.0, "note": "Prediction failed"}

# # -------------------------------
# # 🔹 Predict Endpoint
# # -------------------------------
# @app.route("/predict", methods=["POST"])
# def predict():
#     if "audio" not in request.files:
#         return jsonify({"error": "No audio file provided"}), 400

#     file = request.files["audio"]
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     filename = f"recording_{timestamp}.webm"
#     upload_path = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(upload_path)

#     try:
#         # Convert webm → wav
#         temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
#         temp_wav.close()
#         AudioSegment.from_file(upload_path).export(temp_wav.name, format="wav")

#         # Load and preprocess audio
#         y, sr = librosa.load(temp_wav.name, sr=16000)
#         y, _ = librosa.effects.trim(y)
#         if len(y) == 0:
#             raise ValueError("Empty or silent audio")

#         # Extract features
#         features = extract_features(y, sr)

#         # Predict
#         result = predict_from_features(features)

#         # Cleanup
#         os.unlink(temp_wav.name)

#         return jsonify(result), 200

#     except Exception as e:
#         print("Processing error:", e)
#         return jsonify({
#             "prediction": 0,
#             "score": 0.0,
#             "note": f"Error during processing: {str(e)}"
#         }), 200

# # -------------------------------
# # 🔹 Recordings Management
# # -------------------------------
# @app.route("/recordings", methods=["GET"])
# def list_recordings():
#     """List saved recordings"""
#     try:
#         files = os.listdir(UPLOAD_FOLDER)
#         files = [f for f in files if f.endswith(".webm")]
#         urls = [f"http://127.0.0.1:5000/uploads/{f}" for f in files]
#         urls.sort(reverse=True)
#         return jsonify({"recordings": urls}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/uploads/<path:filename>")
# def serve_uploaded_file(filename):
#     """Serve uploaded recordings"""
#     return send_from_directory(UPLOAD_FOLDER, filename)


# @app.route("/delete/<filename>", methods=["DELETE"])
# def delete_file(filename):
#     """Delete uploaded recording"""
#     try:
#         file_path = os.path.join(UPLOAD_FOLDER, filename)
#         if os.path.exists(file_path):
#             os.remove(file_path)
#             return jsonify({"message": f"{filename} deleted"}), 200
#         else:
#             return jsonify({"error": "File not found"}), 404
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # -------------------------------
# # 🔹 Run Server
# # -------------------------------
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
# ============================================================
# app.py — Flask backend for Parkinson’s Voice Detection
# ============================================================

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import tempfile
from datetime import datetime
from pydub import AudioSegment
import librosa
import numpy as np
import joblib

# ------------------------------------------------------------
# 🔹 Setup
# ------------------------------------------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Set ffmpeg path (update if installed elsewhere)
AudioSegment.converter = r"C:\Program Files\ffmpeg\bin\ffmpeg.exe"

# ------------------------------------------------------------
# 🔹 Load Trained Model
# ------------------------------------------------------------
MODEL_PATH = "model.pkl"
model = None
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully.")
    print("Classes learned:", getattr(model, "classes_", "Unknown"))
except Exception as e:
    print("⚠️ Failed to load model:", e)
    model = None


# ------------------------------------------------------------
# 🔹 Feature Extraction Function
# ------------------------------------------------------------
def extract_features(y, sr):
    """Extract 13 MFCC mean features from audio input."""
    try:
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.mean(mfccs, axis=1)
    except Exception as e:
        print("Feature extraction failed:", e)
        return np.zeros(13)


# ------------------------------------------------------------
# 🔹 Safe Model Prediction
# ------------------------------------------------------------
def predict_from_features(features):
    """Run model prediction with padding or trimming as needed."""
    if model is None:
        return {"prediction": 0, "score": 0.0, "note": "Model not loaded"}

    try:
        expected_len = model.n_features_in_
        current_len = len(features)

        # Align feature vector length
        if current_len < expected_len:
            features = np.pad(features, (0, expected_len - current_len))
        elif current_len > expected_len:
            features = features[:expected_len]

        pred = model.predict([features])[0]
        prob = (
            model.predict_proba([features])[0][1]
            if hasattr(model, "predict_proba")
            else 0.5
        )

        print(f"Prediction: {pred}, Score: {prob:.2f}")
        return {
            "prediction": int(pred),
            "score": round(float(prob), 2),
            "note": "Prediction successful",
        }

    except Exception as e:
        print("Prediction error:", e)
        return {"prediction": 0, "score": 0.0, "note": "Prediction failed"}


# ------------------------------------------------------------
# 🔹 /predict Endpoint
# ------------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    """Receive audio file, save it, convert to wav, extract MFCCs, and predict."""
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["audio"]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"recording_{timestamp}.webm"
    upload_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(upload_path)

    print(f"🔊 Saved recording: {upload_path}")

    try:
        # Convert to WAV (temporary)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_wav:
            AudioSegment.from_file(upload_path).export(tmp_wav.name, format="wav")
            temp_path = tmp_wav.name

        # Load and preprocess audio
        y, sr = librosa.load(temp_path, sr=16000)
        y, _ = librosa.effects.trim(y)
        if len(y) == 0:
            raise ValueError("Empty or silent audio")

        # Extract features and predict
        features = extract_features(y, sr)
        result = predict_from_features(features)

        # Clean up
        os.unlink(temp_path)

        return jsonify(result), 200

    except Exception as e:
        print("Processing error:", e)
        return jsonify({
            "prediction": 0,
            "score": 0.0,
            "note": f"Error during processing: {str(e)}"
        }), 200


# ------------------------------------------------------------
# 🔹 /recordings Endpoint
# ------------------------------------------------------------
@app.route("/recordings", methods=["GET"])
def get_recordings():
    """Return list of all uploaded recordings."""
    try:
        files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".webm")]
        files.sort(reverse=True)
        urls = [f"http://127.0.0.1:5000/uploads/{f}" for f in files]
        return jsonify({"recordings": urls}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------------
# 🔹 /uploads/<filename> Endpoint
# ------------------------------------------------------------
@app.route("/uploads/<path:filename>")
def serve_uploaded_file(filename):
    """Serve an uploaded audio file."""
    return send_from_directory(UPLOAD_FOLDER, filename)


# ------------------------------------------------------------
# 🔹 /delete/<filename> Endpoint
# ------------------------------------------------------------
@app.route("/delete/<filename>", methods=["DELETE"])
def delete_recording(filename):
    """Delete a specific uploaded recording."""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({"message": f"{filename} deleted"}), 200
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------------
# 🔹 Health Check Route
# ------------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend running", "model_loaded": model is not None}), 200


# ------------------------------------------------------------
# 🔹 Run Server
# ------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)

