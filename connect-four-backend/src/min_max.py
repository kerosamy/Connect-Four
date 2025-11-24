from src.helper import *
import time

class ConnectFourAIMinMax:
    ROWS:int
    COLS:int
    EMPTY = 0
    PLAYER = 1
    AI = 2

    def __init__(self , rows , cols):
        self.ROWS = rows
        self.COLS = cols

    def minimax_tree_board(self, board, depth, maximizing, target_depth):
        valid_moves = get_valid_moves(board)

        node_board = [row[:] for row in board]
        node = {
            "depth": depth,
            "maximizing": maximizing,
            "type": "decision",
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
                child = self.minimax_tree_board(board, depth + 1, False, target_depth)
                child["move"] = col
                node["moves"].append(child)
                undo_move(board, col, row)
                best_score = max(best_score, child["score"])
            node["score"] = best_score
            return node
        else:
            best_score = 1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.PLAYER)
                child = self.minimax_tree_board(board, depth + 1, True, target_depth)
                child["move"] = col
                node["moves"].append(child)
                undo_move(board, col, row)
                best_score = min(best_score, child["score"])
            node["score"] = best_score
            return node
  
    def minimax(self, board, depth, maximizing, target_depth, count=0):
        count += 1
        valid_moves = get_valid_moves(board)

        if depth == target_depth or len(valid_moves) == 0:
            return None, evaluate(board), count

        if maximizing:
            best_score = -1e18
            best_col = None
            for col in valid_moves:
                row = drop_piece(board, col, self.AI)
                _, score, count = self.minimax(board, depth + 1, False, target_depth, count)
                undo_move(board, col, row)
                if score > best_score:
                    best_score = score
                    best_col = col
            return best_col, best_score, count
        else:
            best_score = 1e18
            best_col = None
            for col in valid_moves:
                row = drop_piece(board, col, self.PLAYER)
                _, score, count = self.minimax(board, depth + 1, True, target_depth, count)
                undo_move(board, col, row)
                if score < best_score:
                    best_score = score
                    best_col = col
            return best_col, best_score, count


    def best_move(self, board, depth_k):
        start_time = time.time()
        best_col, score, count = self.minimax(board, 0, True, depth_k)
        end_time = time.time()
        elapsed = end_time - start_time
        return best_col, score, elapsed, count
