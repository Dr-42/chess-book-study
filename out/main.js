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
board.startingPosition();
// Add a event listener to the board to move pieces
board_element.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    let target = event.target;
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
            }
            else if (target.classList.contains("black") && board.current_player === PieceColor.White) {
                return;
            }
        }
        else {
            if (target.classList.contains("white") && board.current_player === PieceColor.White) {
                return;
            }
            else if (target.classList.contains("black") && board.current_player === PieceColor.Black) {
                return;
            }
        }
        if (target.parentElement === null) {
            throw new Error("Parent element is null");
        }
        if (board.first_click) {
            board.orig = target.parentElement.id;
            target.parentElement.classList.add("highlight-current");
            let possible_targets = yield (board.get_attack_squares(board.orig));
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
        }
        else {
            if (board.clicked_on_piece) {
                board.dest = target.parentElement.id;
            }
            else {
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
            let possible_targets = yield (board.get_attack_squares(board.orig));
            if (possible_targets && (possible_targets.indexOf(board.dest) > -1)) {
                board.reset_square_colors();
                orig_square.classList.add("highlight");
                dest_square.classList.add("highlight");
                board.movePiece(board.orig, board.dest);
                board.clicked_on_piece = false;
                let state = yield (board.check_board_state());
                if (state === "checkmate") {
                    alert("Checkmate!");
                }
                else if (state === "stalemate") {
                    alert("Stalemate!");
                }
            }
            else {
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
}));
//# sourceMappingURL=main.js.map