import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import ProductivityLeaderboard from "./components/dashboard/ProductivityLeaderboard";
import Layout from "./components/layout/Layout";
import EmployeeTable from "./components/tables/EmployeeTable";
import DepartmentChart from "./components/charts/DepartmentChart";
import html2canvas from "html2canvas";
import KPICards from "./components/dashboard/KPICards";
import ApplicationChart from "./components/charts/ApplicationChart";
import AutomationTable from "./components/tables/AutomationTable";

import "./App.css";



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
  <Layout>
    <div className="container">

      <button
        onClick={downloadPDF}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          background: "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Export Dashboard PDF
      </button>

      <KPICards summary={data.summary} />
       <ProductivityLeaderboard
        leaderboard={data.leaderboard}
        />
      <div style={{ marginBottom: 20 }}>
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

        <label style={{ marginLeft: 20 }}>Application: </label>

        <select
          value={applicationFilter}
          onChange={(e) => setApplicationFilter(e.target.value)}
        >
          <option>All</option>

          {applicationOptions.map((app) => (
            <option key={app}>{app}</option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Task: </label>

        <select
          value={taskFilter}
          onChange={(e) => setTaskFilter(e.target.value)}
        >
          <option>All</option>

          {taskOptions.map((task) => (
            <option key={task}>{task}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        <DepartmentChart data={departmentData} />

        <ApplicationChart data={applicationData} />
      </div>

      <EmployeeTable
        records={filteredRecords}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />

      <AutomationTable
        automationPriority={data.automation_priority}
      />

    </div>
  </Layout>
);
}

