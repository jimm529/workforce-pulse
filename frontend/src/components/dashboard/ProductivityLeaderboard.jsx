export default function ProductivityLeaderboard({ leaderboard }) {
  return (
    <div className="card leaderboard-card">
      <h2>🏆 Productivity Leaderboard</h2>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Employee</th>
            <th>Activities</th>
            <th>Minutes</th>
            <th>Repetitive</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((emp, index) => (
            <tr key={emp.employee}>
                 <td className="rank">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </td>

              <td>{emp.employee}</td>
              <td>{emp.activities}</td>
              <td>{emp.minutes}</td>
              <td>{emp.repetitive}</td>
             <td>
               <div className="progress-container">
                 <div
                   className="progress-bar"
                   style={{ width: `${Math.min(emp.score, 100)}%` }}
                 ></div>
              
                 <span className="score-text">
                   {emp.score}
                 </span>
               </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}