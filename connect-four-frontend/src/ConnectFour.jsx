import React, { useState } from 'react';
import { RotateCcw, Plus, Minus } from 'lucide-react';
import './ConnectFour.css';

const ROWS = 6;
const COLS = 7;
const PLAYER1 = 1;
const PLAYER2 = 2;

export default function ConnectFour() {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [fallingPiece, setFallingPiece] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [counter, setCounter] = useState(0);

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]],   // horizontal
      [[1, 0], [-1, 0]],   // vertical
      [[1, 1], [-1, -1]],  // diagonal /
      [[1, -1], [-1, 1]]   // diagonal \
    ];

    for (let dir of directions) {
      let cells = [[row, col]];

      for (let [dr, dc] of dir) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c]);
          r += dr;
          c += dc;
        }
      }

      if (cells.length >= 4) return cells;
    }

    return null;
  };

  const dropPiece = (col) => {
    if (winner || fallingPiece) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        setFallingPiece({ col, targetRow: row, player: currentPlayer });

        setTimeout(() => {
          const newBoard = board.map(r => [...r]);
          newBoard[row][col] = currentPlayer;
          setBoard(newBoard);
          setFallingPiece(null);

          const winCells = checkWinner(newBoard, row, col, currentPlayer);
          if (winCells) {
            // Update score for the winning player
            setScores(prev => ({
              ...prev,
              [currentPlayer === PLAYER1 ? 'player1' : 'player2']: prev[currentPlayer === PLAYER1 ? 'player1' : 'player2'] + 1
            }));
            
            // Flash the winning cells but don't end the game
            setWinningCells(winCells);
            setTimeout(() => {
              setWinningCells([]);
            }, 2000);
          }
          
          // Only end game when board is full
          if (newBoard.every(r => r.every(c => c !== 0))) {
            setWinner('draw');
          }

          setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1);
        }, 500);
        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    setCurrentPlayer(PLAYER1);
    setWinner(null);
    setWinningCells([]);
    setHoveredCol(null);
    setFallingPiece(null);
  };

  const resetAll = () => {
    resetGame();
    setScores({ player1: 0, player2: 0 });
    setCounter(0);
  };

  const incrementCounter = () => setCounter(prev => prev + 1);
  const decrementCounter = () => setCounter(prev => prev - 1);

  const isWinningCell = (row, col) => winningCells.some(([r, c]) => r === row && c === col);
  const canDropInColumn = (col) => board[0][col] === 0 && !winner;

  return (
    <div className="connect-four-container">
      {/* Counter Box - Top Left */}
      <div className="counter-box">
        <div className="counter-label">Counter</div>
        <div className="counter-value">{counter}</div>
        <div className="counter-buttons">
          <button className="counter-btn" onClick={incrementCounter}>
            <Plus size={20} />
          </button>
          <button className="counter-btn" onClick={decrementCounter}>
            <Minus size={20} />
          </button>
        </div>
      </div>

      {/* Score Board - Top Right */}
      <div className="score-board">
        <div className="score-item">
          <div className="score-player player1"></div>
          <div className="score-label">Player 1</div>
          <div className="score-value">{scores.player1}</div>
        </div>
        <div className="score-divider"></div>
        <div className="score-item">
          <div className="score-player player2"></div>
          <div className="score-label">Player 2</div>
          <div className="score-value">{scores.player2}</div>
        </div>
      </div>

      <div className="game-wrapper">
        <h1 className="title">Connect Four</h1>

        {winner === 'draw' ? (
          <div className="winner">It's a Draw! Board is Full!</div>
        ) : (
          <div className="current-player">
            <span>Current Player:</span>
            <div className={`player-indicator ${currentPlayer === PLAYER1 ? 'player1' : 'player2'}`} />
          </div>
        )}

        <div className="board">
          {Array(COLS).fill(0).map((_, col) => (
            <div key={col} className="column">
              <button
                onClick={() => dropPiece(col)}
                onMouseEnter={() => setHoveredCol(col)}
                onMouseLeave={() => setHoveredCol(null)}
                disabled={!canDropInColumn(col) || fallingPiece}
                className={`drop-button ${canDropInColumn(col) && hoveredCol === col ? 'hovered' : ''}`}
              >
                {hoveredCol === col && canDropInColumn(col) && !fallingPiece && (
                  <div className={`preview ${currentPlayer === PLAYER1 ? 'player1' : 'player2'}`} />
                )}
              </button>

              {Array(ROWS).fill(0).map((_, row) => (
                <div key={row} className="cell">
                  <div className={`piece ${board[row][col] === 0 ? 'empty' : board[row][col] === PLAYER1 ? 'player1' : 'player2'} ${isWinningCell(row, col) ? 'winning-cell' : ''}`} />
                  {fallingPiece && fallingPiece.col === col && fallingPiece.targetRow === row && (
                    <div className={`piece falling-coin ${fallingPiece.player === PLAYER1 ? 'player1' : 'player2'}`} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="button-group">
          <button className="reset-button reset-all" onClick={resetAll}>
            <RotateCcw size={20} /> Reset All
          </button>
        </div>

        <p className="instructions">Connect four pieces vertically, horizontally, or diagonally to win!</p>
      </div>
    </div>
  );
}