var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Piece, PieceColor, PieceType } from "./piece.js";
import { Square } from "./square.js";
import { invoke } from "../node_modules/@tauri-apps/api/index.js";
export class Board {
    constructor(element) {
        this.firstClick = true;
        this.clickedOnPiece = false;
        this.whiteOO = false;
        this.whiteOOO = false;
        this.blackOO = false;
        this.blackOOO = false;
        this.enPassant = '-';
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
        this.stateIdx = 0;
        this.states = [];
        this.sanMoves = [""];
        this.moves = [""];
        this.flipped = false;
        let squares = [];
        // Create squares
        squares = new Array(8);
        for (let i = 0; i < 8; i++) {
            squares[i] = new Array(8);
        }
        for (let i = 7; i >= 0; i--) {
            for (let j = 0; j < 8; j++) {
                let square = new Square(i, j, null, this);
                squares[i][j] = square;
            }
        }
        // Add squares to the board
        for (let i = 7; i >= 0; i--) {
            let row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < 8; j++) {
                let square = squares[i][j].element;
                row.appendChild(square);
            }
            element.appendChild(row);
        }
        this.squares = squares;
        this.element = element;
        this.rows = Array.from(element.querySelectorAll('.row'));
        this.currentPlayer = PieceColor.White;
        this.pieces = [];
        this.element = element;
    }
    startingPosition() {
        let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        this.fromFEN(fen);
        this.stateIdx = 0;
        this.states.push(fen);
        this.moves = [];
        this.moves.push("");
        this.sanMoves = [];
        this.sanMoves.push("");
        this.fullmoveNumber = 1;
        this.halfmoveClock = 0;
        this.updateMoves();
        this.resetColors();
    }
    showDialogBoxForPromotion() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                // Create dialog box
                let dialogBox = document.createElement('div');
                dialogBox.setAttribute('id', 'dialogBox');
                dialogBox.style.display = 'flex';
                dialogBox.style.justifyContent = 'center';
                dialogBox.style.alignItems = 'center';
                dialogBox.style.position = 'fixed';
                dialogBox.style.top = '0';
                dialogBox.style.right = '0';
                dialogBox.style.bottom = '0';
                dialogBox.style.left = '0';
                dialogBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                // Create buttons
                let pieces = ['q', 'r', 'b', 'n'];
                let pieceNames = ['Queen', 'Rook', 'Bishop', 'Knight'];
                for (let i = 0; i < pieces.length; i++) {
                    let button = document.createElement('button');
                    button.textContent = pieceNames[i];
                    button.style.margin = '0 10px';
                    button.onclick = function () {
                        // Remove dialog box
                        document.body.removeChild(dialogBox);
                        // Resolve promise with selected piece
                        resolve(pieces[i]);
                    };
                    dialogBox.appendChild(button);
                }
                // Show dialog box
                document.body.appendChild(dialogBox);
            });
        });
    }
    updateMoves() {
        // Update the board moves list
        let movesList = document.getElementById('move_list');
        if (movesList) {
            movesList.innerHTML = '';
            for (let i = 0; i < this.sanMoves.length; i++) {
                if (i === this.stateIdx) {
                    movesList.innerHTML += '<b><u>' + this.sanMoves[i] + '</u></b>';
                }
                else {
                    movesList.innerHTML += this.sanMoves[i];
                }
            }
        }
        let fenTextArea = document.getElementById('fen_text');
        if (fenTextArea) {
            fenTextArea.innerHTML = this.getFEN();
        }
    }
    movePiece(from, to) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let end_row = parseInt(to[1]);
            let promotion_piece = null;
            try {
                // Check if promotion is needed
                if ((this.currentPlayer === PieceColor.White && end_row === 8 && ((_a = this.getSquare(from).getPiece()) === null || _a === void 0 ? void 0 : _a.type) === PieceType.Pawn) ||
                    (this.currentPlayer === PieceColor.Black && end_row === 1 && ((_b = this.getSquare(from).getPiece()) === null || _b === void 0 ? void 0 : _b.type) === PieceType.Pawn)) {
                    // Show a dialog box to select the promotion piece
                    promotion_piece = yield this.showDialogBoxForPromotion();
                }
                const res1 = yield invoke("get_san_move", { fen: this.getFEN(), from: from, to: to, promotion: promotion_piece, moveNum: this.fullmoveNumber, isWhite: this.currentPlayer == PieceColor.White });
                const res = yield invoke("move_piece", { fen: this.getFEN(), from: from, to: to, promotion: promotion_piece });
                this.fromFEN(res);
                if (this.currentPlayer == PieceColor.Black) {
                    this.fullmoveNumber++;
                }
                if (((_c = this.getSquare(to).getPiece()) === null || _c === void 0 ? void 0 : _c.type) == PieceType.Pawn) {
                    this.halfmoveClock = 0;
                }
                else {
                    this.halfmoveClock++;
                }
                let fen = this.getFEN();
                if (this.stateIdx !== this.states.length - 1) {
                    this.states = this.states.slice(0, this.stateIdx + 1);
                    this.sanMoves = this.sanMoves.slice(0, this.stateIdx + 1);
                    this.moves = this.moves.slice(0, this.stateIdx + 1);
                }
                this.states.push(fen);
                this.sanMoves.push(res1);
                this.moves.push(from + to);
                this.stateIdx++;
                this.updateMoves();
            }
            catch (error) {
                console.error("An error occurred:", error);
            }
        });
    }
    getSquare(coord) {
        let x = coord.charCodeAt(0) - 97;
        let y = parseInt(coord[1]) - 1;
        return this.squares[y][x];
    }
    resetColors() {
        for (let i = 0; i < this.rows.length; i++) {
            let squares = this.rows[i].querySelectorAll('.square');
            for (let j = 0; j < squares.length; j++) {
                squares[j].classList.remove('highlight');
                squares[j].classList.remove('highlight-current');
                squares[j].classList.remove('highlight-attack');
                squares[j].classList.remove('highlight-check');
            }
            if (this.stateIdx > 0) {
                let from_square = document.getElementById(this.moves[this.stateIdx][0] + this.moves[this.stateIdx][1]);
                let to_square = document.getElementById(this.moves[this.stateIdx][2] + this.moves[this.stateIdx][3]);
                if (from_square !== null && to_square !== null) {
                    from_square.classList.add("highlight");
                    to_square.classList.add("highlight");
                }
            }
        }
    }
    getFEN() {
        let fen = '';
        for (let i = 7; i >= 0; i--) {
            let empty = 0;
            for (let j = 0; j < 8; j++) {
                let piece = this.squares[i][j].getPiece();
                if (piece) {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += piece.getFEN();
                }
                else {
                    empty++;
                }
            }
            if (empty > 0) {
                fen += empty;
            }
            if (i > 0) {
                fen += '/';
            }
        }
        fen += ' ' + (this.currentPlayer == PieceColor.White ? 'w' : 'b');
        let castling = '';
        if (this.whiteOO) {
            castling += 'K';
        }
        if (this.whiteOOO) {
            castling += 'Q';
        }
        if (this.blackOO) {
            castling += 'k';
        }
        if (this.blackOOO) {
            castling += 'q';
        }
        if (castling == '') {
            castling = '-';
        }
        fen += ' ' + castling;
        fen += ' ' + this.enPassant;
        fen += ' ' + this.halfmoveClock;
        fen += ' ' + this.fullmoveNumber;
        return fen;
    }
    fromFEN(fen) {
        // Clear the board
        this.pieces = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.squares[i][j].setPiece(null);
            }
        }
        // Split the FEN string into its components
        let [position, currentPlayer, castlingAvailability, enPassantTarget, halfmoveClock, fullmoveNumber] = fen.split(' ');
        // Set the pieces on the board
        let ranks = position.split('/');
        for (let i = 0; i < 8; i++) {
            let file = 0;
            for (let char of ranks[7 - i]) {
                if (isNaN(parseInt(char))) {
                    let color = (char === char.toUpperCase()) ? PieceColor.White : PieceColor.Black;
                    let type = this.charToPieceType(char.toUpperCase());
                    let piece = new Piece(type, color, this.squares[i][file]);
                    this.squares[i][file].setPiece(piece);
                    this.pieces.push(piece);
                    file++;
                }
                else {
                    file += parseInt(char);
                }
            }
        }
        // Set the current player
        this.currentPlayer = (currentPlayer === 'w') ? PieceColor.White : PieceColor.Black;
        // Set the castling availability
        this.whiteOO = castlingAvailability.includes('K');
        this.whiteOOO = castlingAvailability.includes('Q');
        this.blackOO = castlingAvailability.includes('k');
        this.blackOOO = castlingAvailability.includes('q');
        // Set the en passant target
        this.enPassant = (enPassantTarget === '-') ? '-' : enPassantTarget;
    }
    charToPieceType(char) {
        switch (char) {
            case 'P': return PieceType.Pawn;
            case 'N': return PieceType.Knight;
            case 'B': return PieceType.Bishop;
            case 'R': return PieceType.Rook;
            case 'Q': return PieceType.Queen;
            case 'K': return PieceType.King;
            default: throw new Error('Invalid piece type');
        }
    }
    rotate() {
        this.element.classList.toggle('flipped');
        this.flipped = !this.flipped;
        // prevent pieces from rotating
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].element.classList.toggle('piece');
            this.pieces[i].element.classList.toggle('flipped_piece');
        }
    }
    getMoveSquares(square) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield invoke("get_attack_squares", { fen: this.getFEN(), square: square });
                return res;
            }
            catch (error) {
                console.error("An error occurred:", error);
                return [];
            }
        });
    }
    checkState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield invoke("check_board_state", { fen: this.getFEN() });
                return res;
            }
            catch (error) {
                console.error("An error occurred:", error);
                return '';
            }
        });
    }
    getKingSquare() {
        return __awaiter(this, void 0, void 0, function* () {
            let player;
            if (this.currentPlayer == PieceColor.White) {
                player = 'white';
            }
            else {
                player = 'black';
            }
            try {
                const res = yield invoke("get_king_square", { fen: this.getFEN(), color: player });
                return res;
            }
            catch (error) {
                console.error("An error occurred:", error);
                return '';
            }
        });
    }
    forward() {
        if (this.stateIdx > 0) {
            this.stateIdx--;
            this.fromFEN(this.states[this.stateIdx]);
            this.resetColors();
            this.updateMoves();
            this.halfmoveClock--;
            if (this.halfmoveClock < 0) {
                this.halfmoveClock = 0;
            }
            if (this.currentPlayer === PieceColor.White) {
                this.fullmoveNumber--;
            }
        }
    }
    backward() {
        if (this.stateIdx < this.states.length - 1) {
            this.stateIdx++;
            this.fromFEN(this.states[this.stateIdx]);
            this.resetColors();
            this.updateMoves();
            this.halfmoveClock++;
            if (this.halfmoveClock < 0) {
                this.halfmoveClock = 0;
            }
            if (this.currentPlayer === PieceColor.Black) {
                this.fullmoveNumber++;
            }
        }
    }
    isSane() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield invoke("is_board_sane", { fen: this.getFEN() });
            return res;
        });
    }
}
//# sourceMappingURL=board.js.map