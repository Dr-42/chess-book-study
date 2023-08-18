import { Board } from "./board.js";
import { appWindow } from "../node_modules/@tauri-apps/api/window";
import { save, open } from "../node_modules/@tauri-apps/api/dialog.js";
import { dialog, fs } from "../node_modules/@tauri-apps/api/index.js";

window.onresize = async () => {
    let scalefact = Math.min(window.innerWidth / 748, window.innerHeight / 533);
    document.body.style.scale = scalefact.toString();
    window.resizeTo(748 * scalefact, 532 * scalefact);
    localStorage.setItem('scalefact', scalefact.toString());
}

window.onload = () => {
    if (localStorage.getItem("scalefact") !== null) {
        let scalefact = parseFloat(localStorage.getItem("scalefact") as string);
        document.body.style.scale = scalefact.toString();
    }
    loadSettings();
    updateTheme();
}

appWindow.onCloseRequested(() => {
    localStorage.removeItem("scalefact");
    appWindow.close();
});

class Settings {
    lightSquareColor: string = `${rgbToHex('rgb(205, 195, 205)')}`;
    darkSquareColor: string = `${rgbToHex('rgb(105, 95, 105)')}`;
    currentSquareHighlightColor: string = `${rgbToHex('rgb(100, 255, 0)')}`;
    possibleMoveToSquareColor: string = `${rgbToHex('rgb(21, 103, 80)')}`;
    previousMoveHighlightColor: string = `${rgbToHex('rgb(105, 105, 235)')}`;
    fontSize: string = '20';
}

let settings = new Settings();

function updateSettings() {
    let lightSquareColor = (document.getElementById('lightSquareColor') as HTMLInputElement).value;
    let darkSquareColor = (document.getElementById('darkSquareColor') as HTMLInputElement).value;
    let currentSquareHighlightColor = (document.getElementById('currentSquareHighlightColor') as HTMLInputElement).value;
    let possibleMoveToSquareColor = (document.getElementById('possibleMoveToSquareColor') as HTMLInputElement).value;
    let previousMoveHighlightColor = (document.getElementById('previousMoveHighlightColor') as HTMLInputElement).value;
    let fontSize = (document.getElementById('fontSize') as HTMLInputElement).value;

    settings = {
        lightSquareColor: lightSquareColor,
        darkSquareColor: darkSquareColor,
        currentSquareHighlightColor: currentSquareHighlightColor,
        possibleMoveToSquareColor: possibleMoveToSquareColor,
        previousMoveHighlightColor: previousMoveHighlightColor,
        fontSize: fontSize
    }
}

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadSettings() {
    let settingsString = localStorage.getItem('settings');
    if (settingsString !== null) {
        settings = JSON.parse(settingsString);
    }
    // Set the values of the inputs
    let lightSquareColor = (document.getElementById('lightSquareColor') as HTMLInputElement);
    let darkSquareColor = (document.getElementById('darkSquareColor') as HTMLInputElement);
    let currentSquareHighlightColor = (document.getElementById('currentSquareHighlightColor') as HTMLInputElement);
    let possibleMoveToSquareColor = (document.getElementById('possibleMoveToSquareColor') as HTMLInputElement);
    let previousMoveHighlightColor = (document.getElementById('previousMoveHighlightColor') as HTMLInputElement);
    let fontSize = (document.getElementById('fontSize') as HTMLInputElement);
    let fontSizeLabel = (document.getElementById('fontSizeLabel') as HTMLLabelElement);
    lightSquareColor.value = settings.lightSquareColor;
    darkSquareColor.value = settings.darkSquareColor;
    currentSquareHighlightColor.value = settings.currentSquareHighlightColor;
    possibleMoveToSquareColor.value = settings.possibleMoveToSquareColor;
    previousMoveHighlightColor.value = settings.previousMoveHighlightColor;
    fontSize.value = settings.fontSize;
    fontSizeLabel.innerText = `${settings.fontSize}`
}

let saveButton = document.getElementById('saveThemeButton');
if (saveButton) {
    saveButton.addEventListener('click', async () => {
        let fpath = await save({
            defaultPath: 'theme.cbt',
            filters: [
                { name: 'Chessboard Theme', extensions: ['cbt'] }
            ]
        });
        if (fpath !== null) {
            await fs.writeFile(fpath, JSON.stringify(settings));
        }
    });
}

