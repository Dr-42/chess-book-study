import { Board } from "./board.js";
import { PieceColor } from "./piece.js";

let board_element = document.getElementById("board_div");

if (!board_element) {
    throw new Error("Board element not found");
}

let board = new Board(board_element);
window.board = board;
if (window.fen === undefined) {
    window.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
}
board.fromFEN(window.fen);
board.states.push(window.fen);
board.stateIdx = 0;

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        board.forward();
    } else if (event.key === "ArrowRight") {
        board.backward();
    }
});

// Add a event listener to the board to move pieces
board_element.addEventListener("click", async (event) => {
    let target = event.target as HTMLElement;
    if (target.classList.contains("square")) {
        if (!board.firstClick) {
            board.dest = target.id;
        }
    }
    if (target.classList.contains("piece")) {
        // Check if the piece of the current player
        if (board.firstClick) {
            if (target.classList.contains("white") && board.currentPlayer === PieceColor.Black) {
                return;
            } else if (target.classList.contains("black") && board.currentPlayer === PieceColor.White) {
                return;
            }
        } else {
            if (target.classList.contains("white") && board.currentPlayer === PieceColor.White) {
                return;
            } else if (target.classList.contains("black") && board.currentPlayer === PieceColor.Black) {
                return;
            }
        }

        if (target.parentElement === null) {
            throw new Error("Parent element is null");
        }
        if (board.firstClick) {
            board.orig = target.parentElement.id;
            target.parentElement.classList.add("highlight-current");
            let possible_targets = await (board.getMoveSquares(board.orig));
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
        } else {
            if (board.clickedOnPiece) {
                board.dest = target.parentElement.id;
            } else {
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
            let possible_targets = await (board.getMoveSquares(board.orig));
            if (possible_targets && (possible_targets.indexOf(board.dest) > -1)) {
                board.resetColors();
                orig_square.classList.add("highlight");
                dest_square.classList.add("highlight");
                await (board.movePiece(board.orig, board.dest));
                board.clickedOnPiece = false;
                let state = await (board.checkState());
                if (state === "checkmate") {
                    alert("Checkmate!");
                } else if (state === "stalemate") {
                    alert("Stalemate!");
                } else if (state === "check") {
                    let king_sqaure = await (board.getKingSquare());
                    if (king_sqaure !== null) {
                        let king_square_element = document.getElementById(king_sqaure);
                        if (king_square_element !== null) {
                            king_square_element.classList.add("highlight-check");
                        }
                    }
                }
            } else {
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
});