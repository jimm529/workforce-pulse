import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  const downloadPDF = async () => {
  const input = document.body;

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

  const applicationData = Object.entries(data.applications).map(([name, value]) => ({
    name,
    value,
  }));

  const filteredRecords =
    departmentFilter === "All"
      ? data.records
      : data.records.filter((r) => r.department === departmentFilter);

  return (
    <div className="container">
      <h1>🚀 Workforce Pulse Dashboard</h1>
      <button
  onClick={downloadPDF}
  className="export-btn"
>
  Export Dashboard PDF
</button>
      <div className="cards">
  <div className="card">
    <h3>Total Activities</h3>
    <h2>{data.summary.activities}</h2>
  </div>

  <div className="card">
    <h3>Total Minutes</h3>
    <h2>{Math.round(data.summary.total_minutes)}</h2>
  </div>

  <div className="card">
    <h3>Recoverable Hours</h3>
    <h2>{data.summary.recoverable_hours}</h2>
  </div>

  <div className="card">
    <h3>Recoverable Cost</h3>
    <h2>₹ {Math.round(data.summary.recoverable_cost)}</h2>
  </div>
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
  <label>Department: </label>

  <select
    value={departmentFilter}
    onChange={(e) => setDepartmentFilter(e.target.value)}
  >
    <option>All</option>

    {Object.keys(data.department).map((dept) => (
      <option key={dept}>{dept}</option>
    ))}
  </select>
</div>
 <div className="grid">

  <div className="chart">

    <h2>Department Usage</h2>

    <ResponsiveContainer width="100%" height={320}>

      <BarChart data={departmentData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="value">

          {departmentData.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
            />
          ))}

        </Bar>

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

      <tr key={i}>

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

    {data.automation_priority.map((item, index) => (

      <tr key={index}>

        <td>{item.employee}</td>

        <td>{item.task}</td>

        <td>{item.application}</td>

        <td>{item.score}</td>

      </tr>

    ))}

  </tbody>

</table>
    </div>
  );
}