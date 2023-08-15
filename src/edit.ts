import { Board } from "./board.js";
import { PieceColor } from "./piece.js";

let board_element = document.getElementById("board_div");

if (!board_element) {
    throw new Error("Board element not found");
}

let board = new Board(board_element);
window.board = board;

window.onload = () => {
    let new_fen = localStorage.getItem("fen");
    if (new_fen !== null) {
        window.fen = new_fen;
    } else {
        window.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    board.fromFEN(window.fen);
    board.states.push(window.fen);
    board.stateIdx = 0;
    let new_stateIdx = localStorage.getItem("stateIdx");
    if (new_stateIdx !== null) {
        board.stateIdx = parseInt(new_stateIdx);
    }
    let new_states = localStorage.getItem("states");
    if (new_states !== null) {
        board.states = JSON.parse(new_states);
    }
    let new_moves = localStorage.getItem("moves");
    if (new_moves !== null) {
        board.moves = JSON.parse(new_moves);
    }
    let new_sanMoves = localStorage.getItem("sanMoves");
    if (new_sanMoves !== null) {
        board.sanMoves = JSON.parse(new_sanMoves);
    }
    let new_currentPlayer = localStorage.getItem("currentPlayer");
    if (new_currentPlayer !== null) {
        board.currentPlayer = parseInt(new_currentPlayer);
    }
};

let play_button = document.getElementById("play_button");
if (play_button) {
    let stIDX = 0;
    play_button.addEventListener("click", () => {
        localStorage.setItem("fen", board.getFEN());
        localStorage.setItem("stateIdx", stIDX.toString());
        localStorage.setItem("states", JSON.stringify([board.getFEN()]));
        localStorage.setItem("moves", JSON.stringify([""]));
        localStorage.setItem("sanMoves", JSON.stringify([""]));
        window.location.href = "index.html";
    });
}

let R_button = document.getElementById("white_rook_button");
if (R_button) {
    R_button.addEventListener("click", () => {
        window.activePiece = "R";
    });
}

let N_button = document.getElementById("white_knight_button");
if (N_button) {
    N_button.addEventListener("click", () => {
        window.activePiece = "N";
    });
}

let B_button = document.getElementById("white_bishop_button");
if (B_button) {
    B_button.addEventListener("click", () => {
        window.activePiece = "B";
    });
}

let Q_button = document.getElementById("white_queen_button");
if (Q_button) {
    Q_button.addEventListener("click", () => {
        window.activePiece = "Q";
    });
}

let K_button = document.getElementById("white_king_button");
if (K_button) {
    K_button.addEventListener("click", () => {
        window.activePiece = "K";
    });
}

let P_button = document.getElementById("white_pawn_button");
if (P_button) {
    P_button.addEventListener("click", () => {
        window.activePiece = "P";
    });
}

let r_button = document.getElementById("black_rook_button");
if (r_button) {
    r_button.addEventListener("click", () => {
        window.activePiece = "r";
    });
}

let n_button = document.getElementById("black_knight_button");
if (n_button) {
    n_button.addEventListener("click", () => {
        window.activePiece = "n";
    });
}

let b_button = document.getElementById("black_bishop_button");
if (b_button) {
    b_button.addEventListener("click", () => {
        window.activePiece = "b";
    });
}

let q_button = document.getElementById("black_queen_button");
if (q_button) {
    q_button.addEventListener("click", () => {
        window.activePiece = "q";
    });
}

let k_button = document.getElementById("black_king_button");
if (k_button) {
    k_button.addEventListener("click", () => {
        window.activePiece = "k";
    });
}

let p_button = document.getElementById("black_pawn_button");
if (p_button) {
    p_button.addEventListener("click", () => {
        window.activePiece = "p";
    });
}

let delete_button = document.getElementById("delete_button");
if (delete_button) {
    delete_button.addEventListener("click", () => {
        window.activePiece = "";
    });
}

let clear_button = document.getElementById("clear_button");
if (clear_button) {
    clear_button.addEventListener("click", () => {
        window.fen = "8/8/8/8/8/8/8/8 w KQkq - 0 1";
        board.fromFEN(window.fen);
        board.states.push(window.fen);
        board.stateIdx = 0;
    });
}

// Add a event listener to the board to move pieces
board_element.addEventListener("click", async (event) => {
});