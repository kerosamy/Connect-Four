import React, { useState } from 'react';
import Board from './components/Board';
import DepthCounter from './components/DepthCounter';
import ResetButton from './components/ResetButton';
import Scoreboard from './components/Scoreboard';
import { checkWinner, calculateScoreIncrement } from './utils/helpers';
import './ConnectFour.css';
import TreeModal from './components/TreeModel';

const ROWS = 6;
const COLS = 7;
const PLAYER1 = 1;
const PLAYER2 = 2;

export default function ConnectFour() {
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
  );

  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [fallingPiece, setFallingPiece] = useState(null);
  const [isAITurn, setIsAITurn] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [prevBoard, setPrevBoard] = useState(board);
  const [aiAlgorithm, setAiAlgorithm] = useState("minimax");
  const handleAlgorithmChange = (e) => {
  setAiAlgorithm(e.target.value);
  };


  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [counter, setCounter] = useState(1);

const dropPiece = async (col) => {
  if (winner || fallingPiece || isAITurn) return;
 
  // -------- PLAYER MOVE --------
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      setFallingPiece({ col, targetRow: row, player: currentPlayer });

      setTimeout(async () => {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setFallingPiece(null);

        // Update player's score
        const playerScoreIncrement = calculateScoreIncrement(newBoard, row, col, currentPlayer);
        setScores(prev => ({
          ...prev,
          [currentPlayer === PLAYER1 ? "player1" : "player2"]:
            prev[currentPlayer === PLAYER1 ? "player1" : "player2"] + playerScoreIncrement
        }));

        // Check if player won
        const winCells = checkWinner(newBoard, row, col, currentPlayer);
        if (winCells) {
          setWinningCells(winCells);
          setTimeout(() => setWinningCells([]), 2000);
        }

        // Check for draw
        if (newBoard.every(r => r.every(c => c !== 0))) {
          setWinner("draw");
          return;
        }

        // Switch to AI turn
        setCurrentPlayer(PLAYER2);
        setIsAITurn(true);

        // -------- SAVE BOARD BEFORE AI PLAYS --------
        setPrevBoard(newBoard.map(r => [...r]));

        // -------- AI MOVE --------
        try {
          const response = await fetch("http://localhost:5000/ai-move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: newBoard, depth: counter , algorithm: aiAlgorithm })
          });

          const data = await response.json();
          const aiCol = data.col;
          
          if (aiCol != null) {
            for (let aiRow = ROWS - 1; aiRow >= 0; aiRow--) {
              if (newBoard[aiRow][aiCol] === 0) {
                setFallingPiece({ col: aiCol, targetRow: aiRow, player: PLAYER2 });

                setTimeout(() => {
                  newBoard[aiRow][aiCol] = PLAYER2;
                  setBoard([...newBoard]);
                  setFallingPiece(null);

                  // Update AI's score
                  const aiScoreIncrement = calculateScoreIncrement(newBoard, aiRow, aiCol, PLAYER2);
                  setScores(prev => ({
                    ...prev,
                    player2: prev.player2 + aiScoreIncrement
                  }));

                  // Check if AI won
                  const aiWinCells = checkWinner(newBoard, aiRow, aiCol, PLAYER2);
                  if (aiWinCells) {
                    setWinningCells(aiWinCells);
                    setTimeout(() => setWinningCells([]), 2000);
                  }

                  // Check for draw
                  if (newBoard.every(r => r.every(c => c !== 0))) {
                    setWinner("draw");
                  }

                  // Back to player
                  setIsAITurn(false);
                  setCurrentPlayer(PLAYER1);
                }, 500);

                break;
              }
            }
          } else {
            setIsAITurn(false);
            setCurrentPlayer(PLAYER1);
          }
        } catch (err) {
          console.error("AI move failed", err);
          setIsAITurn(false);
          setCurrentPlayer(PLAYER1);
        }
      }, 500);

      return;
    }
  }
};

  const resetAll = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    setCurrentPlayer(PLAYER1);
    setWinner(null);
    setWinningCells([]);
    setFallingPiece(null);
    setIsAITurn(false);
    setScores({ player1: 0, player2: 0 });
    setCounter(1);
  };

  

const fetchTree = async () => {
  try {
    const response = await fetch('http://localhost:5000/ai-tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: prevBoard, depth: counter , algorithm: aiAlgorithm })
    });
    const data = await response.json();
    setTreeData(data);
    setShowTreeModal(true); // open modal
  } catch (err) {
    console.error('Failed to fetch AI tree', err);
  }
};
  return (
    <div className="connect-four-container">
      {/* Existing components */}
      <label>
      <select value={aiAlgorithm} onChange={handleAlgorithmChange}>
        <option value="minimax">Minimax without alpha-beta pruning</option>
        <option value="alphabeta">Minimax with alpha-beta pruning</option>
        <option value="expected">Expected Minimax</option>
      </select>
    </label>
      <DepthCounter counter={counter} setCounter={setCounter} />
      <Scoreboard scores={scores} />
      <Board
        board={board}
        hoveredCol={hoveredCol}
        setHoveredCol={setHoveredCol}
        dropPiece={dropPiece}
        winner={winner}
        isAITurn={isAITurn}
        winningCells={winningCells}
        fallingPiece={fallingPiece}
      />
      <ResetButton onReset={resetAll} />


      <button onClick={fetchTree}>Draw Tree</button>
      {showTreeModal && (
      <TreeModal tree={treeData} onClose={() => setShowTreeModal(false)} />
      )}

      {isAITurn && <div className="ai-overlay">AI is thinking...</div>}
    </div>
  );
}