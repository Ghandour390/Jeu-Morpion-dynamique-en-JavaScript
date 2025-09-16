let cells;
let currentPlayer = 'X';    
let size = 3;
let history = [];

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

function getGridSize() {
    return size;
}

function checkWinDynamic() {
    const size = getGridSize();
    let lines = [], columns = [], diag1 = [], diag2 = [];
    for (let i = 0; i < size; i++) {
        lines.push([]);
        columns.push([]);
    }
    for (let i = 0; i < cells.length; i++) {
        let row = Math.floor(i / size);
        let col = i % size;
        lines[row].push(i);
        columns[col].push(i);
        if (row === col) diag1.push(i);
        if (row + col === size - 1) diag2.push(i);
    }
    const winPatterns = [...lines, ...columns, diag1, diag2];
    for (let pattern of winPatterns) {
        const first = cells[pattern[0]].textContent;
        if (first !== '' && pattern.every(idx => cells[idx].textContent === first)) {
            return first;
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

function addCellListeners() {
    cells.forEach((cell, idx) => {
        cell.addEventListener('click', () => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                history.push({idx, player: currentPlayer});
                const winner = checkWinDynamic();
                if (winner) {
                    showModal('Le joueur ' + winner + ' a gagné !');
                    cells.forEach(c => c.textContent = ''); // reset
                    history = [];
                    return;
                }
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }else{
                showModal('Case déjà jouée');
            }
        })
    })
}

document.getElementById('startBtn').addEventListener('click', () => {
    size = parseInt(document.getElementById('gridSize').value);
    createGrid(size);
    document.getElementById('jeu').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    document.getElementById('jeu').style.gridTemplateRows = `repeat(${size}, 1fr)`;
    currentPlayer = 'X';
    history = [];
    addCellListeners();
});

document.getElementById('replayBtn').addEventListener('click', () => {
    createGrid(size);
    document.getElementById('jeu').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    document.getElementById('jeu').style.gridTemplateRows = `repeat(${size}, 1fr)`;
    currentPlayer = 'X';
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

createGrid(size);
document.getElementById('jeu').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
document.getElementById('jeu').style.gridTemplateRows = `repeat(${size}, 1fr)`;
history = [];
addCellListeners();