let loadButton = document.getElementById('loadThemeButton');
if (loadButton) {
    loadButton.addEventListener('click', async () => {
        let fpath = await open({
            filters: [
                { name: 'Chessboard Theme', extensions: ['cbt'] }
            ]
        });
        if (Array.isArray(fpath)) {
            alert('Please select only one file');
        } else if (fpath === null) {
            return;
        } else {
            let contents = await fs.readTextFile(fpath);
            settings = JSON.parse(contents);
            console.log(settings);
            saveSettings();
            loadSettings();
            updateTheme();
        }
    });
}

let okButton = document.getElementById('okButton');
if (okButton) {
    okButton.addEventListener('click', function () {
        updateSettings();
        saveSettings();
        window.location.href = 'index.html';
    });
}

let defaultButton = document.getElementById('defaultButton');
if (defaultButton) {
    defaultButton.addEventListener('click', function () {
        settings = new Settings();
        saveSettings();
        loadSettings();
        updateTheme();
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

function hexToRgba(hex: string) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    let a = parseInt(hex.substring(7, 9), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function rgbToHex(rgb: string) {
    let rgbaArray = rgb.substring(4, rgb.length - 1).split(', ');
    let r = parseInt(rgbaArray[0]);
    let g = parseInt(rgbaArray[1]);
    let b = parseInt(rgbaArray[2]);
    let rs = r.toString(16);
    let gs = g.toString(16);
    let bs = b.toString(16);
    if (rs.length == 1) {
        rs = '0' + rs;
    }
    if (gs.length == 1) {
        gs = '0' + gs;
    }
    if (bs.length == 1) {
        bs = '0' + bs;
    }
    let res = '#' + rs + gs + bs;
    return res;
}

function updateTheme() {
    let styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`.light-square { background-color: ${settings.lightSquareColor}; }`, styleSheet.cssRules.length);
    styleSheet.insertRule(`.dark-square { background-color: ${settings.darkSquareColor}; }`, styleSheet.cssRules.length);
    styleSheet.insertRule(`.highlight-current { background-color: ${settings.currentSquareHighlightColor}; }`, styleSheet.cssRules.length);
    styleSheet.insertRule(`.highlight-attack { border-color: ${settings.possibleMoveToSquareColor}; }`, styleSheet.cssRules.length);
    styleSheet.insertRule(`.highlight-attack::before { background-color: ${settings.possibleMoveToSquareColor}; }`, styleSheet.cssRules.length);
    styleSheet.insertRule(`.highlight { background-color: ${settings.previousMoveHighlightColor}; }`, styleSheet.cssRules.length);
}

let lightSquareColor = document.getElementById('lightSquareColor');
if (lightSquareColor) {
    lightSquareColor.addEventListener('change', function () {
        updateSettings();
        updateTheme();
    });
    lightSquareColor.addEventListener('input', function () {
        updateSettings();
        updateTheme();
    });
}

let darkSquareColor = document.getElementById('darkSquareColor');
if (darkSquareColor) {
    darkSquareColor.addEventListener('change', function () {
        updateSettings();
        updateTheme();
    });
    darkSquareColor.addEventListener('input', function () {
        updateSettings();
        updateTheme();
    });
}

let currentSquareHighlightColor = document.getElementById('currentSquareHighlightColor');
if (currentSquareHighlightColor) {
    currentSquareHighlightColor.addEventListener('change', function () {
        updateSettings();
        updateTheme();
    });
    currentSquareHighlightColor.addEventListener('input', function () {
        updateSettings();
        updateTheme();
    });
}

let possibleMoveToSquareColor = document.getElementById('possibleMoveToSquareColor');
if (possibleMoveToSquareColor) {
    possibleMoveToSquareColor.addEventListener('change', function () {
        updateSettings();
        updateTheme();
    });
    possibleMoveToSquareColor.addEventListener('input', function () {
        updateSettings();
        updateTheme();
    });
}


let previousMoveHighlightColor = document.getElementById('previousMoveHighlightColor');
if (previousMoveHighlightColor) {
    previousMoveHighlightColor.addEventListener('change', function () {
        updateSettings();
        updateTheme();
    });
    previousMoveHighlightColor.addEventListener('input', function () {
        updateSettings();
        updateTheme();
    });
}

let fontSize = document.getElementById('fontSize');
if (fontSize) {
    fontSize.addEventListener('change', function () {
        updateSettings();
        let fontSizeLabel = (document.getElementById('fontSizeLabel') as HTMLLabelElement);
        fontSizeLabel.innerText = `${settings.fontSize}`
    });
    fontSize.addEventListener('input', function () {
        updateSettings();
        let fontSizeLabel = (document.getElementById('fontSizeLabel') as HTMLLabelElement);
        fontSizeLabel.innerText = `${settings.fontSize}`
    });
}