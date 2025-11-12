# train_model.py
"""
Train a robust RandomForest pipeline on a tabular CSV dataset.
- Place your CSV as 'parkinsons.csv' in the same folder (or change FILENAME)
- The script auto-detects a target column (status/label/target or last column).
- If the target is continuous, it converts to binary using the median.
- Saves a scikit-learn pipeline to 'model.pkl'.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
from pprint import pprint
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# CONFIG
FILENAME = "parkinsons.csv"   # put your new CSV here (or change)
OUT_MODEL = "model.pkl"
RANDOM_STATE = 42
TEST_SIZE = 0.2

def find_target_column(df):
    # Common target names
    candidates = ["status", "label", "target", "y", "class", "diagnosis", "motor_UPDRS", "total_UPDRS"]
    for c in candidates:
        if c in df.columns:
            return c
    # else use last column
    return df.columns[-1]

def is_binary_dtype(series):
    uniq = series.dropna().unique()
    if len(uniq) <= 2 and set(np.unique(uniq)).issubset({0,1, True, False} | set(uniq)):
        return True
    return False

def main():
    if not os.path.exists(FILENAME):
        print(f"ERROR: dataset file '{FILENAME}' not found in {os.getcwd()}")
        sys.exit(1)

    df = pd.read_csv(FILENAME)
    print("Dataset loaded. Shape:", df.shape)
    print("Columns:")
    pprint(list(df.columns))

    target_col = find_target_column(df)
    print("\n> Using target column:", target_col)

    # show head
    print("\nFirst 5 rows:")
    print(df.head().to_string())

    # Separate X and y
    y = df[target_col]
    X = df.drop(columns=[target_col])

    # If there are non-numeric columns in X, drop or encode them (here we drop non-numeric)
    non_numeric = X.select_dtypes(exclude=[np.number]).columns.tolist()
    if non_numeric:
        print("\nWarning: Non-numeric columns found — dropping them:", non_numeric)
        X = X.select_dtypes(include=[np.number])

    # If target is continuous -> convert to binary using median
    if not is_binary_dtype(y):
        print("\nTarget appears continuous. Converting to binary using median threshold.")
        thr = y.median()
        print("Median threshold:", thr)
        y_bin = (y >= thr).astype(int)
        y = y_bin
        print("Label distribution after binarization:\n", pd.Series(y).value_counts())
    else:
        # Ensure numeric 0/1
        y = y.replace({True:1, False:0})
        print("\nLabel distribution:\n", pd.Series(y).value_counts())

    # Check we have at least two classes
    uniq = np.unique(y)
    if len(uniq) < 2:
        print("ERROR: Dataset contains only one class after processing. Cannot train.")
        sys.exit(1)

    # Train/test split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, stratify=y, random_state=RANDOM_STATE
    )

    print(f"\nTrain shape: {X_train.shape}, Test shape: {X_test.shape}")

    # Pipeline: scaler + RandomForest
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(
            n_estimators=200,
            max_depth=None,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            class_weight="balanced"
        ))
    ])

    print("\nTraining RandomForest pipeline (this may take a bit)...")
    pipeline.fit(X_train, y_train)
    print("Training complete.")

    # Evaluation on test set
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else None

    print("\n=== Test set classification report ===")
    print(classification_report(y_test, y_pred))
    print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))
    if y_proba is not None:
        try:
            auc = roc_auc_score(y_test, y_proba)
            print("ROC AUC on test:", auc)
        except Exception:
            pass

    # Cross-validation
    print("\nRunning 5-fold cross-validation (stratified)...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(pipeline, X, y, cv=cv, scoring="accuracy", n_jobs=-1)
    print("CV accuracy scores:", scores)
    print("CV mean accuracy:", scores.mean())

    # Backup old model if exists
    if os.path.exists(OUT_MODEL):
        bak_name = OUT_MODEL.replace(".pkl", f"_bak_{int(os.path.getmtime(OUT_MODEL))}.pkl")
        print(f"\nBacking up old model to {bak_name}")
        os.rename(OUT_MODEL, bak_name)

    # Save new model
    joblib.dump(pipeline, OUT_MODEL)
    print(f"\n✅ Model saved to {OUT_MODEL}")
    print("Pipeline feature count (n_features_in_):", pipeline.named_steps['clf'].n_features_in_ if hasattr(pipeline.named_steps['clf'], "n_features_in_") else "unknown")

if __name__ == "__main__":
    main()
