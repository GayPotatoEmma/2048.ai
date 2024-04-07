const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score'); 

let grid = [];
let score = 0; 

function setupGame() {
    grid = createEmptyGrid();
    addRandomTile();
    addRandomTile();
    renderGrid();
    updateScoreDisplay();
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
            score += tiles[i]; // Update the score
            tiles.splice(i + 1, 1);
        }
    }
    return tiles;
}

function moveAndMerge(rowOrCol) {
  const filteredRowOrCol = rowOrCol.filter(num => num !== 0);
  const mergedRowOrCol = mergeTiles(filteredRowOrCol);
  const finalRowOrCol = mergedRowOrCol.concat(Array(4 - mergedRowOrCol.length).fill(0));
  return finalRowOrCol;
}

function moveTilesUp() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    const colData = [grid[0][col], grid[1][col], grid[2][col], grid[3][col]];
    const newColData = moveAndMerge(colData); 
    for (let row = 0; row < 4; row++) {
      if (grid[row][col] !== newColData[row]) moved = true;
      grid[row][col] = newColData[row];
    }
  }
  return moved;
}

function moveTilesDown() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    const colData = [grid[3][col], grid[2][col], grid[1][col], grid[0][col]];
    const newColData = moveAndMerge(colData);
    for (let row = 3; row >= 0; row--) {
      if (grid[row][col] !== newColData[3 - row]) moved = true;
      grid[row][col] = newColData[3 - row];
    }
  }
  return moved;
}

function moveTilesLeft() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    const rowData = [grid[row][0], grid[row][1], grid[row][2], grid[row][3]];
    const newRowData = moveAndMerge(rowData);
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] !== newRowData[col]) moved = true;
      grid[row][col] = newRowData[col];
    }
  }
  return moved;
}

function moveTilesRight() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    const rowData = [grid[row][3], grid[row][2], grid[row][1], grid[row][0]];
    const newRowData = moveAndMerge(rowData);
    for (let col = 3; col >= 0; col--) {
      if (grid[row][col] !== newRowData[3 - col]) moved = true; 
      grid[row][col] = newRowData[3 - col];
    }
  }
  return moved;
}


function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                return; 
            }
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) { 
            if (grid[i][j] === grid[i][j + 1]) {
                return; 
            }
        }
    }
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 3; i++) { 
            if (grid[i][j] === grid[i + 1][j]) {
                return; 
            }
        }
    }

    alert('Game Over!'); 
}

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

document.addEventListener('keyup', event => {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        handleInput(key);
        updateScoreDisplay(); // Update score after each move
    }
});

const arrows = document.querySelectorAll('.arrow');

function handleArrowInput(direction) {
	const keyMap = {
		'left': 'ArrowLeft',
		'right': 'ArrowRight',
		'up': 'ArrowUp',
		'down': 'ArrowDown',
	}; 
	const arrowKey = keyMap[direction];
  handleInput(arrowKey); 
  updateScoreDisplay(); // Update score after each move
}

arrows.forEach(arrow => {
  arrow.addEventListener('touchstart', (event) => {
    handleArrowInput(arrow.classList[1]);  
  }, { passive: true });

  arrow.addEventListener('click', (event) => { 
    handleArrowInput(arrow.classList[1]);  
  }); 
});

const themeButton = document.getElementById('theme-button');

function toggleDarkTheme() {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  storeCurrentTheme();
}

function storeCurrentTheme() {
  const isDarkTheme = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function loadTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark-theme'); 
    document.body.classList.remove('light-theme'); // Ensure light theme is removed
  }
}

themeButton.addEventListener('click', toggleDarkTheme); 

loadTheme(); 

setupGame();