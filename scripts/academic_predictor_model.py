"""
Academic Performance Predictor — Ensemble Random Forest pipeline.

Standalone Python script (run outside the web app) that:
  1. Pulls student records from a local PostgreSQL database.
  2. Trains a Random Forest classifier on the data.
  3. Saves accuracy, classification report, confusion matrix, and
     feature-importance plots for inclusion in a Chapter 4 write-up.

Required packages:
    pip install pandas scikit-learn psycopg2 matplotlib seaborn
"""

import os

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import psycopg2

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


# ----------------------------------------------------------------
# 1. DATABASE CONNECTION & DATA FETCHING
# ----------------------------------------------------------------
def fetch_data_from_postgres():
    print("Connecting to PostgreSQL database...")
    connection = None
    try:
        # Replace these placeholders with your actual local database credentials
        connection = psycopg2.connect(
            host="localhost",
            database="academic_predictor_db",
            user="postgres",
            password="your_password",
            port="5432",
        )

        # Replace 'student_performance_table' with your actual table name
        query = "SELECT * FROM student_performance_table;"

        df = pd.read_sql_query(query, connection)
        print(f"Successfully fetched {df.shape[0]} student records.")
        return df

    except Exception as error:
        print(f"Error connecting to database: {error}")
        return None
    finally:
        if connection is not None:
            connection.close()


# ----------------------------------------------------------------
# 2. MAIN EXECUTION PIPELINE
# ----------------------------------------------------------------
def main():
    # Load data
    df = fetch_data_from_postgres()
    if df is None:
        return

    # --- Data Preprocessing (Adjust column names based on your schema) ---
    # Example target column: 'final_grade_category' (e.g., Fail, Pass, Excellent)
    target_column = "final_grade_category"

    # Drop columns that aren't useful features (like student IDs or names)
    columns_to_drop = [target_column, "student_id", "first_name", "last_name"]
    feature_columns = [col for col in df.columns if col not in columns_to_drop]

    X = df[feature_columns]
    y = df[target_column]

    # Handle categorical variables automatically using one-hot encoding
    X = pd.get_dummies(X, drop_first=True)

    # Split dataset (80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # --- Model Training (Ensemble Random Forest) ---
    print("\nTraining Ensemble Random Forest Model...")
    rf_model = RandomForestClassifier(
        n_estimators=100, random_state=42, class_weight="balanced"
    )
    rf_model.fit(X_train, y_train)

    # Make predictions
    y_pred = rf_model.predict(X_test)

    # ----------------------------------------------------------------
    # 3. GENERATING METRICS FOR CHAPTER 4
    # ----------------------------------------------------------------
    print("\n=================== CHAPTER 4 METRICS ===================")
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Overall Model Accuracy: {accuracy * 100:.2f}%\n")

    print("Classification Report:")
    class_report = classification_report(y_test, y_pred)
    print(class_report)

    # Save text report to file for easy copy-pasting into the document
    output_dir = os.path.dirname(os.path.abspath(__file__))
    report_path = os.path.join(output_dir, "model_performance_report.txt")
    with open(report_path, "w") as f:
        f.write(f"Overall Accuracy: {accuracy * 100:.2f}%\n\n")
        f.write("Classification Report:\n")
        f.write(class_report)
    print(f"-> Saved performance text to '{report_path}'")

    # --- Plot 1: Confusion Matrix ---
    plt.figure(figsize=(8, 6))
    labels = np.unique(y)
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels
    )
    plt.title("Confusion Matrix - Academic Performance Predictor")
    plt.ylabel("True Class")
    plt.xlabel("Predicted Class")
    plt.tight_layout()
    cm_path = os.path.join(output_dir, "confusion_matrix.png")
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"-> Saved plot to '{cm_path}'")

    # --- Plot 2: Feature Importance ---
    importances = rf_model.feature_importances_
    indices = np.argsort(importances)[::-1]

    plt.figure(figsize=(10, 6))
    sns.barplot(
        x=importances[indices][:10],
        y=X.columns[indices][:10],
        palette="viridis",
    )
    plt.title("Top 10 Most Influential Features Predicting Academic Success")
    plt.xlabel("Relative Importance Score")
    plt.ylabel("Student Features")
    plt.tight_layout()
    fi_path = os.path.join(output_dir, "feature_importance.png")
    plt.savefig(fi_path, dpi=300)
    plt.close()
    print(f"-> Saved plot to '{fi_path}'")
    print("=========================================================")


if __name__ == "__main__":
    main()
