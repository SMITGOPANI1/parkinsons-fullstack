# create_mfcc_dataset.py
import os
import pandas as pd
import numpy as np
import librosa
from pydub import AudioSegment

UPLOAD_FOLDER = "uploads"
OUTPUT_FILE = "mfcc_dataset.csv"
AudioSegment.converter = r"C:\Program Files\ffmpeg\bin\ffmpeg.exe"

rows = []

# List all .webm recordings
for fname in os.listdir(UPLOAD_FOLDER):
    if not fname.endswith(".webm"):
        continue

    path = os.path.join(UPLOAD_FOLDER, fname)

    # Convert webm → wav
    wav_path = path.replace(".webm", ".wav")
    AudioSegment.from_file(path).export(wav_path, format="wav")

    # Load wav
    y, sr = librosa.load(wav_path, sr=16000)
    y, _ = librosa.effects.trim(y)

    # Skip empty recordings
    if len(y) == 0:
        continue

    # Extract 13 MFCC mean features
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    features = np.mean(mfcc, axis=1)

    # 🔹 Label manually: 0 = healthy, 1 = parkinson
    # For now, mark everything as healthy (0)
    label = 0

    rows.append([*features, label])

# Save dataset
cols = [f"mfcc_{i+1}" for i in range(13)] + ["label"]
df = pd.DataFrame(rows, columns=cols)
df.to_csv(OUTPUT_FILE, index=False)
print(f"✅ Saved {len(df)} samples to {OUTPUT_FILE}")
