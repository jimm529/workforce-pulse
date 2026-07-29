export default function KPICards({ summary }) {
  return (
    <div className="cards">
      <div className="card">
        <h3>Total Activities</h3>
        <h2>{summary.activities}</h2>
      </div>

      <div className="card">
        <h3>Total Minutes</h3>
        <h2>{Math.round(summary.total_minutes)}</h2>
      </div>

      <div className="card">
        <h3>Recoverable Hours</h3>
        <h2>{summary.recoverable_hours}</h2>
      </div>

      <div className="card">
        <h3>Recoverable Cost</h3>
        <h2>₹ {Math.round(summary.recoverable_cost)}</h2>
      </div>
    </div>
  );
}