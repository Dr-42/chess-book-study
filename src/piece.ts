import { Square } from "./square";
import { PieceImage } from "./pieceImage";

export enum PieceType {
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    None
}

export enum PieceColor {
    White = 0,
    Black
}

export class Piece {
    type: PieceType;
    color: PieceColor;
    square: Square;
    element: HTMLElement;
    static image: string = 'alpha';

    constructor(type: PieceType, color: PieceColor, square: Square) {
        this.type = type;
        this.color = color;
        this.square = square;
        let element = document.createElement('div');
        if (square.board.flipped) {
            element.classList.add('flipped_piece');
        } else {
            element.classList.add('piece');
        }
        if (this.color == PieceColor.White) {
            element.classList.add('white');
        } else {
            element.classList.add('black');
        }
        let image = '';
        switch (Piece.image) {
            case 'alpha':
                image = PieceImage.alpha;
                break;
            case 'california':
                image = PieceImage.california;
                break;
            case 'cburnette':
                image = PieceImage.cburnette;
                break;
            case 'chess7':
                image = PieceImage.chess7;
                break;
            case 'chessnut':
                image = PieceImage.chessnut;
                break;
            case 'companion':
                image = PieceImage.companion;
                break;
            case 'metal':
                image = PieceImage.metal;
                break;
            case 'riohacha':
                image = PieceImage.riohacha;
                break;
            case 'shapes':
                image = PieceImage.shapes;
                break;
        }
        element.style.backgroundImage = `url(${image})`;
        let original_width = 128 * 6;
        let original_height = 128 * 2;
        let scale = 0.5;
        element.style.backgroundSize = `${original_width * scale}px ${original_height * scale}px`;
        let unit_size = 128 * scale;
        switch (this.type) {
            case PieceType.King:
                element.style.backgroundPositionX = `${0 * unit_size}px`;
                element.style.backgroundPositionY = `${this.color * unit_size}px`;
                break;
            case PieceType.Queen:
                element.style.backgroundPositionX = `${5 * unit_size}px`;
                element.style.backgroundPositionY = `${this.color * unit_size}px`;
                break;
            case PieceType.Bishop:
                element.style.backgroundPositionX = `${4 * unit_size}px`;
                element.style.backgroundPositionY = `${this.color * unit_size}px`;
                break;
            case PieceType.Knight:
                element.style.backgroundPositionX = `${3 * unit_size}px`;
                element.style.backgroundPositionY = `${this.color * unit_size}px`;
                break;
            case PieceType.Rook:
                element.style.backgroundPositionX = `${2 * unit_size}px`;
                element.style.backgroundPositionY = `${this.color * unit_size}px`;
                break;
            case PieceType.Pawn:
                element.style.backgroundPositionX = `${1 * unit_size}px`;
                element.style.backgroundPositionY = `${this.color * unit_size}px`;
                break;
        }
        this.element = element;
        this.square.piece = this;
    }

    getFEN(): string {
        let fen = '';
        switch (this.type) {
            case PieceType.King:
                fen += 'k';
                break;
            case PieceType.Queen:
                fen += 'q';
                break;
            case PieceType.Bishop:
                fen += 'b';
                break;
            case PieceType.Knight:
                fen += 'n';
                break;
            case PieceType.Rook:
                fen += 'r';
                break;
            case PieceType.Pawn:
                fen += 'p';
                break;
        }
        if (this.color == PieceColor.White) {
            fen = fen.toUpperCase();
        }
        return fen;
    }
}
