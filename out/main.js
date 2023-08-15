var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Board } from "./board.js";
import { PieceColor } from "./piece.js";
let board_element = document.getElementById("board_div");
if (!board_element) {
    throw new Error("Board element not found");
}
let board = new Board(board_element);
window.board = board;
window.onbeforeunload = () => {
    localStorage.setItem("fen", board.getFEN());
    localStorage.setItem("stateIdx", board.stateIdx.toString());
    localStorage.setItem("states", JSON.stringify(board.states));
    localStorage.setItem("moves", JSON.stringify(board.moves));
    localStorage.setItem("sanMoves", JSON.stringify(board.sanMoves));
    localStorage.setItem("currentPlayer", board.currentPlayer.toString());
};
window.onload = () => {
    let new_fen = localStorage.getItem("fen");
    if (new_fen !== null) {
        window.fen = new_fen;
    }
    else {
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
    if (board.stateIdx !== 0) {
        let from = board.moves[board.stateIdx][0] + board.moves[board.stateIdx][1];
        let to = board.moves[board.stateIdx][2] + board.moves[board.stateIdx][3];
        let from_square = document.getElementById(from);
        let to_square = document.getElementById(to);
        if (from_square !== null && to_square !== null) {
            from_square.classList.add("highlight");
            to_square.classList.add("highlight");
        }
    }
    board.updateMoves();
};
// Add a event listener to the edit button
let edit_button = document.getElementById("edit_button");
if (edit_button) {
    edit_button.addEventListener("click", () => {
        localStorage.setItem("fen", board.getFEN());
        if (board.flipped) {
            board.rotate();
        }
        // Navigate to the edit page
        window.location.href = "/edit.html";
    });
}
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        board.forward();
    }
    else if (event.key === "ArrowRight") {
        board.backward();
    }
});
// Add a event listener to the board to move pieces
board_element.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    let target = event.target;
    if (target.classList.contains("square")) {
        if (!board.firstClick) {
            board.dest = target.id;
        }
    }
    if (target.classList.contains("piece") || target.classList.contains("flipped_piece")) {
        // Check if the piece of the current player
        if (board.firstClick) {
            if (target.classList.contains("white") && board.currentPlayer === PieceColor.Black) {
                return;
            }
            else if (target.classList.contains("black") && board.currentPlayer === PieceColor.White) {
                return;
            }
        }
        else {
            if (target.classList.contains("white") && board.currentPlayer === PieceColor.White) {
                return;
            }
            else if (target.classList.contains("black") && board.currentPlayer === PieceColor.Black) {
                return;
            }
        }
        if (target.parentElement === null) {
            throw new Error("Parent element is null");
        }
        if (board.firstClick) {
            board.orig = target.parentElement.id;
            target.parentElement.classList.add("highlight-current");
            let possible_targets = yield (board.getMoveSquares(board.orig));
            if (possible_targets === null) {
                return;
            }
            for (let i = 0; i < possible_targets.length; i++) {
                let square = document.getElementById(possible_targets[i]);
                if (square !== null) {
                    square.classList.add("highlight-attack");
                }
            }
            board.clickedOnPiece = true;
        }
        else {
            if (board.clickedOnPiece) {
                board.dest = target.parentElement.id;
            }
            else {
                board.resetColors();
                board.orig = target.parentElement.id;
                target.parentElement.classList.add("highlight-current");
                board.clickedOnPiece = true;
                board.dest = null;
                board.firstClick = true;
            }
        }
    }
    if (!board.firstClick && board.clickedOnPiece) {
        if (board.orig === null || board.dest === null || board.orig === undefined || board.dest === undefined) {
            throw new Error("Orig or dest is null");
        }
        // Color the origin and destination squares
        let orig_square = document.getElementById(board.orig);
        let dest_square = document.getElementById(board.dest);
        if (orig_square !== null && dest_square !== null) {
            let possible_targets = yield (board.getMoveSquares(board.orig));
            if (possible_targets && (possible_targets.indexOf(board.dest) > -1)) {
                board.resetColors();
                orig_square.classList.add("highlight");
                dest_square.classList.add("highlight");
                yield (board.movePiece(board.orig, board.dest));
                board.clickedOnPiece = false;
                let state = yield (board.checkState());
                if (state === "checkmate") {
                    alert("Checkmate!");
                }
                else if (state === "stalemate") {
                    alert("Stalemate!");
                }
                else if (state === "check") {
                    let king_sqaure = yield (board.getKingSquare());
                    if (king_sqaure !== null) {
                        let king_square_element = document.getElementById(king_sqaure);
                        if (king_square_element !== null) {
                            king_square_element.classList.add("highlight-check");
                        }
                    }
                }
            }
            else {
                board.orig = null;
                board.dest = null;
                board.resetColors();
                board.firstClick = true;
                return;
            }
        }
        board.orig = null;
        board.dest = null;
    }
    board.firstClick = !board.firstClick;
}));
//# sourceMappingURL=main.js.map