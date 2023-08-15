import { Piece, PieceColor, PieceType } from "./piece.js";
import { Square } from "./square.js";
import { invoke } from "../node_modules/@tauri-apps/api/index.js";

export class Board {
    squares: Square[][];
    pieces: Piece[];
    currentPlayer: PieceColor;
    element: HTMLElement;
    rows: HTMLElement[];
    orig?: string | null;
    dest?: string | null;
    firstClick: boolean = true;
    clickedOnPiece: boolean = false;
    whiteOO: boolean = false;
    whiteOOO: boolean = false;
    blackOO: boolean = false;
    blackOOO: boolean = false;
    enPassant: string = '-';
    halfmoveClock: number = 0;
    fullmoveNumber: number = 1;
    stateIdx = 0;
    states: string[] = [];
    sanMoves: string[] = [""];
    moves: string[] = [""];
    flipped: boolean = false;

    constructor(element: HTMLElement) {
        let squares: Square[][] = [];

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

    async showDialogBoxForPromotion(): Promise<string> {
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
    }

    updateMoves() {
        // Update the board moves list
        let movesList = document.getElementById('move_list');
        if (movesList) {
            movesList.innerHTML = '';
            for (let i = 0; i < this.sanMoves.length; i++) {
                if (i === this.stateIdx) {
                    movesList.innerHTML += '<b><u>' + this.sanMoves[i] + '</u></b>';
                } else {
                    movesList.innerHTML += this.sanMoves[i];
                }
            }
        }
    }


    async movePiece(from: string, to: string) {
        let end_row = parseInt(to[1]);
        let promotion_piece: string | null = null;
        try {
            // Check if promotion is needed
            if ((this.currentPlayer === PieceColor.White && end_row === 8) ||
                (this.currentPlayer === PieceColor.Black && end_row === 1)) {
                // Show a dialog box to select the promotion piece
                promotion_piece = await this.showDialogBoxForPromotion();
            }
            const res1: string = await invoke("get_san_move", { fen: this.getFEN(), from: from, to: to, promotion: promotion_piece, moveNum: this.fullmoveNumber, isWhite: this.currentPlayer == PieceColor.White });
            const res: string = await invoke("move_piece", { fen: this.getFEN(), from: from, to: to, promotion: promotion_piece });
            this.fromFEN(res);
            if (this.currentPlayer == PieceColor.Black) {
                this.fullmoveNumber++;
            }
            if (this.getSquare(from).getPiece()?.type == PieceType.Pawn) {
                this.halfmoveClock = 0;
            } else {
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
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }


    getSquare(coord: string) {
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
                } else {
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
    fromFEN(fen: string) {
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
                } else {
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

    charToPieceType(char: string): PieceType {
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

    async getMoveSquares(square: string) {
        try {
            const res: string[] = await invoke("get_attack_squares", { fen: this.getFEN(), square: square });
            return res;
        } catch (error) {
            console.error("An error occurred:", error);
            return [];
        }
    }

    async checkState() {
        try {
            const res: string = await invoke("check_board_state", { fen: this.getFEN() });
            return res;
        } catch (error) {
            console.error("An error occurred:", error);
            return '';
        }
    }

    async getKingSquare() {
        let player: string;
        if (this.currentPlayer == PieceColor.White) {
            player = 'white';
        } else {
            player = 'black';
        }
        try {
            const res: string = await invoke("get_king_square", { fen: this.getFEN(), color: player });
            return res;
        } catch (error) {
            console.error("An error occurred:", error);
            return '';
        }
    }

    forward() {
        if (this.stateIdx > 0) {
            this.stateIdx--;
            this.fromFEN(this.states[this.stateIdx]);
            this.resetColors();
            let from = this.moves[this.stateIdx][0] + this.moves[this.stateIdx][1];
            let to = this.moves[this.stateIdx][2] + this.moves[this.stateIdx][3];
            let from_square = document.getElementById(from);
            let to_square = document.getElementById(to);
            if (from_square !== null && to_square !== null) {
                from_square.classList.add("highlight");
                to_square.classList.add("highlight");
            }
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
            let from = this.moves[this.stateIdx][0] + this.moves[this.stateIdx][1];
            let to = this.moves[this.stateIdx][2] + this.moves[this.stateIdx][3];
            let from_square = document.getElementById(from);
            let to_square = document.getElementById(to);
            if (from_square !== null && to_square !== null) {
                from_square.classList.add("highlight");
                to_square.classList.add("highlight");
            }
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

    async isSane(): Promise<string> {
        let res: string = await invoke("is_board_sane", { fen: this.getFEN() });
        return res;
    }
}