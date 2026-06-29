# Python data-science scripts

These scripts are **separate from the web app**. The Lovable app runs on
Cloudflare Workers (TypeScript) and cannot execute Python. Run these
locally on your machine or in a notebook environment.

## Setup

```bash
cd scripts
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Files

- `academic_predictor_model.py` — pulls student records from a local
  PostgreSQL database, trains an ensemble Random Forest classifier, and
  exports the Chapter 4 metrics (accuracy, classification report,
  confusion matrix PNG, feature-importance PNG).

Before running, update the DB credentials and table name inside
`fetch_data_from_postgres()`.

## Run

```bash
python academic_predictor_model.py
```

Outputs land next to the script:
- `model_performance_report.txt`
- `confusion_matrix.png`
- `feature_importance.png`
