# # ============================================================
# # train_audio_model.py
# # Trains a RandomForest model on real Parkinson’s vs Healthy voice samples
# # using MFCC features extracted from .wav files
# # ============================================================

# import os
# import librosa
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import classification_report, confusion_matrix
# import joblib
# import seaborn as sns
# import matplotlib.pyplot as plt
# from tqdm import tqdm

# # ------------------------------------------------------------
# # 🔹 Paths to dataset
# # ------------------------------------------------------------
# HEALTHY_PATH = r"dataset\healthy"
# PARKINSON_PATH = r"dataset\parkinson"

# # ------------------------------------------------------------
# # 🔹 Extract MFCC features from audio file
# # ------------------------------------------------------------
# def extract_features(file_path):
#     try:
#         y, sr = librosa.load(file_path, sr=16000)
#         y, _ = librosa.effects.trim(y)  # remove silence
#         mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
#         mfccs_mean = np.mean(mfccs, axis=1)
#         return mfccs_mean
#     except Exception as e:
#         print(f"⚠️ Error extracting {file_path}: {e}")
#         return np.zeros(13)

# # ------------------------------------------------------------
# # 🔹 Load all audio samples
# # ------------------------------------------------------------
# def load_dataset():
#     features = []
#     labels = []

#     print("🔍 Loading healthy samples...")
#     for file in tqdm(os.listdir(HEALTHY_PATH)):
#         if file.lower().endswith(".wav"):
#             feat = extract_features(os.path.join(HEALTHY_PATH, file))
#             features.append(feat)
#             labels.append(0)  # Healthy

#     print("🔍 Loading Parkinson samples...")
#     for file in tqdm(os.listdir(PARKINSON_PATH)):
#         if file.lower().endswith(".wav"):
#             feat = extract_features(os.path.join(PARKINSON_PATH, file))
#             features.append(feat)
#             labels.append(1)  # Parkinson

#     features = np.array(features)
#     labels = np.array(labels)
#     print(f"\n✅ Loaded {len(features)} samples "
#           f"({sum(labels)} Parkinson, {len(labels) - sum(labels)} Healthy)")
#     return features, labels

# # ------------------------------------------------------------
# # 🔹 Train Model
# # ------------------------------------------------------------
# def train_model(X, y):
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42, stratify=y
#     )

#     print("\n🚀 Training RandomForest model...")
#     model = RandomForestClassifier(
#         n_estimators=300,
#         random_state=42,
#         class_weight="balanced"
#     )
#     model.fit(X_train, y_train)

#     acc = model.score(X_test, y_test)
#     print(f"\n✅ Model trained successfully! Accuracy: {acc:.2f}")

#     y_pred = model.predict(X_test)
#     print("\nClassification Report:")
#     print(classification_report(y_test, y_pred))

#     cm = confusion_matrix(y_test, y_pred)
#     sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
#     plt.title("Confusion Matrix (MFCC Audio Model)")
#     plt.xlabel("Predicted")
#     plt.ylabel("True")
#     plt.show()

#     joblib.dump(model, "model.pkl")
#     print("\n💾 model.pkl saved successfully.")
#     print("Classes learned:", model.classes_)

# # ------------------------------------------------------------
# # 🔹 Run Everything
# # ------------------------------------------------------------
# if __name__ == "__main__":
#     X, y = load_dataset()
#     train_model(X, y)
# ============================================================
# train_audio_model.py
# Train a Parkinson’s detection model from audio dataset
# ============================================================

import os
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import joblib
from tqdm import tqdm

HEALTHY_PATH = "dataset/healthy"
PARKINSON_PATH = "dataset/parkinson"

# ------------------------------------------------------------
# 🔹 Feature extraction
# ------------------------------------------------------------
def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path, sr=16000)
        y, _ = librosa.effects.trim(y)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.mean(mfccs, axis=1)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return np.zeros(13)

# ------------------------------------------------------------
# 🔹 Dataset loading
# ------------------------------------------------------------
def load_dataset():
    features, labels = [], []

    print("🔍 Loading Healthy Samples...")
    for file in tqdm(os.listdir(HEALTHY_PATH)):
        if file.endswith(".wav"):
            feat = extract_features(os.path.join(HEALTHY_PATH, file))
            features.append(feat)
            labels.append(0)

    print("🔍 Loading Parkinson Samples...")
    for file in tqdm(os.listdir(PARKINSON_PATH)):
        if file.endswith(".wav"):
            feat = extract_features(os.path.join(PARKINSON_PATH, file))
            features.append(feat)
            labels.append(1)

    X = np.array(features)
    y = np.array(labels)

    print(f"\n✅ Loaded {len(X)} samples")
    print(f"Healthy: {len(y) - sum(y)}, Parkinson: {sum(y)}")
    return X, y

# ------------------------------------------------------------
# 🔹 Model training
# ------------------------------------------------------------
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("\n🚀 Training RandomForest model...")
    model = RandomForestClassifier(
        n_estimators=300, random_state=42, class_weight="balanced"
    )
    model.fit(X_train, y_train)

    acc = model.score(X_test, y_test)
    print(f"\n✅ Model trained successfully! Accuracy: {acc:.3f}")

    y_pred = model.predict(X_test)
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred))

    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt="d", cmap="Purples")
    plt.title("Confusion Matrix - Parkinson Detection")
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.show()

    joblib.dump(model, "model.pkl")
    print("\n💾 model.pkl saved successfully!")

# ------------------------------------------------------------
# 🔹 Main
# ------------------------------------------------------------
if __name__ == "__main__":
    X, y = load_dataset()
    train_model(X, y)

