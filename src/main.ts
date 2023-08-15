import { Board } from "./board.js";
import { PieceColor } from "./piece.js";

let board_element = document.getElementById("board_div");

if (!board_element) {
    throw new Error("Board element not found");
}

let board = new Board(board_element);
window.board = board;
board.startingPosition();

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        if (board.state_idx > 0) {
            board.state_idx--;
            board.fromFEN(board.states[board.state_idx]);
            board.reset_square_colors();
            let from = board.moves[board.state_idx][0] + board.moves[board.state_idx][1];
            let to = board.moves[board.state_idx][2] + board.moves[board.state_idx][3];
            let from_square = document.getElementById(from);
            let to_square = document.getElementById(to);
            if (from_square !== null && to_square !== null) {
                from_square.classList.add("highlight");
                to_square.classList.add("highlight");
            }
            board.update_moves();
            board.halfmove_clock--;
            if (board.halfmove_clock < 0) {
                board.halfmove_clock = 0;
            }
            if (board.current_player === PieceColor.White) {
                board.fullmove_number--;
            }
        }
    } else if (event.key === "ArrowRight") {
        if (board.state_idx < board.states.length - 1) {
            board.state_idx++;
            board.fromFEN(board.states[board.state_idx]);
            board.reset_square_colors();
            let from = board.moves[board.state_idx][0] + board.moves[board.state_idx][1];
            let to = board.moves[board.state_idx][2] + board.moves[board.state_idx][3];
            let from_square = document.getElementById(from);
            let to_square = document.getElementById(to);
            if (from_square !== null && to_square !== null) {
                from_square.classList.add("highlight");
                to_square.classList.add("highlight");
            }
            board.update_moves();
            board.halfmove_clock++;
            if (board.halfmove_clock < 0) {
                board.halfmove_clock = 0;
            }
            if (board.current_player === PieceColor.Black) {
                board.fullmove_number++;
            }
        }
    }
});

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
                await (board.movePiece(board.orig, board.dest));
                board.clicked_on_piece = false;
                let state = await (board.check_board_state());
                if (state === "checkmate") {
                    alert("Checkmate!");
                } else if (state === "stalemate") {
                    alert("Stalemate!");
                } else if (state === "check") {
                    let king_sqaure = await (board.get_king_square());
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
                board.reset_square_colors();
                board.first_click = true;
                return;
            }
        }
        board.orig = null;
        board.dest = null;
    }
    board.first_click = !board.first_click;
});