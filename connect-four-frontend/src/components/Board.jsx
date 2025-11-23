import { canDrop } from "../utils/helpers";
import '../ConnectFour.css';

export default function Board({
  board,
  hoveredCol,
  setHoveredCol,
  dropPiece,
  winner,
  isAITurn,
  winningCells,
  fallingPiece,
}) {
  const ROWS = board.length;
  const COLS = board[0].length;

  // Fixed: winningCells contains objects {row, col}, not arrays
  const isWinning = (r, c) =>
    winningCells.some(cell => cell.row === r && cell.col === c);

  return (
    <div className="board">
      {Array(COLS).fill(0).map((_, col) => (
        <div key={col} className="column">

          {/* Drop button */}
          <button
            onClick={() => dropPiece(col)}
            disabled={!canDrop(board, col, winner, isAITurn)}
            onMouseEnter={() => setHoveredCol(col)}
            onMouseLeave={() => setHoveredCol(null)}
            className={`drop-button ${hoveredCol === col ? "hovered" : ""}`}
          />

          {/* Cells */}
          {Array(ROWS).fill(0).map((_, row) => {
            const cellValue = board[row][col];
            const isFall =
              fallingPiece &&
              fallingPiece.col === col &&
              fallingPiece.targetRow === row;

            return (
              <div key={row} className="cell">
                <div className={`piece ${
                  cellValue === 0 ? "empty" :
                  cellValue === 1 ? "player1" :
                  "player2"
                } ${isWinning(row, col) ? "winning-cell" : ""}`} />

                {isFall && (
                  <div className={`piece falling-coin ${
                    fallingPiece.player === 1 ? "player1" : "player2"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}