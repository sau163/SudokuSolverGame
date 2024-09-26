


import React, { useState, useEffect } from 'react';
import './App.css';
import { possible, solveSudoku } from './solver';

// Function to deep copy a grid (helper function)
const deepCopy = (grid) => grid.map(row => [...row]);

// Function to generate a random Sudoku board by removing some numbers from a solved board
const generateRandomBoard = (difficulty = 'medium') => {
  const grid = Array(9).fill().map(() => Array(9).fill(0));
  solveSudoku(grid); // Generate a fully solved board

  // Difficulty levels: number of cells to clear
  const levels = {
    easy: 40,
    medium: 50,
    hard: 60
  };

  const cellsToClear = levels[difficulty] || levels['medium'];

  // Randomly clear some cells from the solved board
  for (let i = 0; i < cellsToClear; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    grid[row][col] = 0; // Clear the cell
  }

  return grid;
};

const App = () => {
  const [grid, setGrid] = useState(deepCopy(generateRandomBoard()));
  const [selectedCell, setSelectedCell] = useState(null); // Keep track of selected cell
  const [errorCells, setErrorCells] = useState(new Set()); // Cells filled incorrectly
  const [correctCells, setCorrectCells] = useState(new Set()); // Cells filled correctly

  // Handle cell selection
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  // Function to handle key press events for entering numbers in the selected cell
  const handleKeyPress = (event) => {
    if (!selectedCell) return; // No cell selected

    const { row, col } = selectedCell;

    // Only allow number inputs between 1 and 9
    if (event.key >= '1' && event.key <= '9') {
      const number = parseInt(event.key, 10);
      const newGrid = [...grid];

      // Check if placing the number is a valid move
      if (possible(newGrid, col, row, number)) {
        newGrid[row][col] = number; // Place the number in the grid
        setCorrectCells((prev) => new Set([...prev, `${row}-${col}`])); // Mark as correct move
        setErrorCells((prev) => {
          const newErrorCells = new Set(prev);
          newErrorCells.delete(`${row}-${col}`); // Remove from error cells if it was incorrect
          return newErrorCells;
        });
      } else {
        newGrid[row][col] = number; // Place the incorrect number in the grid
        setErrorCells((prev) => new Set([...prev, `${row}-${col}`])); // Mark as error
        setCorrectCells((prev) => {
          const newCorrectCells = new Set(prev);
          newCorrectCells.delete(`${row}-${col}`); // Remove from correct cells if it was correct
          return newCorrectCells;
        });
      }

      setGrid(newGrid);
    }
  };

  // Add a global event listener for key presses
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedCell, grid]); // Dependency array includes selectedCell and grid

  // Handle new game (generating a new random board)
  const handleNewGame = (difficulty = 'medium') => {
    const newBoard = generateRandomBoard(difficulty);
    setGrid(deepCopy(newBoard));
    setErrorCells(new Set());
    setCorrectCells(new Set());
    setSelectedCell(null);
  };

  return (
    <div className="App">
      <h1>Sudoku Game</h1>
      <button onClick={() => handleNewGame('easy')}>New Easy Game</button>
      <button onClick={() => handleNewGame('medium')}>New Medium Game</button>
      <button onClick={() => handleNewGame('hard')}>New Hard Game</button>

      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isError = errorCells.has(cellKey);
                const isCorrect = correctCells.has(cellKey);
                const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;

                return (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`cell ${isError ? 'error' : isCorrect ? 'correct' : ''} ${isSelected ? 'selected' : ''}`}
                  >
                    {value !== 0 ? value : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p>Select a box and press a number key (1-9) to fill it.</p>
    </div>
  );
};

export default App;
