🧠 Machine Learning Prediction Workflow — Efficient CSV Inference

A lightweight end-to-end ML prediction system that performs CSV-based predictions efficiently on low-end hardware (no GPU, i5 CPU). This project contains both frontend and backend in a single repository, enabling full-stack operation and easy deployment.

🚀 Overview

This project demonstrates:

Loading and preprocessing datasets (prediction.csv)

Running predictions using a pre-trained model (model.joblib or .h5)

Serving inference results via an API

Visualizing predictions through a simple React frontend

Optimizing performance for CPU-only environments


It’s ideal for hackathons, academic demos, or lightweight production use.

🏗️ Project Structure

project-root/ ├── frontend/                 → React + Vite user interface │   ├── src/ │   ├── public/ │   └── package.json ├── backend/                  → Node.js + Express API server │   ├── app.js                → Main backend file │   ├── model/                → Folder for trained ML model │   ├── routes/               → API routes │   └── package.json ├── ml/                       → Optional Python helper scripts │   ├── predict.py │   ├── model.joblib │   └── prediction.csv ├── README.md └── .gitignore

⚙️ Installation

1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

2️⃣ Install Dependencies
Backend →
cd backend
npm install

Frontend →
cd ../frontend
npm install

🧩 Running the Application

Start Backend (Node/Express) →
cd backend
npm start
Runs at → http://localhost:5000

Start Frontend (React/Vite) →
cd ../frontend
npm run dev
Open → http://localhost:5173

🧠 Machine Learning Prediction Flow

1. Load Dataset import pandas as pd
df = pd.read_csv('prediction.csv', chunksize=5000)


2. Preprocessing



Normalize numeric data

One-hot encode categoricals

Handle missing values with median imputation

Convert timestamps and ensure proper datatypes


3. Model Loading from joblib import load
model = load('model.joblib')


4. Prediction for chunk in df:
 preds = model.predict(chunk)
 print(preds[:5])


5. Optimization for Low Hardware



Use chunked reading to limit memory usage

Limit CPU threads:
 set OMP_NUM_THREADS=1
 set MKL_NUM_THREADS=1

Avoid retraining locally — use pretrained models for inference only


🖼️ Presentation

Full presentation link →
https://www.canva.com/api/design/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiZXhwaXJ5IjoxNzY1NTUwOTkxNzQyfQ..v4k_lu85ObL6vsbR.jGyevBS3T5yr2OcS6auV4JgexQ_yfDxK6MLA2JmN51BnlgQ67kjyIkVe83iC73KpoCVOJ9Inh0UAznw.ixra0A8mXLuIIPikQvyhdg/edit

Slides include:

Introduction

Dataset overview

Model loading & inference

Optimization for low-end hardware

Performance summary with contact details


🧾 Tech Stack

Frontend → React.js, Vite, Tailwind CSS
Backend → Node.js, Express.js
ML Layer → Python (pandas, numpy, scikit-learn, joblib)
Data → CSV file (prediction.csv)

📈 Key Features

✅ Full-stack single-repo setup (frontend + backend)
✅ Pretrained model inference on CPU
✅ Chunked CSV loading for large files
✅ REST API integration for prediction
✅ Lightweight and resource-efficient
✅ Presentation-ready documentation

🧩 Example Backend Route

// backend/routes/predict.js import express from "express";
import { spawn } from "child_process";
const router = express.Router();
router.post("/predict", (req, res) => {
 const py = spawn("python", ["../ml/predict.py"]);
 py.stdout.on("data", (data) => {
  res.send({ result: data.toString() });
 });
 py.stderr.on("data", (data) => {
  console.error(Error: ${data});
 });
});
export default router;

🧠 Example Python Script (ml/predict.py)

import pandas as pd
from joblib import load
model = load('model.joblib')
data = pd.read_csv('prediction.csv', chunksize=5000)
for chunk in data:
 preds = model.predict(chunk)
 print(preds[:5])

📊 Results Summary

Achieved accurate inference with minimal CPU load

Used chunked reading and limited threads to maintain stability

Eliminated crashes on older laptops (tested on i5 8th gen, 8 GB RAM)


🧭 Future Enhancements

Integrate REST upload for new CSV files

Add GPU-based inference (optional)

Implement caching for frequent predictions

Add Dockerfile for simplified deployment


📞 Contact

👤 Name: Smit Gopani
📧 Email: smitgopani113@gmai.com
📱 Phone: 9327419483
💼 Role: Data Scientist / ML Developer

🪪 License

Open-source under the MIT License


---
