# train_model.py — Train Parkinson’s detection model using Telemonitoring dataset
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import joblib

# -------------------------------
# 🔹 Load dataset
# -------------------------------
try:
    data = pd.read_csv("parkinsons.csv")
    print("✅ Dataset loaded successfully!")
except FileNotFoundError:
    print("❌ Error: parkinsons.csv not found. Place it in the backend folder.")
    exit()

print("\nColumns found:", list(data.columns)[:10], "...")
if "motor_UPDRS" not in data.columns:
    print("❌ Error: 'motor_UPDRS' column not found in dataset. Check your file headers.")
    exit()

# -------------------------------
# 🔹 Convert continuous to binary
# -------------------------------
threshold = data["motor_UPDRS"].median()
data["status"] = (data["motor_UPDRS"] > threshold).astype(int)
print(f"\n✅ Converted 'motor_UPDRS' into binary target using threshold = {threshold:.2f}")

print("\nLabel counts:")
print(data["status"].value_counts())

# -------------------------------
# 🔹 Drop unnecessary columns
# -------------------------------
drop_cols = ["subject#", "sex", "motor_UPDRS", "total_UPDRS"]
for col in drop_cols:
    if col in data.columns:
        data = data.drop(columns=[col])

# -------------------------------
# 🔹 Prepare data
# -------------------------------
X = data.drop(columns=["status"])
y = data["status"]

# Split dataset (stratify to keep class balance)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -------------------------------
# 🔹 Train model
# -------------------------------
print("\n🚀 Training RandomForest model...")
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

# -------------------------------
# 🔹 Evaluate model
# -------------------------------
acc = model.score(X_test, y_test)
print(f"\n✅ Model trained successfully! Accuracy: {acc:.2f}")

y_pred = model.predict(X_test)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Confusion Matrix visualization
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("True")
plt.show()

# -------------------------------
# 🔹 Save model
# -------------------------------
joblib.dump(model, "model.pkl")
print("\n💾 model.pkl saved successfully.")
print("Classes learned:", model.classes_)
