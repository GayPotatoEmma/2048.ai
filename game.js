const gridContainer = document.querySelector('.grid-container');

// Game Logic:
let grid = []; // A 2D array representing the game board

function setupGame() {
    grid = createEmptyGrid();
    addRandomTile();
    addRandomTile();
    renderGrid();
}

function createEmptyGrid() {
    return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        let { row, col } = emptyCells[randomIndex];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let tile = document.createElement('div');
            tile.classList.add('grid-cell');
            if (grid[i][j] !== 0) {
                tile.textContent = grid[i][j];
                tile.classList.add(`tile-${grid[i][j]}`);
            }
            gridContainer.appendChild(tile);
        }
    }
}

function handleInput(direction) {
    let moved = false;
    switch (direction) {
        case 'ArrowUp':
            moved = moveTilesUp();
            break;
        case 'ArrowDown':
            moved = moveTilesDown();
            break;
        case 'ArrowLeft':
            moved = moveTilesLeft();
            break;
        case 'ArrowRight':
            moved = moveTilesRight();
            break;
    }

    if (moved) {
        addRandomTile();
        renderGrid();
        checkGameOver();
    }
}

function mergeTiles(tiles) {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] === tiles[i + 1]) {
            tiles[i] *= 2;
            tiles.splice(i + 1, 1);
        }
    }
    return tiles;
}

function moveTilesUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        for (let row = 1; row < 4; row++) { 
            if (grid[row][col] !== 0) {
                let mergeRow = row - 1; 
                while (mergeRow >= 0 && grid[mergeRow][col] === 0) { 
                    mergeRow--; 
                }
                if (mergeRow >= 0 && grid[mergeRow][col] === grid[row][col]) {
                    grid[mergeRow][col] *= 2;
                    grid[row][col] = 0;
                    moved = true;
                } else if (mergeRow + 1 !== row) { 
                    grid[mergeRow + 1][col] = grid[row][col];
                    grid[row][col] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function moveTilesDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        for (let row = 2; row >= 0; row--) { // Start from the third row (from the bottom)
            if (grid[row][col] !== 0) {
                let mergeRow = row + 1; // Look at the row below
                while (mergeRow <= 3 && grid[mergeRow][col] === 0) { 
                    mergeRow++;
                }
                if (mergeRow <= 3 && grid[mergeRow][col] === grid[row][col]) {
                    grid[mergeRow][col] *= 2;
                    grid[row][col] = 0;
                    moved = true;
                } else if (mergeRow - 1 !== row) { 
                    grid[mergeRow - 1][col] = grid[row][col];
                    grid[row][col] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function moveTilesLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        for (let col = 1; col < 4; col++) { 
            if (grid[row][col] !== 0) {
                let mergeCol = col - 1; 
                while (mergeCol >= 0 && grid[row][mergeCol] === 0) { 
                    mergeCol--; 
                }
                if (mergeCol >= 0 && grid[row][mergeCol] === grid[row][col]) {
                    grid[row][mergeCol] *= 2;
                    grid[row][col] = 0;
                    moved = true;
                } else if (mergeCol + 1 !== col) { 
                    grid[row][mergeCol + 1] = grid[row][col];
                    grid[row][col] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function moveTilesRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        for (let col = 2; col >= 0; col--) { // Start from the third column (from the right)
            if (grid[row][col] !== 0) {
                let mergeCol = col + 1; 
                while (mergeCol <= 3 && grid[row][mergeCol] === 0) { 
                    mergeCol++; 
                }
                if (mergeCol <= 3 && grid[row][mergeCol] === grid[row][col]) {
                    grid[row][mergeCol] *= 2;
                    grid[row][col] = 0;
                    moved = true;
                } else if (mergeCol - 1 !== col) { 
                    grid[row][mergeCol - 1] = grid[row][col];
                    grid[row][col] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}


function checkGameOver() {
    // 1. Check for any empty cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                return; // Game is not over (empty cell found)
            }
        }
    }

    // 2. Check for adjacent tiles with the same value
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) { // Don't need to check last column of each row
            if (grid[i][j] === grid[i][j + 1]) {
                return; // Game is not over (mergeable tiles found)
            }
        }
    }
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 3; i++) {  // Don't need to check the last row of each column
            if (grid[i][j] === grid[i + 1][j]) {
                return; // Game is not over (mergeable tiles found)
            }
        }
    }

    // If neither condition was met, it's game over:
    alert('Game Over!'); 
}

// Event Listeners
document.addEventListener('keyup', event => {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        handleInput(key);
    }
});

setupGame(); 
