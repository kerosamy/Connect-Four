from src.helper import *
import time

class ConnectFourAIExpectedMinMax:
    ROWS: int
    COLS: int
    EMPTY = 0
    PLAYER = 1
    AI = 2

    def __init__(self, rows, cols):
        self.ROWS = rows
        self.COLS = cols

    def build_tree(self, board, depth, maximizing, target_depth):
        valid_moves = get_valid_moves(board)
        node_board = [row[:] for row in board]

        node = {
            "depth": depth,
            "maximizing": maximizing,
            "type": "decision",
            "board": node_board,
            "score": None,
            "moves": []
        }

        if depth == target_depth or len(valid_moves) == 0:
            node["score"] = evaluate(board)
            return node

        if maximizing:  # AI: probabilistic
            best_score = -1e18
            for col in valid_moves:
                chance_node = self.create_chance_node(board, col, self.AI, depth, False, target_depth)
                node["moves"].append(chance_node)
                best_score = max(best_score, chance_node["score"])
            node["score"] = best_score
        else:  # Player: deterministic
            best_score = 1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.PLAYER)
                if row is not None:
                    child = self.build_tree(board, depth + 1, True, target_depth)
                    child["move"] = col
                    node["moves"].append(child)
                    undo_move(board, col, row)
                    best_score = min(best_score, child["score"])
            node["score"] = best_score

        return node

    def create_chance_node(self, board, col, piece, depth, next_maximizing, target_depth):
        chance_node = {
            "depth": depth + 0.5,
            "type": "chance",
            "move": col,
            "score": 0,
            "outcomes": [],
            "maximizing": next_maximizing,
            "board": [row[:] for row in board]
        }

        outcomes = self.prob_vals(board, col)
        expected_value = 0
        
        for outcome_col, probability in outcomes:
            row = drop_piece(board, outcome_col, piece)
            if row is not None:
                # Recursively build the tree for this outcome
                child = self.build_tree(board, depth + 1, next_maximizing, target_depth)
                undo_move(board, outcome_col, row)
                
                # Add outcome information
                outcome_node = {
                    "column": outcome_col,
                    "probability": probability,
                    "score": child["score"],
                    "child": child,
                    "type": "outcome"
                }
                chance_node["outcomes"].append(outcome_node)
                expected_value += probability * child["score"]

        chance_node["score"] = expected_value
        return chance_node

    def expected_minimax(self, board, depth, maximizing, target_depth, count=0):
        count += 1
        valid_moves = get_valid_moves(board)

        if depth == target_depth or len(valid_moves) == 0:
            return None, evaluate(board), count

        best_col = None

        if maximizing:  
            best_score = -1e18
            for col in valid_moves:
                expected_score, count = self.calc_expected_value(board, col, self.AI, depth, False, target_depth, count)
                if expected_score > best_score:
                    best_score = expected_score
                    best_col = col
            return best_col, best_score, count
        else:  
            best_score = 1e18
            for col in valid_moves:
                row = drop_piece(board, col, self.PLAYER)
                if row is not None:
                    _, score, count = self.expected_minimax(board, depth + 1, True, target_depth, count)
                    undo_move(board, col, row)
                    if score < best_score:
                        best_score = score
                        best_col = col
            return best_col, best_score, count


    def calc_expected_value(self, board, col, piece, depth, next_maximizing, target_depth, count):
        outcomes = self.prob_vals(board, col)
        expected_value = 0
        for outcome_col, probability in outcomes:
            row = drop_piece(board, outcome_col, piece)
            if row is not None:
                _, score, count = self.expected_minimax(board, depth + 1, next_maximizing, target_depth, count)
                undo_move(board, outcome_col, row)
                expected_value += probability * score
        return expected_value, count


    def prob_vals(self, board, col):
        outcomes = []
        valid_moves = get_valid_moves(board)

        if col in valid_moves:
            outcomes.append((col, 0.6))
        left_col = col - 1
        if left_col >= 0 and left_col in valid_moves:
            outcomes.append((left_col, 0.2))
        right_col = col + 1
        if right_col < self.COLS and right_col in valid_moves:
            outcomes.append((right_col, 0.2))

        total_prob = sum(p for _, p in outcomes)
        if total_prob > 0:
            outcomes = [(c, p / total_prob) for c, p in outcomes]
        return outcomes


    def best_move(self, board, depth_k):
        start_time = time.time()
        best_col, score, count = self.expected_minimax(board, 0, True, depth_k)
        end_time = time.time()
        elapsed = end_time - start_time
        return best_col, score, elapsed, count