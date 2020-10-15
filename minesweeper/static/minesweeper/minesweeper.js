// inspired from https://iq.opengenus.org/minesweeper-game-using-js/
let bomb = '💣';
let flag = '🚩';
let colors = {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'grey'};
let alive = true;
let num_of_flags = 0;
let bombs_remaining = num_of_bombs;
let game_grid = createGameGrid(grid);

function createGameGrid(tiles) {
    let arr = new Array(num_of_rows*num_of_cols);
    for (let i = 0; i < num_of_rows*num_of_cols; i++) {
        arr[i] = {row: i/num_of_rows, col: i%num_of_cols, value: tiles[i], reveal: false, flag: false}
    }
    return arr;
}

function addCellListener(tile, i, j) {
    tile.addEventListener('click', function(event) {
        if (event.shiftKey) {
            if (!alive) {
                return;
            }
            if (game_grid[i * num_of_rows + j].reveal) {
                return;
            }
            if (game_grid[i * num_of_rows + j].flag) {
                game_grid[i * num_of_rows + j].flag = !game_grid[i * num_of_rows + j].flag
                tile.textContent = '';
                num_of_flags--;
                if (game_grid[i*num_of_rows + j].value === -1) bombs_remaining++
            } else {
                game_grid[i * num_of_rows + j].flag = !game_grid[i * num_of_rows + j].flag
                tile.textContent = flag;
                num_of_flags++;
                if (game_grid[i*num_of_rows + j].value === -1) bombs_remaining--
            }
        } else {
            if (!alive) return;
            if (game_grid[i * num_of_rows + j].flag) return;
            if (game_grid[i * num_of_rows + j].reveal) {
                return;
            }
            else {
                if (game_grid[i * num_of_rows + j].value === -1) {
                    tile.style.backgroundColor = 'red';
                    tile.textContent = bomb;
                    gameOver();
                } else {
                    tile.style.backgroundColor = 'lightGrey';
                    if (game_grid[i * num_of_rows + j].value > 0) {
                        game_grid[i * num_of_rows + j].reveal = true;
                        tile.style.color = colors[game_grid[i * num_of_rows + j].value];
                        tile.textContent = game_grid[i * num_of_rows + j].value.toString();
                    } else {
                         for (let a = -2; a < 3; a++) {
                             for (let b = -2; b < 3; b++) {
                                 if (a === 0 && b === 0) {
                                     continue;
                                 }
                                 let x = i+a;
                                 let y = j+b;
                                 let adj = '#' + createID(x, y);
                                 let cell = document.querySelector(adj);
                                 if (!!cell && !game_grid[x*num_of_rows+y].reveal && !game_grid[x*num_of_rows+y].flag) {
                                     if (game_grid[x*num_of_rows+y].value === 0) {
                                         cell.style.backgroundColor = 'lightGrey';
                                         game_grid[x*num_of_rows+y].reveal = true;
                                     }
                                 }
                             }
                         }
                         game_grid[i * num_of_rows + j].reveal = true;
                    }
                }
            }
        }
        if (num_of_flags === num_of_bombs && bombs_remaining === 0) {
            gameWin();
        }
    });
}

function gameWin() {
    alive = false;
    document.querySelector('#win').style.display="block";
}

function gameOver() {
    alive = false;
    document.querySelector('#lost').style.display="block";
}

function reload() {
    window.location.reload();
}

function createID(i, j) {
    return 'cell-' + i + '-' + j;
}

window.addEventListener('load', function () {
    document.querySelector('#lost').style.display = 'none';

    let grid = document.createElement('table');
    let row;
    let tile;
    for (let i = 0; i < num_of_rows; i++) {
        row = document.createElement('tr');
        for (let j = 0; j < num_of_cols; j++) {
            tile = document.createElement('td');
            tile.id = createID(i, j)
            row.appendChild(tile);
            addCellListener(tile, i, j);
        }
        grid.append(row);
    }
    document.querySelector('#field').appendChild(grid); // add game grid
})
