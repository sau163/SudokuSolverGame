export function possible(grid, x, y, n) {
  for (let i = 0; i < 9; i++) {
    if (grid[i][x] === n && i !== y) return false; // Check the column
    if (grid[y][i] === n && i !== x) return false; // Check the row
  }

  let x0 = Math.floor(x / 3) * 3;
  let y0 = Math.floor(y / 3) * 3;

  for (let X = x0; X < x0 + 3; X++) {
    for (let Y = y0; Y < y0 + 3; Y++) {
      if (grid[Y][X] === n && (X !== x || Y !== y)) return false; // Check the 3x3 box
    }
  }
  return true;
}

export function solveSudoku(grid) {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (grid[y][x] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (possible(grid, x, y, n)) {
            grid[y][x] = n;
            if (solveSudoku(grid)) return true;
            grid[y][x] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
