# train_mfcc_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("mfcc_dataset.csv")
X = df.drop(columns=["label"])
y = df["label"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Evaluate
acc = model.score(X_test, y_test)
print(f"✅ Model trained successfully! Accuracy: {acc:.2f}")

# Save
joblib.dump(model, "model.pkl")
print("💾 model.pkl saved (trained on 13 MFCC features)")
