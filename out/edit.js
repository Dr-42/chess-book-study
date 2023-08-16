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
import { PieceColor, PieceType, Piece } from "./piece.js";
let board_element = document.getElementById("board_div");
if (!board_element) {
    throw new Error("Board element not found");
}
let board = new Board(board_element);
window.board = board;
let whiteTurn = document.getElementById("whiteTurn");
if (whiteTurn) {
    whiteTurn.addEventListener("change", () => {
        board.currentPlayer = whiteTurn.checked ? PieceColor.White : PieceColor.Black;
    });
}
let whiteOO = document.getElementById("whiteOO");
if (whiteOO) {
    whiteOO.addEventListener("change", () => {
        board.whiteOO = whiteOO.checked;
    });
}
let whiteOOO = document.getElementById("whiteOOO");
if (whiteOOO) {
    whiteOOO.addEventListener("change", () => {
        board.whiteOOO = whiteOOO.checked;
    });
}
let blackOO = document.getElementById("blackOO");
if (blackOO) {
    blackOO.addEventListener("change", () => {
        board.blackOO = blackOO.checked;
    });
}
let blackOOO = document.getElementById("blackOOO");
if (blackOOO) {
    blackOOO.addEventListener("change", () => {
        board.blackOOO = blackOOO.checked;
    });
}
window.onresize = () => __awaiter(void 0, void 0, void 0, function* () {
    let scalefact = Math.min(window.innerWidth / 748, window.innerHeight / 533);
    document.body.style.scale = scalefact.toString();
    window.resizeTo(748 * scalefact, 532 * scalefact);
});
window.onload = () => {
    let new_fen = localStorage.getItem("fen");
    if (new_fen !== null) {
        window.fen = new_fen;
    }
    else {
        window.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    let pieceTheme = localStorage.getItem("pieceTheme");
    if (pieceTheme !== null) {
        Piece.image = pieceTheme;
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
    whiteOO.checked = board.whiteOO;
    whiteOOO.checked = board.whiteOOO;
    blackOO.checked = board.blackOO;
    blackOOO.checked = board.blackOOO;
    whiteTurn.checked = board.currentPlayer === PieceColor.White;
};
let play_button = document.getElementById("play_button");
if (play_button) {
    let stIDX = 0;
    play_button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        let sane = yield board.isSane();
        if (sane !== 'ok') {
            alert("Board settings illegal\n" + sane);
            console.log(board.getFEN());
            return;
        }
        localStorage.setItem("fen", board.getFEN());
        localStorage.setItem("stateIdx", stIDX.toString());
        localStorage.setItem("states", JSON.stringify([board.getFEN()]));
        localStorage.setItem("moves", JSON.stringify([""]));
        localStorage.setItem("sanMoves", JSON.stringify([""]));
        window.location.href = "index.html";
    }));
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
        whiteOO.checked = false;
        whiteOOO.checked = false;
        blackOO.checked = false;
        blackOOO.checked = false;
        board.whiteOO = false;
        board.whiteOOO = false;
        board.blackOO = false;
        board.blackOOO = false;
        board.stateIdx = 0;
    });
}
let reset_button = document.getElementById("reset_button");
if (reset_button) {
    reset_button.addEventListener("click", () => {
        window.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        board.fromFEN(window.fen);
        board.states.push(window.fen);
        whiteTurn.checked = true;
        whiteOO.checked = true;
        whiteOOO.checked = true;
        blackOO.checked = true;
        blackOOO.checked = true;
        board.whiteOO = true;
        board.whiteOOO = true;
        board.blackOO = true;
        board.blackOOO = true;
        board.currentPlayer = PieceColor.White;
        board.stateIdx = 0;
    });
}
board_element.addEventListener("click", event => {
    var _a;
    let color;
    if (window.activePiece === undefined) {
        alert("No piece selected");
        return;
    }
    if (window.activePiece === window.activePiece.toUpperCase()) {
        color = PieceColor.White;
    }
    else {
        color = PieceColor.Black;
    }
    let pieceType;
    switch (window.activePiece.toLowerCase()) {
        case "r":
            pieceType = PieceType.Rook;
            break;
        case "n":
            pieceType = PieceType.Knight;
            break;
        case "b":
            pieceType = PieceType.Bishop;
            break;
        case "q":
            pieceType = PieceType.Queen;
            break;
        case "k":
            pieceType = PieceType.King;
            break;
        case "p":
            pieceType = PieceType.Pawn;
            break;
        default:
            pieceType = PieceType.None;
    }
    let target = event.target;
    let target_id;
    if (target.classList.contains("square")) {
        target_id = target.id;
    }
    else if ((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains("square")) {
        target_id = target.parentElement.id;
    }
    else {
        return;
    }
    if (target_id) {
        console.log(target_id, pieceType, color);
        let square = board.getSquare(target_id);
        if (pieceType === PieceType.None) {
            square.setPiece(null);
        }
        else {
            let piece = new Piece(pieceType, color, square);
        }
    }
    board.fromFEN(board.getFEN());
});
//# sourceMappingURL=edit.js.map