import { r } from "../node_modules/@tauri-apps/api/clipboard-79413165.js";
import { Board } from "./board.js";
import { PieceColor } from "./piece.js";

let board_element = document.getElementById("board");

if (!board_element) {
    throw new Error("Board element not found");
}

let board = new Board(board_element);
board.startingPosition();

board.movePiece("e2", "e4");
board.movePiece("c7", "c5");
board.movePiece("g1", "f3");
board.movePiece("d7", "d6");
board.movePiece("d2", "d4");
board.movePiece("c5", "d4");

console.log(board.get_fen());

// Add a event listener to the board to move pieces
board_element.addEventListener("click", async (event) => {
    let target = event.target as HTMLElement;
    if (target.classList.contains("square")) {
        if (!board.first_click) {
            board.dest = target.id;
        }
    }
    if (target.classList.contains("piece")) {
        // Check if the piece of the current player
        if (board.first_click) {
            if (target.classList.contains("white") && board.current_player === PieceColor.Black) {
                return;
            } else if (target.classList.contains("black") && board.current_player === PieceColor.White) {
                return;
            }
        } else {
            if (target.classList.contains("white") && board.current_player === PieceColor.White) {
                return;
            } else if (target.classList.contains("black") && board.current_player === PieceColor.Black) {
                return;
            }
        }

        if (target.parentElement === null) {
            throw new Error("Parent element is null");
        }
        if (board.first_click) {
            board.orig = target.parentElement.id;
            target.parentElement.classList.add("highlight-current");
            let possible_targets = await (board.get_attack_squares(board.orig));
            console.log(possible_targets);
            if (possible_targets === null) {
                return;
            }
            for (let i = 0; i < possible_targets.length; i++) {
                let square = document.getElementById(possible_targets[i]);
                if (square !== null) {
                    square.classList.add("highlight-attack");
                }
            }
            board.clicked_on_piece = true;
        } else {
            if (board.clicked_on_piece) {
                board.dest = target.parentElement.id;
            } else {
                board.reset_square_colors();
                board.orig = target.parentElement.id;
                target.parentElement.classList.add("highlight-current");
                board.clicked_on_piece = true;
                board.dest = null;
                board.first_click = true;
            }
        }
    }
    if (!board.first_click && board.clicked_on_piece) {
        if (board.orig === null || board.dest === null || board.orig === undefined || board.dest === undefined) {
            throw new Error("Orig or dest is null");
        }
        // Color the origin and destination squares
        let orig_square = document.getElementById(board.orig);
        let dest_square = document.getElementById(board.dest);
        if (orig_square !== null && dest_square !== null) {
            let possible_targets = await (board.get_attack_squares(board.orig));
            if (possible_targets && (possible_targets.indexOf(board.dest) > -1)) {
                board.reset_square_colors();
                orig_square.classList.add("highlight");
                dest_square.classList.add("highlight");
                board.movePiece(board.orig, board.dest);
                board.clicked_on_piece = false;
            }
        }
        board.orig = null;
        board.dest = null;
        console.log(board.get_fen());
    }
    board.first_click = !board.first_click;
});