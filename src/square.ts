// Import piece.ts
import { Piece } from './piece.js';
import { Board } from './board.js';

export let square_colors = {
    light: '#f0d9b5',
    dark: '#b58863'
}

export class MoveData {
    from: string | null;
    to: string | null;
    constructor(from: string | null, to: string | null) {
        this.from = from;
        this.to = to;
    }
}

export class Square {
    x: number;
    y: number;
    piece: Piece | null;
    board: Board;
    element: HTMLElement;

    constructor(x: number, y: number, piece: Piece | null, board: Board) {
        this.x = x;
        this.y = y;
        this.piece = piece;
        this.board = board;
        let element = document.createElement('div');
        element.classList.add('square');
        let y_letter = String.fromCharCode(97 + y);
        element.id = `${y_letter}${x + 1}`;
        if ((this.x + this.y) % 2 != 0) {
            element.classList.add('dark-square');
        } else {
            element.classList.add('light-square');
        }

        this.element = element;
        if (piece) {
            this.element.appendChild(piece.element);
        }
    }

    setPiece(piece: Piece | null) {
        this.piece = piece;
        if (this.element.childNodes.length != 0 && this.element.childNodes.length != 1) {
            throw new Error('Square element has more than one child');
        }
        if (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        if (piece) {
            this.element.appendChild(piece.element);
        } else {
            this.element.innerHTML = '';
        }
    }

    getPiece() {
        return this.piece;
    }
}