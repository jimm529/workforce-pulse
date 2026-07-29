import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import DepartmentChart from "./components/charts/DepartmentChart";
import html2canvas from "html2canvas";
import KPICards from "./components/dashboard/KPICards";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "./App.css";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
  "#84CC16",
];

export default function App() {
  const [data, setData] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [applicationFilter, setApplicationFilter] = useState("All");
   const [taskFilter, setTaskFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const downloadPDF = async () => {
  const input = document.querySelector(".container");

  const canvas = await html2canvas(input);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  pdf.save("WorkforcePulseDashboard.pdf");
};
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>Loading Workforce Pulse...</h2>;
  }

  const departmentData = Object.entries(data.department).map(([name, value]) => ({
    name,
    value,
  }));

  const trendData = Object.entries(data.daily_activity).map(
  ([date, value]) => ({
    date,
    value,
  })
);

  const applicationData = Object.entries(data.applications).map(([name, value]) => ({
    name,
    value,
  }));
    const applicationOptions = Object.keys(data.applications);

     const taskOptions = Object.keys(data.tasks);

  const filteredRecords = data.records.filter((r) => {
  const departmentMatch =
    departmentFilter === "All" ||
    r.department === departmentFilter;

  const applicationMatch =
    applicationFilter === "All" ||
    r.app_used === applicationFilter;

  const taskMatch =
    taskFilter === "All" ||
    r.task_category === taskFilter;

  return (
    departmentMatch &&
    applicationMatch &&
    taskMatch
  );
});

  return (
    <div className="container">
      <h1>🚀 Workforce Pulse Dashboard</h1>
      <button
  onClick={downloadPDF}
  className="export-btn"
>
  Export Dashboard PDF
</button>
       <KPICards summary={data.summary} />


<div style={{ marginBottom: 20 }}>
  </div>

<div
  className="card"
  style={{
    marginTop: "20px",
    marginBottom: "20px",
    padding: "20px"
  }}
>
  <h2>📘 KPI Methodology</h2>

  <ul style={{ lineHeight: "30px" }}>
    <li>
      <strong>Recoverable Hours:</strong> Calculated using
      activities marked as repetitive.
    </li>

    <li>
      <strong>Recoverable Cost:</strong> Hourly Rate ×
      Recoverable Hours
    </li>

    <li>
      <strong>Hourly Rate:</strong> Annual Salary ÷
      (12 × 22 × 8)
    </li>

    <li>
      <strong>Automation Priority:</strong>
      +60 Repetitive Task,
      +20 Duration ≥ 60 min,
      +20 Valid Task Category
    </li>
  </ul>
</div>
    <div
  className="card"
  style={{ marginBottom: "25px" }}
>
  <h2>🤖 AI Workforce Assistant</h2>

  {data.ai_insights.map((item, index) => (
    <div
      key={index}
      style={{
        padding: "10px",
        marginBottom: "10px",
        background: "#f7f7f7",
        borderRadius: "8px",
      }}
    >
      {item}
    </div>
  ))}
</div>

<div style={{ marginBottom: 20 }}>
  <div className="quality-card">

  <h2>📊 Data Quality</h2>

  <div className="quality-grid">

  <div>
    <h4>Rows Loaded</h4>
    <p>{data.data_quality?.rows_loaded ?? 0}</p>
  </div>

  <div>
    <h4>Rows Dropped</h4>
    <p>{data.data_quality?.rows_dropped ?? 0}</p>
  </div>

  <div>
    <h4>Rows Fixed</h4>
    <p>{data.data_quality?.rows_fixed ?? 0}</p>
  </div>

  <div>
    <h4>Missing Metadata</h4>
    <p>{data.data_quality?.employees_without_metadata ?? 0}</p>
  </div>

  <div>
    <h4>Unused HR Records</h4>
    <p>{data.data_quality?.metadata_without_activity ?? 0}</p>
  </div>

</div>

</div>
  <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  }}
