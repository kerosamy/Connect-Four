// utils/helpers.js - Optimized and Fixed

export function checkWinner(board, row, col, player) {
  const directions = [
    { dr: 0, dc: 1 },   // horizontal
    { dr: 1, dc: 0 },   // vertical
    { dr: 1, dc: 1 },   // diagonal \
    { dr: 1, dc: -1 },  // diagonal /
  ];

  for (const { dr, dc } of directions) {
    const line = [{ row, col }];
    for (let step = 1; step < 4; step++) {
      const r = row + dr * step;
      const c = col + dc * step;
      if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) break;
      if (board[r][c] !== player) break;
      line.push({ row: r, col: c });
    }
    for (let step = 1; step < 4; step++) {
      const r = row - dr * step;
      const c = col - dc * step;
      if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) break;
      if (board[r][c] !== player) break;
      line.push({ row: r, col: c });
    }
    if (line.length >= 4) return line;
  }

  return null;
}

export const canDrop = (board, col, winner, isAITurn) =>
  board[0][col] === 0 && !winner && !isAITurn;

/**
 * Calculate score increment after a move by checking all possible 4-windows
 * that include the newly placed piece
 */
export function calculateScoreIncrement(board, row, col, player) {
  const ROWS = board.length;
  const COLS = board[0].length;
  
  const directions = [
    { dr: 0, dc: 1 },   // horizontal
    { dr: 1, dc: 0 },   // vertical
    { dr: 1, dc: 1 },   // diagonal \
    { dr: 1, dc: -1 },  // diagonal /
  ];

  let newScore = 0;

  for (const { dr, dc } of directions) {
    // Check all possible windows of 4 that include the new piece
    // For each direction, we check positions where the new piece could be
    // at index 0, 1, 2, or 3 in a window of 4
    
    for (let offset = -3; offset <= 0; offset++) {
      // Starting position of the window
      const startR = row + (dr * offset);
      const startC = col + (dc * offset);
      
      // Check if this window of 4 is valid and all are the same player
      let validWindow = true;
      let allPlayer = true;
      
      for (let i = 0; i < 4; i++) {
        const checkR = startR + (dr * i);
        const checkC = startC + (dc * i);
        
        // Check bounds
        if (checkR < 0 || checkR >= ROWS || checkC < 0 || checkC >= COLS) {
          validWindow = false;
          break;
        }
        
        // Check if all cells in window belong to player
        if (board[checkR][checkC] !== player) {
          allPlayer = false;
          break;
        }
      }
      
      // If we found a valid window of 4 consecutive pieces, count it
      if (validWindow && allPlayer) {
        newScore++;
      }
    }
  }

  return newScore;
}