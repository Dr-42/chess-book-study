export var PieceType;
(function (PieceType) {
    PieceType[PieceType["Pawn"] = 0] = "Pawn";
    PieceType[PieceType["Rook"] = 1] = "Rook";
    PieceType[PieceType["Knight"] = 2] = "Knight";
    PieceType[PieceType["Bishop"] = 3] = "Bishop";
    PieceType[PieceType["Queen"] = 4] = "Queen";
    PieceType[PieceType["King"] = 5] = "King";
    PieceType[PieceType["None"] = 6] = "None";
})(PieceType || (PieceType = {}));
export var PieceColor;
(function (PieceColor) {
    PieceColor[PieceColor["White"] = 0] = "White";
    PieceColor[PieceColor["Black"] = 1] = "Black";
})(PieceColor || (PieceColor = {}));
class Piece {
    constructor(type, color, square) {
        this.type = type;
        this.color = color;
        this.square = square;
        let element = document.createElement('div');
        if (square.board.flipped) {
            element.classList.add('flipped_piece');
        }
        else {
            element.classList.add('piece');
        }
        if (this.color == PieceColor.White) {
            element.classList.add('white');
        }
        else {
            element.classList.add('black');
        }
        element.style.backgroundImage = `url(${Piece.image})`;
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
    getFEN() {
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
Piece.image = 'src/assets/alpha.png';
export { Piece };
//# sourceMappingURL=piece.js.map