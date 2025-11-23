ROWS = 6
COLS = 7
EMPTY = 0
PLAYER = 1
AI = 2

def get_valid_moves(board):
    return [c for c in range(COLS) if board[0][c] == EMPTY]

def drop_piece(board, col, piece):
    for r in reversed(range(ROWS)):
        if board[r][col] == EMPTY:
            board[r][col] = piece
            return r
    return None

def undo_move(board, col, row):
    board[row][col] = 0

def value_of(window):
    score = 0
    
    if window.count(AI) == 4:
        score += 100000
    elif window.count(AI) == 3 and window.count(0) == 1:
        score += 1000
    elif window.count(AI) == 2 and window.count(0) == 2:
        score += 10

    if window.count(PLAYER) == 3 and window.count(0) == 1:
        score -= 10000000
    elif window.count(PLAYER) == 4 :
        score -= 1000000000

    return score

def evaluate(board, ROWS=ROWS, COLS=COLS, AI=AI):
    score = 0


    # Horizontal scoring
    for r in range(ROWS):                                 
        for c in range(COLS - 3):                          
            window = []                                    
            window.append(board[r][c])
            window.append(board[r][c + 1])
            window.append(board[r][c + 2])
            window.append(board[r][c + 3])

            score += value_of(window)

    # Vertical scoring
    for c in range(COLS):                                 
        for r in range(ROWS - 3):                         
            window = []                                    
            window.append(board[r][c])
            window.append(board[r + 1][c])
            window.append(board[r + 2][c])
            window.append(board[r + 3][c])

            score += value_of(window)

    # Diagonal /
    for r in range(ROWS - 3):                              
        for c in range(COLS - 3):                          
            window = []
            window.append(board[r][c])
            window.append(board[r + 1][c + 1])
            window.append(board[r + 2][c + 2])
            window.append(board[r + 3][c + 3])

            score += value_of(window)

    # Diagonals \ 
    for r in range(ROWS - 3):
        for c in range(COLS - 3):
            window = []
            window.append(board[r + 3][c])
            window.append(board[r + 2][c + 1])
            window.append(board[r + 1][c + 2])
            window.append(board[r][c + 3])

            score += value_of(window)
            
    return score


def print_tree(node, indent=0, move_label="ROOT"):
    """Pretty print the minimax tree"""
    prefix = "  " * indent
    
    # Print node info
    player = "AI (MAX)" if node.get("maximizing") else "PLAYER (MIN)"
    print(f"{prefix}[{move_label}] Depth: {node.get('depth')} | {player} | Score: {node.get('score')}")
    
    # Print board if exists
    if "board" in node and indent < 3:
        for row in node["board"]:
            print(f"{prefix}  {row}")
    
    # Handle children
    children = []
    if node["type"] == "decision":
        children = node.get("moves", [])
    elif node["type"] == "chance":
        children = [outcome["child"] for outcome in node.get("outcomes", [])]

    if children:
        print(f"{prefix}  ↓ Possible moves:")
        for i, child in enumerate(children):
            label = f"Col {child.get('move', '?')}"
            if node["type"] == "chance":
                prob = node["outcomes"][i]["probability"]
                label += f" (p={prob})"
            print_tree(child, indent + 1, label)

        if node["type"] == "decision" and node.get("moves"):
            best_move = max(node["moves"], key=lambda x: x["score"] if node.get('maximizing') else -x["score"])
            print(f"{prefix}  Best move at this level: Col {best_move['move']}")
    print()

