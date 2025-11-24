from flask import Flask, request, jsonify
from flask_cors import CORS
from src.alpha_beta import  ConnectFourAIAphaBeta  
from src.min_max import ConnectFourAIMinMax
from src.expected import ConnectFourAIExpectedMinMax
from src.helper import *

app = Flask(__name__)
CORS(app)  

ROWS = 6
COLS = 7

ai_minimax = ConnectFourAIMinMax(ROWS, COLS)
ai_alphabeta = ConnectFourAIAphaBeta(ROWS, COLS)
ai_expected = ConnectFourAIExpectedMinMax(ROWS,COLS)

@app.route('/ai-move', methods=['POST'])
def ai_move():
    data = request.get_json()
    board = data.get('board')
    depth = data.get('depth', 3)
    algorithm = data.get("algorithm", "minimax")
    print(algorithm)
    print(board)

    if not board:
        return jsonify({"error": "Board not provided"}), 400

    if algorithm == "minimax":
        best_col , score , time , count = ai_minimax.best_move(board, depth)
    elif algorithm == "alphabeta":
        best_col , score , time , count = ai_alphabeta.best_move(board, depth)
    elif algorithm == "expected":
        best_col , score , time , count = ai_expected.best_move(board, depth)
    else:
        return jsonify({"error": "Unknown algorithm"}), 400
    print(best_col)
    print(score)
    return jsonify({
        "col": best_col,
        "score": score,
        "time":time,
        "count":count
    })

@app.route('/ai-tree', methods=['POST'])
def ai_tree():
    data = request.get_json()
    board = data.get('board')
    depth = data.get('depth', 2)
    algorithm = data.get("algorithm", "minimax")

    if not board:
        return jsonify({"error": "Board not provided"}), 400

    if algorithm == "minimax":
        tree = ai_minimax.minimax_tree_board(board, 0, True, depth)
    elif algorithm == "alphabeta":
        tree = ai_alphabeta.minimax_tree_board(board, 0, True, depth)
    elif algorithm == "expected":
        tree = ai_expected.build_tree(board, 0, True, depth)
    else:
        return jsonify({"error": "Unknown algorithm"}), 400
    print_tree(tree)

    return jsonify(tree)

if __name__ == '__main__':    
    app.run(host='0.0.0.0', port=5000, debug=True)
