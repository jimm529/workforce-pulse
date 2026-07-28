# 🚀 Workforce Pulse

An AI-powered Workforce Productivity Analytics Dashboard built using **FastAPI**, **React**, **Pandas**, and **Recharts**.

The application analyzes employee activity logs, identifies automation opportunities, estimates recoverable work hours and costs, and presents insights through an interactive dashboard.

---

# 📷 Dashboard

> Add screenshots here before submission.

Example:

- Dashboard Overview
- Department Analytics
- Application Usage
- Employee Activity Table
- Automation Opportunities

---

# ✨ Features

## Backend

- FastAPI REST API
- CSV Upload
- Employee JSON Processing
- Data Cleaning
- Data Validation
- Data Merging
- Productivity Analytics
- AI Summary Generation
- Recoverable Hours Calculation
- Recoverable Cost Estimation

---

## Dashboard

- KPI Cards
- Department Analytics
- Application Usage
- Employee Activity
- Automation Priority Ranking
- Department Filter
- AI Insights
- PDF Export
- Responsive Charts

---

# 🛠 Tech Stack

## Backend

- FastAPI
- Python
- Pandas

## Frontend

- React (Vite)
- Axios
- Recharts
- html2canvas
- jsPDF

---

# 📁 Project Structure

```
WorkforcePulse/

│

├── backend/

│   ├── app/

│   │   ├── analytics.py

│   │   ├── data_loader.py

│   │   └── main.py

│

├── frontend/

│   ├── src/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   └── main.jsx

│

├── activity_logs.csv

├── employees.json

└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone <repository-url>

cd WorkforcePulse
```

---

# Backend Setup

Install dependencies

```bash
cd backend

pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn app.main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# API Endpoints

## GET /

Health check

---

## POST /upload

Uploads

- activity_logs.csv
- employees.json

Returns processed analytics.

---

## GET /dashboard

Returns

- Summary
- Department Analytics
- Application Analytics
- Employee Analytics
- Automation Priority
- AI Summary
- Activity Records

---

# Dashboard Metrics

The dashboard displays

- Total Activities
- Total Minutes
- Recoverable Hours
- Recoverable Cost
- Department Usage
- Application Usage
- Employee Activity
- Automation Opportunities
- AI Insights

---

# AI Insights

The backend generates a summary describing

- Productivity trends
- High automation areas
- Recoverable time
- Estimated cost savings

---

# PDF Export

Users can export the dashboard as a PDF report using

- html2canvas
- jsPDF

---

# Future Improvements

- Authentication
- Database Integration
- User Login
- Real-time Analytics
- Dark Mode
- Historical Trends
- Machine Learning Predictions

---

# Author

Jimmy Kumar Parekh

MSc IT Student

Built as an interview assignment using FastAPI and React.