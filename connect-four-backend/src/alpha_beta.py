from src.helper import *

class ConnectFourAIAphaBeta:
    ROWS: int
    COLS: int
    EMPTY = 0
    PLAYER = 1
    AI = 2


    def __init__(self, rows, cols):
        self.ROWS = rows
        self.COLS = cols


    def minimax_tree_board(self, board, depth, maximizing, target_depth, alpha=-1e18, beta=1e18):
        valid_moves = get_valid_moves(board)

        # Copy the board for this node
        node_board = [row[:] for row in board]

        node = {
            "depth": depth,
            "type": "decision",
            "maximizing": maximizing,
            "moves": [],
            "score": None,
            "board": node_board
            
        }

        if depth == target_depth or len(valid_moves) == 0:
            node["score"] = evaluate(board)
            return node

        if maximizing:
            best_score = -1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.AI)
                child = self.minimax_tree_board(board, depth + 1, False, target_depth, alpha, beta)
                child["move"] = col
                node["moves"].append(child)
                undo_move(board, col, row)
                best_score = max(best_score, child["score"])
                alpha = max(alpha, best_score)
                if beta <= alpha:  # prune
                    break
            node["score"] = best_score
            return node
        else:
            best_score = 1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.PLAYER)
                child = self.minimax_tree_board(board, depth + 1, True, target_depth, alpha, beta)
                child["move"] = col
                node["moves"].append(child)
                undo_move(board, col, row)
                best_score = min(best_score, child["score"])
                beta = min(beta, best_score)
                if beta <= alpha:  # prune
                    break
            node["score"] = best_score
            return node


    def minimax(self, board, depth, maximizing, target_depth, alpha=-1e18, beta=1e18):
        valid_moves = get_valid_moves(board)

        if depth == target_depth or len(valid_moves) == 0:
            return None, evaluate(board)

        best_col = None

        if maximizing:
            best_score = -1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.AI)
                _, score = self.minimax(board, depth + 1, False, target_depth, alpha, beta)
                undo_move(board, col, row)
                if score > best_score:
                    best_score = score
                    best_col = col
                alpha = max(alpha, best_score)
                if beta <= alpha:
                    break
            return best_col, best_score
        else:
            best_score = 1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.PLAYER)
                _, score = self.minimax(board, depth + 1, True, target_depth, alpha, beta)
                undo_move(board, col, row)
                if score < best_score:
                    best_score = score
                    best_col = col
                beta = min(beta, best_score)
                if beta <= alpha:
                    break
            return best_col, best_score

    
    
    def best_move(self, board, depth_k):
        return self.minimax(board, 0, True, depth_k)[0]
