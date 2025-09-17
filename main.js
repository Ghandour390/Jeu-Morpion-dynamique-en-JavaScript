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
    const k = parseInt(document.getElementById('winSieze').value);

    // récupérer la grille comme matrice 2D
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
        [1, -1]  
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
