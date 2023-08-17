import { Board } from "./board.js";

let okButton = document.getElementById('okButton');
if (okButton) {
    okButton.addEventListener('click', function () {
        const settings = {
            lightSquareColor: (document.getElementById('lightSquareColor') as HTMLInputElement).value,
            darkSquareColor: (document.getElementById('darkSquareColor') as HTMLInputElement).value,
            currentSquareHighlightColor: (document.getElementById('currentSquareHighlightColor') as HTMLInputElement).value,
            possibleMoveToSquareColor: (document.getElementById('possibleMoveToSquareColor') as HTMLInputElement).value,
            previousMoveHighlightColor: (document.getElementById('previousMoveHighlightColor') as HTMLInputElement).value,
            fontSize: (document.getElementById('fontSize') as HTMLInputElement).value
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
    previewBoard.style.scale = '0.5';
    previewBoard.style.transformOrigin = '30% 0';
}
