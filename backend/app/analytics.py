from collections import defaultdict


def generate_dashboard(records, data_quality=None):

    total_minutes = 0
    repetitive_minutes = 0
    recoverable_cost = 0

    department = defaultdict(float)
    applications = defaultdict(float)
    tasks = defaultdict(float)
    employee = defaultdict(float)

    automation = []

    for r in records:

        duration = float(r.get("duration_minutes") or 0)

        total_minutes += duration

        repetitive = str(r.get("is_repetitive")).lower() in [
            "true",
            "1",
            "yes"
        ]

        if repetitive:
            repetitive_minutes += duration

        department[r.get("department") or "Unknown"] += duration
        applications[r.get("app_used") or "Unknown"] += duration
        tasks[r.get("task_category") or "Unknown"] += duration
        employee[r.get("employee_id") or "Unknown"] += duration

        annual_salary = r.get("annual_salary")

        if annual_salary is not None:
            try:
                annual_salary = float(annual_salary)

                hourly_rate = annual_salary / (12 * 22 * 8)

                recoverable_cost += (
                    hourly_rate * (duration / 60)
                )
            except Exception:
                pass

        score = 0

        if repetitive:
            score += 60

        if duration >= 60:
            score += 20

        if r.get("task_category"):
            score += 20

        automation.append({
            "employee": r.get("employee_id"),
            "name": r.get("name"),
            "task": r.get("task_category"),
            "application": r.get("app_used"),
            "duration": duration,
            "score": score
        })

    automation.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    top_department = (
        max(department, key=department.get)
        if department
        else "Unknown"
    )

    top_application = (
        max(applications, key=applications.get)
        if applications
        else "Unknown"
    )

    top_task = (
        max(tasks, key=tasks.get)
        if tasks
        else "Unknown"
    )

    ai_summary = (
        f"The {top_department} department has the highest workload. "
        f"{top_application} is the most used application. "
        f"The most common task category is {top_task}. "
        f"Estimated recoverable effort is {round(repetitive_minutes / 60, 2)} hours. "
        f"Estimated recoverable cost is ₹{round(recoverable_cost, 2)}."
    )

    return {

        "summary": {
            "activities": len(records),
            "total_minutes": round(total_minutes, 2),
            "recoverable_minutes": round(repetitive_minutes, 2),
            "recoverable_hours": round(repetitive_minutes / 60, 2),
            "recoverable_cost": round(recoverable_cost, 2)
        },

        "department": dict(department),

        "applications": dict(applications),

        "tasks": dict(tasks),

        "employees": dict(employee),

        "automation_priority": automation[:10],

        "ai_summary": ai_summary,

        "records": records[:50],

        "data_quality": data_quality or {}
    }