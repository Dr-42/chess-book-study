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
        this.first_click = true;
        this.clicked_on_piece = false;
        this.white_OO = false;
        this.white_OOO = false;
        this.black_OO = false;
        this.black_OOO = false;
        this.white_king_moved = false;
        this.black_king_moved = false;
        this.white_ks_rook_moved = false;
        this.white_qs_rook_moved = false;
        this.black_ks_rook_moved = false;
        this.black_qs_rook_moved = false;
        this.en_passant = '-';
        this.halfmove_clock = 0;
        this.fullmove_number = 1;
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
        this.current_player = PieceColor.White;
        this.pieces = [];
        this.element = element;
    }
    startingPosition() {
        this.pieces = [];
        let pieceOrder = [PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen, PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook];
        for (let i = 0; i < 8; i++) {
            let piece = new Piece(pieceOrder[i], PieceColor.White, this.squares[0][i]);
            this.squares[0][i].setPiece(piece);
            this.pieces.push(piece);
            piece = new Piece(PieceType.Pawn, PieceColor.White, this.squares[1][i]);
            this.squares[1][i].setPiece(piece);
            this.pieces.push(piece);
            piece = new Piece(pieceOrder[i], PieceColor.Black, this.squares[7][i]);
            this.squares[7][i].setPiece(piece);
            this.pieces.push(piece);
            piece = new Piece(PieceType.Pawn, PieceColor.Black, this.squares[6][i]);
            this.squares[6][i].setPiece(piece);
            this.pieces.push(piece);
        }
        this.black_OO = true;
        this.black_OOO = true;
        this.white_OO = true;
        this.white_OOO = true;
        this.white_king_moved = false;
        this.black_king_moved = false;
        this.white_ks_rook_moved = false;
        this.white_qs_rook_moved = false;
        this.black_ks_rook_moved = false;
        this.black_qs_rook_moved = false;
        this.en_passant = '-';
        this.halfmove_clock = 0;
        this.fullmove_number = 1;
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
    movePiece(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            let end_row = parseInt(to[1]);
            let promotion_piece = null;
            try {
                // Check if promotion is needed
                if ((this.current_player === PieceColor.White && end_row === 8) ||
                    (this.current_player === PieceColor.Black && end_row === 1)) {
                    // Show a dialog box to select the promotion piece
                    promotion_piece = yield this.showDialogBoxForPromotion();
                }
                const res = yield invoke("move_piece", { fen: this.get_fen(), from: from, to: to, promotion: promotion_piece });
                if (res == 'illegal') {
                    throw new Error('Illegal move');
                }
                this.fromFEN(res);
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
    reset_square_colors() {
        for (let i = 0; i < this.rows.length; i++) {
            let squares = this.rows[i].querySelectorAll('.square');
            for (let j = 0; j < squares.length; j++) {
                squares[j].classList.remove('highlight');
                squares[j].classList.remove('highlight-current');
                squares[j].classList.remove('highlight-attack');
                squares[j].classList.remove('highlight-check');
            }
        }
    }
    get_fen() {
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
                    fen += piece.get_fen();
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
        fen += ' ' + (this.current_player == PieceColor.White ? 'w' : 'b');
        let castling = '';
        if (this.white_OO) {
            castling += 'K';
        }
        if (this.white_OOO) {
            castling += 'Q';
        }
        if (this.black_OO) {
            castling += 'k';
        }
        if (this.black_OOO) {
            castling += 'q';
        }
        if (castling == '') {
            castling = '-';
        }
        fen += ' ' + castling;
        fen += ' ' + this.en_passant;
        fen += ' ' + this.halfmove_clock;
        fen += ' ' + this.fullmove_number;
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
        this.current_player = (currentPlayer === 'w') ? PieceColor.White : PieceColor.Black;
        // Set the castling availability
        this.white_OO = castlingAvailability.includes('K');
        this.white_OOO = castlingAvailability.includes('Q');
        this.black_OO = castlingAvailability.includes('k');
        this.black_OOO = castlingAvailability.includes('q');
        // Set the en passant target
        this.en_passant = (enPassantTarget === '-') ? '-' : enPassantTarget;
        // Set the halfmove clock
        this.halfmove_clock = parseInt(halfmoveClock);
        // Set the fullmove number
        this.fullmove_number = parseInt(fullmoveNumber);
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
    get_attack_squares(square) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield invoke("get_attack_squares", { fen: this.get_fen(), square: square });
                return res;
            }
            catch (error) {
                console.error("An error occurred:", error);
                return [];
            }
        });
    }
    check_board_state() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield invoke("check_board_state", { fen: this.get_fen() });
                return res;
            }
            catch (error) {
                console.error("An error occurred:", error);
                return '';
            }
        });
    }
    get_king_square() {
        return __awaiter(this, void 0, void 0, function* () {
            let player;
            if (this.current_player == PieceColor.White) {
                player = 'white';
            }
            else {
                player = 'black';
            }
            try {
                const res = yield invoke("get_king_square", { fen: this.get_fen(), color: player });
                return res;
            }
            catch (error) {
                console.error("An error occurred:", error);
                return '';
            }
        });
    }
}
//# sourceMappingURL=board.js.map