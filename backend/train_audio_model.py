# train_audio_model.py
"""
Train a RandomForest model using audio samples stored in:
- backend/healthy/
- backend/parkinson/

Each file is assumed to be a .wav voice recording.
Model is saved as audio_model.pkl
"""

import os
import numpy as np
import pandas as pd
import librosa
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HEALTHY_DIR = os.path.join(BASE_DIR, "healthy")
PARKINSON_DIR = os.path.join(BASE_DIR, "parkinson")

def extract_features(file_path):
    """Extract 13 MFCC features from an audio file."""
    try:
        y, sr = librosa.load(file_path, sr=16000)
        y, _ = librosa.effects.trim(y)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.mean(mfcc, axis=1)
    except Exception as e:
        print("Error processing", file_path, ":", e)
        return np.zeros(13)

def build_dataset():
    """Read all .wav files from healthy and parkinson folders."""
    data, labels = [], []
    for folder, label in [(HEALTHY_DIR, 0), (PARKINSON_DIR, 1)]:
        for file in os.listdir(folder):
            if file.lower().endswith(".wav"):
                path = os.path.join(folder, file)
                feats = extract_features(path)
                data.append(feats)
                labels.append(label)
    df = pd.DataFrame(data, columns=[f"mfcc_{i+1}" for i in range(13)])
    df["label"] = labels
    return df

if __name__ == "__main__":
    print("🔹 Building dataset from audio samples...")
    df = build_dataset()
    print("Dataset shape:", df.shape)
    print("Label counts:\n", df['label'].value_counts())

    X = df.drop(columns=["label"])
    y = df["label"]

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    # Create pipeline (Scaler + Random Forest)
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", RandomForestClassifier(
            n_estimators=200, class_weight="balanced", random_state=42))
    ])

    print("🔹 Training model...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"✅ Model trained. Accuracy: {acc:.2f}")
    print("Classification report:\n", classification_report(y_test, y_pred))

    # Save model
    joblib.dump(pipeline, "audio_model.pkl")
    print("✅ Model saved as audio_model.pkl")
