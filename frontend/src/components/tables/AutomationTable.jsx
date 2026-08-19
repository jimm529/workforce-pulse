export default function AutomationTable({ automationPriority }) {
  return (
    <>
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
          {automationPriority.map((item, index) => (
            <tr key={index}>
              <td>{item.employee}</td>
              <td>{item.task}</td>
              <td>{item.application}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}