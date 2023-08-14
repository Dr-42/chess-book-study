import { Piece, PieceColor, PieceType } from "./piece.js";
import { Square } from "./square.js";
export class Board {
    constructor(element) {
        this.first_click = true;
        this.clicked_on_piece = false;
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
    }
    movePiece(from, to) {
        let x_from = from.charCodeAt(0) - 97;
        let y_from = parseInt(from[1]) - 1;
        let x_to = to.charCodeAt(0) - 97;
        let y_to = parseInt(to[1]) - 1;
        let from_square = this.squares[y_from][x_from];
        let to_square = this.squares[y_to][x_to];
        let piece = from_square.getPiece();
        if (piece) {
            from_square.setPiece(null);
            to_square.setPiece(piece);
            this.current_player = this.current_player == PieceColor.White ? PieceColor.Black : PieceColor.White;
        }
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
        fen += ' ' + (this.current_player == PieceColor.White ? 'w' : 'b') + ' - - 0 1';
        return fen;
    }
}
//# sourceMappingURL=board.js.map