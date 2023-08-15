import { Piece, PieceColor, PieceType } from "./piece.js";
import { Square } from "./square.js";
import { invoke } from "../node_modules/@tauri-apps/api/index.js";

export class Board {
    squares: Square[][];
    pieces: Piece[];
    current_player: PieceColor;
    element: HTMLElement;
    rows: HTMLElement[];
    orig?: string | null;
    dest?: string | null;
    first_click: boolean = true;
    clicked_on_piece: boolean = false;
    white_OO: boolean = false;
    white_OOO: boolean = false;
    black_OO: boolean = false;
    black_OOO: boolean = false;
    white_king_moved: boolean = false;
    black_king_moved: boolean = false;
    white_ks_rook_moved: boolean = false;
    white_qs_rook_moved: boolean = false;
    black_ks_rook_moved: boolean = false;
    black_qs_rook_moved: boolean = false;
    en_passant: string = '-';
    halfmove_clock: number = 0;
    fullmove_number: number = 1;
    state_idx = 0;
    states: string[] = [];

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
        this.current_player = PieceColor.White;
        this.pieces = [];

        this.element = element;
    }

    startingPosition() {
        let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        this.fromFEN(fen);
        this.state_idx = 0;
        this.states.push(fen);
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

    async movePiece(from: string, to: string) {
        let end_row = parseInt(to[1]);
        let promotion_piece: string | null = null;
        try {
            // Check if promotion is needed
            if ((this.current_player === PieceColor.White && end_row === 8) ||
                (this.current_player === PieceColor.Black && end_row === 1)) {
                // Show a dialog box to select the promotion piece
                promotion_piece = await this.showDialogBoxForPromotion();
            }
            const res: string = await invoke("move_piece", { fen: this.get_fen(), from: from, to: to, promotion: promotion_piece });
            if (res == 'illegal') {
                throw new Error('Illegal move');
            }
            this.fromFEN(res);
            if (this.state_idx === this.states.length - 1) {
                this.states.push(res);
                this.state_idx++;
            } else {
                this.states[this.state_idx + 1] = res;
                this.state_idx++;
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }


    getSquare(coord: string) {
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

    async get_attack_squares(square: string) {
        try {
            const res: string[] = await invoke("get_attack_squares", { fen: this.get_fen(), square: square });
            return res;
        } catch (error) {
            console.error("An error occurred:", error);
            return [];
        }
    }

    async check_board_state() {
        try {
            const res: string = await invoke("check_board_state", { fen: this.get_fen() });
            return res;
        } catch (error) {
            console.error("An error occurred:", error);
            return '';
        }
    }

    async get_king_square() {
        let player: string;
        if (this.current_player == PieceColor.White) {
            player = 'white';
        } else {
            player = 'black';
        }
        try {
            const res: string = await invoke("get_king_square", { fen: this.get_fen(), color: player });
            return res;
        } catch (error) {
            console.error("An error occurred:", error);
            return '';
        }
    }
}