import { Board } from "./board.js";
let okButton = document.getElementById('okButton');
if (okButton) {
    okButton.addEventListener('click', function () {
        const settings = {
            lightSquareColor: document.getElementById('lightSquareColor').value,
            darkSquareColor: document.getElementById('darkSquareColor').value,
            currentSquareHighlightColor: document.getElementById('currentSquareHighlightColor').value,
            possibleMoveToSquareColor: document.getElementById('possibleMoveToSquareColor').value,
            previousMoveHighlightColor: document.getElementById('previousMoveHighlightColor').value,
            fontSize: document.getElementById('fontSize').value
        };
        localStorage.setItem('chess-settings', JSON.stringify(settings));
        window.location.href = 'index.html';
    });
}
let cancelButton = document.getElementById('cancelButton');
if (cancelButton) {
    cancelButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}
let boardDiv = document.getElementById('board_div');
if (boardDiv) {
    let previewBoard = document.createElement('div');
    boardDiv.appendChild(previewBoard);
    let brd = new Board(previewBoard);
    brd.fromFEN('rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6');
    boardDiv.style.height = `${previewBoard.offsetHeight * 0.5}px`;
    boardDiv.style.width = `${previewBoard.offsetWidth * 0.5}px`;
    boardDiv.style.flex = '0 0 auto';
    boardDiv.style.justifyContent = 'center';
    previewBoard.style.width = '200%';
    previewBoard.style.scale = '0.65';
    previewBoard.style.transformOrigin = '28% 0';
    brd.getSquare('a7').element.classList.add('highlight');
    brd.getSquare('a6').element.classList.add('highlight');
    brd.getSquare('c1').element.classList.add('highlight-current');
    brd.getSquare('d2').element.classList.add('highlight-attack');
    brd.getSquare('e3').element.classList.add('highlight-attack');
    brd.getSquare('f4').element.classList.add('highlight-attack');
    brd.getSquare('g5').element.classList.add('highlight-attack');
    brd.getSquare('h6').element.classList.add('highlight-attack');
}
//# sourceMappingURL=settings.js.map