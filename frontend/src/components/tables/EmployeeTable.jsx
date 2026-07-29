export default function EmployeeTable({
  records,
  selectedEmployee,
  setSelectedEmployee,
}) {
  return (
    <>
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
          {records.map((r, i) => (
            <tr
              key={i}
              onClick={() => setSelectedEmployee(r.employee_id)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedEmployee === r.employee_id
                    ? "#f0f0f0"
                    : "transparent",
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
    </>
  );
}