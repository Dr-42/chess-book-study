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
import { Piece, PieceColor } from "./piece.js";
import { appWindow } from "../node_modules/@tauri-apps/api/window";
import { save, open } from "../node_modules/@tauri-apps/api/dialog";
import { fs } from "../node_modules/@tauri-apps/api/index.js";
export function create_play_interface() {
    let board_element = document.getElementById("board_div");
    if (!board_element) {
        throw new Error("Board element not found");
    }
    let board = new Board(board_element);
    window.board = board;
    window.onresize = () => __awaiter(this, void 0, void 0, function* () {
        let scalefact = Math.min(window.innerWidth / 748, window.innerHeight / 533);
        document.body.style.scale = scalefact.toString();
        window.resizeTo(748 * scalefact, 532 * scalefact);
    });
    window.onbeforeunload = () => {
        localStorage.setItem("fen", board.getFEN());
        localStorage.setItem("stateIdx", board.stateIdx.toString());
        localStorage.setItem("states", JSON.stringify(board.states));
        localStorage.setItem("moves", JSON.stringify(board.moves));
        localStorage.setItem("sanMoves", JSON.stringify(board.sanMoves));
        localStorage.setItem("onTop", onTopCheckbox.checked.toString());
        localStorage.setItem("fullMoveNumber", board.fullmoveNumber.toString());
        localStorage.setItem("halfMoveClock", board.halfmoveClock.toString());
    };
    window.onload = () => {
        let onTop = localStorage.getItem("onTop");
        if (onTop !== null) {
            if (onTop === "true") {
                onTopCheckbox.checked = true;
                appWindow.setAlwaysOnTop(true);
            }
            else {
                onTopCheckbox.checked = false;
                appWindow.setAlwaysOnTop(false);
            }
        }
        let pieceTheme = localStorage.getItem("pieceTheme");
        if (pieceTheme !== null) {
            Piece.image = pieceTheme;
        }
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
        let new_fullMoveNumber = localStorage.getItem("fullMoveNumber");
        if (new_fullMoveNumber !== null) {
            board.fullmoveNumber = parseInt(new_fullMoveNumber);
        }
        let new_halfMoveClock = localStorage.getItem("halfMoveClock");
        if (new_halfMoveClock !== null) {
            board.halfmoveClock = parseInt(new_halfMoveClock);
        }
        board.resetColors();
        board.updateMoves();
    };
    let onTopCheckbox = document.getElementById("on_top");
    if (onTopCheckbox !== null) {
        onTopCheckbox.addEventListener("change", () => __awaiter(this, void 0, void 0, function* () {
            if (onTopCheckbox.checked) {
                yield appWindow.setAlwaysOnTop(true);
                localStorage.setItem("onTop", "true");
            }
            else {
                yield appWindow.setAlwaysOnTop(false);
                localStorage.setItem("onTop", "false");
            }
        }));
    }
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
    function create_piece_button(name, menu) {
        let button = document.createElement("button");
        menu.appendChild(button);
        button.style.backgroundImage = `url(src/assets/${name}.png)`;
        button.style.backgroundPositionX = `${3 * 64}px`;
        button.style.backgroundPositionY = `${0 * 64}px`;
        button.style.backgroundSize = `${64 * 6}px ${64 * 2}px`;
        button.style.width = '64px';
        button.style.height = '64px';
        button.style.backgroundColor = 'rgba(28, 28, 28, 0.2)';
        button.addEventListener("click", () => {
            localStorage.setItem("pieceTheme", name);
            Piece.image = name;
            board.fromFEN(board.getFEN());
            menu.remove();
        });
        return button;
    }
    let pieceThemeMenu = document.createElement("div");
    pieceThemeMenu.style.position = "fixed";
    pieceThemeMenu.style.top = "50%";
    pieceThemeMenu.style.left = "50%";
    pieceThemeMenu.style.transform = "translate(-50%, -50%)";
    pieceThemeMenu.style.zIndex = "100";
    pieceThemeMenu.style.height = `${64 * 3}px`;
    pieceThemeMenu.style.width = `${64 * 3}px`;
    let alphaButton = create_piece_button("alpha", pieceThemeMenu);
    let californiaButton = create_piece_button("california", pieceThemeMenu);
    let cburnetteButton = create_piece_button("cburnette", pieceThemeMenu);
    let chess7Button = create_piece_button("chess7", pieceThemeMenu);
    let chessnutButton = create_piece_button("chessnut", pieceThemeMenu);
    let companionButton = create_piece_button("companion", pieceThemeMenu);
    let metalButton = create_piece_button("metal", pieceThemeMenu);
    let riohachaButton = create_piece_button("riohacha", pieceThemeMenu);
    let shapesButton = create_piece_button("shapes", pieceThemeMenu);
    pieceThemeMenu.appendChild(alphaButton);
    pieceThemeMenu.appendChild(californiaButton);
    pieceThemeMenu.appendChild(cburnetteButton);
    pieceThemeMenu.appendChild(chess7Button);
    pieceThemeMenu.appendChild(chessnutButton);
    pieceThemeMenu.appendChild(companionButton);
    pieceThemeMenu.appendChild(metalButton);
    pieceThemeMenu.appendChild(riohachaButton);
    pieceThemeMenu.appendChild(shapesButton);
    let pieceThemeButton = document.getElementById("piece_theme_button");
    if (pieceThemeButton) {
        pieceThemeButton.addEventListener("click", () => {
            document.body.appendChild(pieceThemeMenu);
        });
    }
    let boardThemeButton = document.getElementById("board_theme_button");
    if (boardThemeButton) {
        boardThemeButton.addEventListener("click", () => {
            document.location.href = "/settings.html";
        });
    }
    let saveButton = document.getElementById("save_button");
    if (saveButton) {
        saveButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            //localStorage.setItem("fen", board.getFEN());
            //localStorage.setItem("stateIdx", board.stateIdx.toString());
            //localStorage.setItem("states", JSON.stringify(board.states));
            //localStorage.setItem("moves", JSON.stringify(board.moves));
            //localStorage.setItem("sanMoves", JSON.stringify(board.sanMoves));
            //localStorage.setItem("onTop", onTopCheckbox.checked.toString());
            //localStorage.setItem("fullMoveNumber", board.fullmoveNumber.toString());
            //localStorage.setItem("halfMoveClock", board.halfmoveClock.toString());
            // All this is to be added to the file
            // Save in binary format
            let contents = "fen:" + board.getFEN() + "\n";
            contents += "stateIdx:" + board.stateIdx.toString() + "\n";
            contents += "states:" + JSON.stringify(board.states) + "\n";
            contents += "moves:" + JSON.stringify(board.moves) + "\n";
            contents += "sanMoves:" + JSON.stringify(board.sanMoves) + "\n";
            contents += "onTop:" + onTopCheckbox.checked.toString() + "\n";
            contents += "fullMoveNumber:" + board.fullmoveNumber.toString() + "\n";
            contents += "halfMoveClock:" + board.halfmoveClock.toString() + "\n";
            const fl = yield save({
                defaultPath: "game.cbs",
                filters: [{
                        name: "Chessboard Save",
                        extensions: ["cbs"]
                    }]
            });
            if (fl !== null) {
                yield fs.writeFile({
                    path: fl,
                    contents: contents
                });
            }
        }));
    }
    let loadButton = document.getElementById("load_button");
    if (loadButton) {
        loadButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const fl = yield open({
                filters: [{
                        name: "Chessboard Save",
                        extensions: ["cbs"]
                    }]
            });
            if (Array.isArray(fl)) {
                alert("Please select only one file");
                return;
            }
            else if (fl === null) {
                return;
            }
            else {
                let contents = yield fs.readTextFile(fl);
                let lines = contents.split("\n");
                let fen = lines[0].split(":")[1];
                let stateIdx = parseInt(lines[1].split(":")[1]);
                let states = JSON.parse(lines[2].split(":")[1]);
                let moves = JSON.parse(lines[3].split(":")[1]);
                let sanMoves = JSON.parse(lines[4].split(":")[1]);
                let onTop = lines[5].split(":")[1];
                let fullMoveNumber = parseInt(lines[6].split(":")[1]);
                let halfMoveClock = parseInt(lines[7].split(":")[1]);
                board.fromFEN(fen);
                board.states = states;
                board.stateIdx = stateIdx;
                board.moves = moves;
                board.sanMoves = sanMoves;
                board.fullmoveNumber = fullMoveNumber;
                board.halfmoveClock = halfMoveClock;
                if (onTop === "true") {
                    onTopCheckbox.checked = true;
                    appWindow.setAlwaysOnTop(true);
                }
                else {
                    onTopCheckbox.checked = false;
                    appWindow.setAlwaysOnTop(false);
                }
                board.updateMoves();
                board.resetColors();
            }
        }));
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
    board_element.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
        let target = event.target;
        if (target.classList.contains("square")) {
            if (!board.firstClick) {
                board.dest = target.id;
            }
            else {
                return;
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
                    yield (board.movePiece(board.orig, board.dest));
                    board.resetColors();
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
}
//# sourceMappingURL=play_interface.js.map