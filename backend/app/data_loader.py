import json
import math
import pandas as pd


def normalize_employee(emp):
    employee_id = (
        emp.get("employee_id")
        or emp.get("EmployeeID")
    )

    department = (
        emp.get("department")
        or emp.get("Dept")
    )

    role = (
        emp.get("role")
        or emp.get("Role")
        or emp.get("meta", {}).get("role")
    )

    name = (
        emp.get("name")
        or emp.get("Name")
    )

    status = (
        emp.get("status")
        or emp.get("Status")
    )

    annual = None

    if emp.get("annual_ctc_inr") is not None:
        annual = emp["annual_ctc_inr"]

    elif emp.get("salary_LPA") is not None:
        annual = float(emp["salary_LPA"]) * 100000

    elif emp.get("hourly_rate_inr") is not None:
        annual = float(emp["hourly_rate_inr"]) * 8 * 22 * 12

    elif (
        emp.get("meta")
        and emp["meta"].get("compensation")
    ):
        annual = emp["meta"]["compensation"].get("annual")

    return {
        "employee_id": employee_id,
        "name": name,
        "department": department,
        "role": role,
        "annual_salary": annual,
        "status": status,
    }


def clean_record(record):
    """
    Convert NaN / NaT into None so FastAPI can serialize JSON.
    """

    cleaned = {}

    for key, value in record.items():

        if pd.isna(value):
            cleaned[key] = None

        elif isinstance(value, float) and math.isnan(value):
            cleaned[key] = None

        else:
            cleaned[key] = value

    return cleaned


def process_files(activity_file, employee_file):

    # ----------------------------
    # Read Files
    # ----------------------------

    activity = pd.read_csv(activity_file)

# Data Quality
    rows_loaded = len(activity)
    before_cleaning = len(activity)
    rows_fixed = 0

    employees_json = json.load(employee_file)
    employees = [
        normalize_employee(emp)
        for emp in employees_json["employees"]
    ]

    employees_df = pd.DataFrame(employees)

    # ----------------------------
    # Clean Employee Data
    # ----------------------------
    old_employee_ids = employees_df["employee_id"].copy()

    employees_df["employee_id"] = (
    employees_df["employee_id"]
    .astype(str)
    .str.strip()
    .str.upper()
)

    rows_fixed += (old_employee_ids != employees_df["employee_id"]).sum()

    employees_df["department"] = (
        employees_df["department"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
        .str.title()
    )

    employees_df["name"] = (
        employees_df["name"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    employees_df["role"] = (
        employees_df["role"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    employees_df["status"] = (
        employees_df["status"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
        .str.lower()
    )

    employees_df = employees_df.drop_duplicates(
        subset="employee_id",
        keep="first"
    )

    # ----------------------------
    # Clean Activity Data
    # ----------------------------

    activity.columns = activity.columns.str.strip()

    activity["employee_id"] = (
        activity["employee_id"]
        .astype(str)
        .str.strip()
        .str.upper()
    )

    old_apps = activity["app_used"].copy()

    activity["app_used"] = (
    activity["app_used"]
    .astype(str)
    .str.strip()
    .str.title()
)

    rows_fixed += (old_apps != activity["app_used"]).sum()

    old_tasks = activity["task_category"].copy()

    activity["task_category"] = (
    activity["task_category"]
    .fillna("Unknown")
    .astype(str)
    .str.strip()
    .str.title()
)

    rows_fixed += (old_tasks != activity["task_category"]).sum()

    if "department" in activity.columns:
        activity["department"] = (
            activity["department"]
            .fillna("")
            .astype(str)
            .str.strip()
            .str.title()
        )

    activity["duration_minutes"] = pd.to_numeric(
        activity["duration_minutes"],
        errors="coerce"
    )

    activity = activity[
        (activity["duration_minutes"] > 0)
        &
        (activity["duration_minutes"] <= 720)
    ]
    rows_dropped = before_cleaning - len(activity)
    activity["timestamp"] = pd.to_datetime(
        activity["timestamp"],
        errors="coerce",
        dayfirst=True
    )

    activity = activity.dropna(subset=["timestamp"])

    # ----------------------------
    # Debug Missing Employees
    # ----------------------------

    missing_ids = sorted(
        set(activity["employee_id"]) -
        set(employees_df["employee_id"])
    )

    if missing_ids:
        print("\nMissing Employee IDs:")
        print(missing_ids)

    # ----------------------------
    # Merge
    # ----------------------------

    joined = activity.merge(
        employees_df,
        on="employee_id",
        how="left",
        suffixes=("_activity", "_employee")
    )
    employees_without_metadata = (
    joined["name"].isna().sum()
)

    metadata_without_activity = len(
     set(employees_df["employee_id"])
     -
     set(activity["employee_id"])
)
    # ----------------------------
    # Use employee data first,
    # otherwise keep CSV values.
    # ----------------------------

    if "department_activity" in joined.columns:
        joined["department"] = (
            joined["department_employee"]
            .fillna(joined["department_activity"])
            .fillna("Unknown")
        )
    else:
        joined["department"] = (
            joined["department_employee"]
            .fillna("Unknown")
        )

    joined["name"] = (
        joined["name"]
        .fillna("Unknown")
    )

    joined["role"] = (
        joined["role"]
        .fillna("Unknown")
    )

    joined["status"] = (
        joined["status"]
        .fillna("Unknown")
    )

    # ----------------------------
    # Format Timestamp
    # ----------------------------

    joined["timestamp"] = (
        joined["timestamp"]
        .dt.strftime("%Y-%m-%d %H:%M:%S")
    )

    # ----------------------------
    # JSON Safe Records
    # ----------------------------

    records = [
        clean_record(record)
        for record in joined.to_dict(orient="records")
    ]

    # ----------------------------
    # Summary
    # ----------------------------

    return {
    "summary": {
        "activities": int(len(activity)),
        "employees": int(len(employees_df)),
        "joined": int(len(joined))
    },

    "data_quality": {
        "rows_loaded": int(rows_loaded),
        "rows_dropped": int(rows_dropped),
        "rows_fixed": int(rows_fixed),
        "employees_without_metadata": int(employees_without_metadata),
        "metadata_without_activity": int(metadata_without_activity)
    },

    "records": records
}