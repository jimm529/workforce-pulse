from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from app.data_loader import process_files
from app.analytics import generate_dashboard

app = FastAPI(title="Workforce Pulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

joined_records = []
dashboard_data_quality = {}


@app.get("/")
def root():
    return {"message": "Workforce Pulse Backend Running"}


@app.post("/upload")
async def upload_files(
    activity_logs: UploadFile = File(...),
    employees: UploadFile = File(...)
):
    global joined_records , dashboard_data_quality

    result = process_files(
        activity_logs.file,
        employees.file
    )

    joined_records = result["records"]
    dashboard_data_quality = result["data_quality"]
    return {
        "status": "success",
        "summary": result["summary"]
    }


@app.get("/dashboard")
def dashboard():
    return generate_dashboard(
        joined_records,
        dashboard_data_quality
    )