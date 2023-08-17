var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Board } from "./board.js";
import { appWindow } from "../node_modules/@tauri-apps/api/window";
window.onresize = () => __awaiter(void 0, void 0, void 0, function* () {
    let scalefact = Math.min(window.innerWidth / 748, window.innerHeight / 533);
    document.body.style.scale = scalefact.toString();
    window.resizeTo(748 * scalefact, 532 * scalefact);
    localStorage.setItem('scalefact', scalefact.toString());
});
window.onload = () => {
    if (localStorage.getItem("scalefact") !== null) {
        let scalefact = parseFloat(localStorage.getItem("scalefact"));
        document.body.style.scale = scalefact.toString();
    }
    loadSettings();
    updateTheme();
};
appWindow.onCloseRequested(() => {
    localStorage.removeItem("scalefact");
    appWindow.close();
});
class Settings {
    constructor() {
        this.lightSquareColor = `${rgbToHex('rgb(205, 195, 205)')}`;
        this.darkSquareColor = `${rgbToHex('rgb(105, 95, 105)')}`;
        this.currentSquareHighlightColor = `${rgbToHex('rgb(100, 255, 0)')}`;
        this.possibleMoveToSquareColor = `${rgbToHex('rgb(21, 103, 80)')}`;
        this.previousMoveHighlightColor = `${rgbToHex('rgb(105, 105, 235)')}`;
        this.fontSize = '20';
    }
}
let settings = new Settings();
function updateSettings() {
    let lightSquareColor = document.getElementById('lightSquareColor').value;
    let darkSquareColor = document.getElementById('darkSquareColor').value;
    let currentSquareHighlightColor = document.getElementById('currentSquareHighlightColor').value;
    let possibleMoveToSquareColor = document.getElementById('possibleMoveToSquareColor').value;
    let previousMoveHighlightColor = document.getElementById('previousMoveHighlightColor').value;
    let fontSize = document.getElementById('fontSize').value;
    settings = {
        lightSquareColor: lightSquareColor,
        darkSquareColor: darkSquareColor,
        currentSquareHighlightColor: currentSquareHighlightColor,
        possibleMoveToSquareColor: possibleMoveToSquareColor,
        previousMoveHighlightColor: previousMoveHighlightColor,
        fontSize: fontSize
    };
    console.log(settings);
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
    let lightSquareColor = document.getElementById('lightSquareColor');
    let darkSquareColor = document.getElementById('darkSquareColor');
    let currentSquareHighlightColor = document.getElementById('currentSquareHighlightColor');
    let possibleMoveToSquareColor = document.getElementById('possibleMoveToSquareColor');
    let previousMoveHighlightColor = document.getElementById('previousMoveHighlightColor');
    let fontSize = document.getElementById('fontSize');
    let fontSizeLabel = document.getElementById('fontSizeLabel');
    lightSquareColor.value = settings.lightSquareColor;
    darkSquareColor.value = settings.darkSquareColor;
    currentSquareHighlightColor.value = settings.currentSquareHighlightColor;
    possibleMoveToSquareColor.value = settings.possibleMoveToSquareColor;
    previousMoveHighlightColor.value = settings.previousMoveHighlightColor;
    fontSize.value = settings.fontSize;
    fontSizeLabel.innerText = `${settings.fontSize}`;
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
function hexToRgba(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    let a = parseInt(hex.substring(7, 9), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function rgbToHex(rgb) {
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
    console.log(res);
    return res;
}
let ruleSetOnce = false;
function updateTheme() {
    let styleSheet = document.styleSheets[0];
    if (ruleSetOnce) {
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
        styleSheet.deleteRule(styleSheet.cssRules.length - 1);
    }
    ruleSetOnce = true;
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
        let fontSizeLabel = document.getElementById('fontSizeLabel');
        fontSizeLabel.innerText = `${settings.fontSize}`;
    });
    fontSize.addEventListener('input', function () {
        updateSettings();
        let fontSizeLabel = document.getElementById('fontSizeLabel');
        fontSizeLabel.innerText = `${settings.fontSize}`;
    });
}
//# sourceMappingURL=settings.js.map