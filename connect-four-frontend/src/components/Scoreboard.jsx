import '../ConnectFour.css';
export default function Scoreboard({ scores }) {
  return (
    <div className="score-board">
      <div className="score-item">
        <div className="score-player player1" />
        <div>Player 1</div>
        <div>{scores.player1}</div>
      </div>

      <div className="score-divider" />

      <div className="score-item">
        <div className="score-player player2" />
        <div>Player 2</div>
        <div>{scores.player2}</div>
      </div>
    </div>
  );
}