>

  <div>
    <label>Department</label>
    <br />
    <select
      value={departmentFilter}
      onChange={(e) =>
        setDepartmentFilter(e.target.value)
      }
    >
      <option>All</option>

      {Object.keys(data.department).map((dept) => (
        <option key={dept}>
          {dept}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Application</label>
    <br />
    <select
      value={applicationFilter}
      onChange={(e) =>
        setApplicationFilter(e.target.value)
      }
    >
      <option>All</option>

      {applicationOptions.map((app) => (
        <option key={app}>
          {app}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Task</label>
    <br />
    <select
      value={taskFilter}
      onChange={(e) =>
        setTaskFilter(e.target.value)
      }
    >
      <option>All</option>

      {taskOptions.map((task) => (
        <option key={task}>
          {task}
        </option>
      ))}
    </select>
  </div>

</div>
</div>
 <div className="grid">

   <DepartmentChart data={departmentData} />
   <div className="chart">

  <h2>📈 Daily Activity Trend</h2>

  <ResponsiveContainer width="100%" height={320}>

    <BarChart data={trendData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="date" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="value"
        fill="#4F46E5"
      />

    </BarChart>

  </ResponsiveContainer>

</div>

  <div className="chart">

    <h2>Application Usage</h2>

    <ResponsiveContainer width="100%" height={320}>

      <PieChart>

        <Pie
          data={applicationData}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          label
        >

          {applicationData.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
            />
          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>
 <h2>Employee Activity</h2>

<table>

  <thead>

    <tr>

      <th>ID</th>
      <th>Name</th>
      <th>Department</th>
      <th>Task</th>
      <th>Application</th>
      <th>Duration</th>

    </tr>

  </thead>

  <tbody>

    {filteredRecords.map((r, i) => (

     <tr
  key={i}
  onClick={() => setSelectedEmployee(r)}
  style={{
    cursor: "pointer",
    backgroundColor:
      selectedEmployee?.employee_id === r.employee_id
        ? "#f0f0f0"
        : "transparent"
  }}
>
          
          
        <td>{r.employee_id}</td>

        <td>{r.name || "-"}</td>

        <td>{r.department || "-"}</td>

        <td>{r.task_category}</td>

        <td>{r.app_used}</td>

        <td>{r.duration_minutes} min</td>

      </tr>

    ))}

  </tbody>

</table>
  {selectedEmployee && (
  <div
    className="card"
    style={{
      marginTop: "25px",
      padding: "20px"
    }}
  >
    <h2>👤 Employee Drill-down</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "15px",
      }}
    >
      <p><strong>Employee ID:</strong> {selectedEmployee.employee_id}</p>

      <p><strong>Name:</strong> {selectedEmployee.name || "Unknown"}</p>

      <p><strong>Department:</strong> {selectedEmployee.department || "Unknown"}</p>

      <p><strong>Role:</strong> {selectedEmployee.role || "Unknown"}</p>

      <p><strong>Status:</strong> {selectedEmployee.status || "Unknown"}</p>

      <p><strong>Application:</strong> {selectedEmployee.app_used}</p>

      <p><strong>Task:</strong> {selectedEmployee.task_category}</p>

      <p><strong>Duration:</strong> {selectedEmployee.duration_minutes} min</p>

      <p><strong>Annual Salary:</strong> ₹ {selectedEmployee.annual_salary || "N/A"}</p>

      <p>
        <strong>Repetitive:</strong>{" "}
        {String(selectedEmployee.is_repetitive)}
      </p>
    </div>
  </div>
)}
 <h2>Top Automation Opportunities</h2>

<table>

  <thead>

    <tr>

      <th>Employee</th>

      <th>Task</th>

      <th>Application</th>

      <th>Priority Score</th>

    </tr>

  </thead>

  <tbody>

    {data.automation_priority
  .filter((item) => {
    if (
      applicationFilter !== "All" &&
      item.application !== applicationFilter
    ) {
      return false;
    }

    if (
      taskFilter !== "All" &&
      item.task !== taskFilter
    ) {
      return false;
    }

    return true;
  })
  .map((item, index) => (

      <tr key={index}>

        <td>{item.employee}</td>

        <td>{item.task}</td>

        <td>{item.application}</td>

        <td>{item.score}</td>

      </tr>

    ))}

  </tbody>

</table>
   <h2>🚨 Anomaly Detection</h2>

<table>
  <thead>
    <tr>
      <th>Employee</th>
      <th>Issue</th>
      <th>Value</th>
    </tr>
  </thead>

  <tbody>
    {data.anomalies.length === 0 ? (
      <tr>
        <td colSpan="3" style={{ textAlign: "center" }}>
          ✅ No anomalies detected
        </td>
      </tr>
    ) : (
      data.anomalies.map((item, index) => (
        <tr key={index}>
          <td>{item.employee}</td>
          <td>{item.issue}</td>
          <td>{item.value}</td>
        </tr>
      ))
    )}
  </tbody>
</table>
   
    </div>
  );
}

