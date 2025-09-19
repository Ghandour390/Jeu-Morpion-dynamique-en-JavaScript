let cells;
let currentPlayer = 'X';    
let size = 3;
let history = [];


function loadScores() {
    return JSON.parse(localStorage.getItem('score')) || { X: 0, O: 0, D: 0 };
}

function saveScores(scores) {
    localStorage.setItem('score', JSON.stringify(scores));
}

function updateScoreboardUI() {
    const scores = loadScores();
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    const elD = document.getElementById('scoreD');
    if (elD) elD.textContent = scores.D;
}

function incrementWin(winner) {
    const scores = loadScores();
    if (winner === 'X' || winner === 'O') {
        scores[winner] = (scores[winner] || 0) + 1;
        saveScores(scores);
        updateScoreboardUI();
    }
}

function incrementDraw() {
    const scores = loadScores();
    scores.D = (scores.D || 0) + 1;
    saveScores(scores);
    updateScoreboardUI();
}


function createGrid(n) {
    const jeu = document.getElementById('jeu');
    jeu.innerHTML = '';
    for (let i = 0; i < n * n; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        jeu.appendChild(cell);
    }
    cells = document.querySelectorAll('.cell');
}
// console.log(cells);

function getGridSize() {
    return size;
}

function checkWinDynamic() {
  
    const size = getGridSize();
    const k = parseInt(document.getElementById('winSieze').value);
    let board = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(cells[i * size + j].textContent);
        }
        board.push(row);
    }
    let directions = [
        [0, 1],  
        [1, 0],  
        [1, 1],  
        [1, -1], 
    ];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let player = board[i][j];
            if (player === '') continue;
            for (let [dx, dy] of directions) {
                let count = 1;
                for (let step = 1; step < k; step++) {
                    let x = i + dx * step;
                    let y = j + dy * step;
                    if (x < 0 || x >= size || y < 0 || y >= size) break;
                    if (board[x][y] === player) {
                        count++;
                    } else break;
                }
                if (count === k) {
                    return player; 
                }
            }
        }
    }
    return null;
}


function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').classList.add('show');
}
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('show');
});
function shekDraw() {
    return Array.from(cells).every(cell => cell.textContent !== '');
}
function addCellListeners() {
    cells.forEach((cell, idx) => {
        cell.addEventListener('click', () => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                history.push({idx, player: currentPlayer});
                if (shekDraw()) {
                    showModal('Match nul !');
                    cells.forEach(c => c.textContent = ''); 
                    history = [];
                    incrementDraw();
                    return;
                }
                const winner = checkWinDynamic();
                if (winner) {
                    showModal('Le joueur ' + winner + ' a gagné !');
                    cells.forEach(c => c.textContent = ''); 
                    history = [];
                    incrementWin(winner);
                    return;
                }
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                // update player display input value
                const playerJeur = document.getElementById('player');
                if (playerJeur) playerJeur.value = currentPlayer;
            }else{
                showModal('Case déjà jouée');
            }
        })
    })
}

// Adjust cell font-size to fit cell dimensions
function adjustCellFontSize() {
    if (!cells || cells.length === 0) return;
    const cell = cells[0];
    const rect = cell.getBoundingClientRect();
    // font should be roughly half of cell height
    const fontSize = Math.max(20, Math.floor(rect.height * 0.5));
    cells.forEach(c => c.style.fontSize = fontSize + 'px');
}

window.addEventListener('resize', () => {
    setTimeout(adjustCellFontSize, 50);
});

document.getElementById('startBtn').addEventListener('click', () => {
    let n = parseInt(document.getElementById('gridSize').value);
    let k = parseInt(document.getElementById('winSieze').value);
    if (isNaN(n) || n < 3) n = 3;
    if (isNaN(k) || k < 3) k = 3;
    if (n < k) n = k;
    size = n;
    createGrid(size);
    document.getElementById('jeu').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    document.getElementById('jeu').style.gridTemplateRows = `repeat(${size}, 1fr)`;
    // set currentPlayer according to selected symbol (radio) or saved choice
    const savedSymbol = localStorage.getItem('playerSymbol');
    const radio = document.querySelector('input[name="symbol"]:checked');
    const chosen = radio ? radio.value : (savedSymbol || 'X');
    currentPlayer = chosen;
    // persist choice
    localStorage.setItem('playerSymbol', chosen);
    history = [];
    addCellListeners();
});

document.getElementById('replayBtn').addEventListener('click', () => {
    createGrid(size);
    document.getElementById('jeu').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    document.getElementById('jeu').style.gridTemplateRows = `repeat(${size}, 1fr)`;
    const savedSymbol = localStorage.getItem('playerSymbol');
    const radio = document.querySelector('input[name="symbol"]:checked');
    const chosen = radio ? radio.value : (savedSymbol || 'X');
    currentPlayer = chosen;
    history = [];
    addCellListeners();
});


document.getElementById('undoBtn').addEventListener('click', () => {
    if (history.length > 0) {
        const last = history.pop();
        cells[last.idx].textContent = '';
        currentPlayer = last.player;
    }
});

document.getElementById('resetScores').addEventListener('click', () => {
    localStorage.removeItem('score');
    updateScoreboardUI();
});

createGrid(size);
document.getElementById('jeu').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
document.getElementById('jeu').style.gridTemplateRows = `repeat(${size}, 1fr)`;
history = [];
addCellListeners();
updateScoreboardUI();


const savedSymbol = localStorage.getItem('playerSymbol') || 'X';
const radioX = document.getElementById('symX');
const radioO = document.getElementById('symO');
if (radioX && radioO) {
    radioX.checked = savedSymbol === 'X';
    radioO.checked = savedSymbol === 'O';
}
currentPlayer = savedSymbol;
const playerJeur = document.getElementById('player');
if (playerJeur) playerJeur.value = currentPlayer;
