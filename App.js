import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const boardSize = 3; // 3x9 Bingo board
const columnSize = 4; // Number of columns
const columnRanges = [
  { start: 1, end: 9 },
  { start: 10, end: 19 },
  { start: 20, end: 29 },
  { start: 30, end: 39 },
  /*{ start: 40, end: 49 },
  { start: 50, end: 59 },
  { start: 60, end: 69 },
  { start: 70, end: 79 },
  { start: 80, end: 90 },*/
];
const totalNumbers = 5; // Total numbers on the board

//TODO: Need to distribute numbers so that in each column they are in ascending order from top to bottom.
// TODO: Need to distribute numbers such that each row has only 5 numbers.
const generateRandomBoard = () => {
  const boardValues = []
  const board = Array.from({ length: boardSize }, () => Array(columnSize).fill(null));
  var columnIndices = Array.from({ length: columnSize }, (_, index) => index);
  for (let i = 0; i < totalNumbers; i++) {
    if (columnIndices.length == 0) {
        columnIndices = Array.from({ length: columnSize }, (_, index) => index);
    }
    const randomColumnIndex = Math.floor(Math.random() * columnIndices.length);
    const columnIndex = columnIndices.splice(randomColumnIndex, 1)[0];
    const range = columnRanges[columnIndex];
    let randomCellIndex;
    let attempts = 0; // Track the number of attempts
    do {
      randomCellIndex = Math.floor(Math.random() * boardSize);
      attempts++;
    } while (board[randomCellIndex][columnIndex] !== null && attempts < 10); // Adjust the maximum number of attempts as needed
    if (attempts === 10) {
      console.log('Failed to find an empty cell after 10 attempts.');
      break;
    }
    var randomNum = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
    if (boardValues.includes(randomNum)){
      randomNum = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
    }
    board[randomCellIndex][columnIndex] = randomNum;
    boardValues.push(randomNum)
  }
  //console.log(board)
  return board;
};

const App = () => {
  const [board, setBoard] = useState(generateRandomBoard());
  const [selectedCells, setSelectedCells] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [winningRows, setWinningRows] = useState([]);
  const [winningColumns, setWinningColumns] = useState([]);
  const [winningBoard, setWinningBoard] = useState(false);
  const [calledNumbers, setCalledNumbers] = useState([]);
  //const [gameFinished, setGameFinished] = useState(false);

  const markCell = (rowIndex, columnIndex) => {
    const number = board[rowIndex][columnIndex];
    if (calledNumbers.includes(number)) {
      const cellId = `${rowIndex}-${columnIndex}`;
      //console.log("selectedCells:", selectedCells)
      if (selectedCells.length == 0 || !selectedCells.includes(cellId)) {
        console.log("selectedCell:", cellId)
        setSelectedCells((prevSelectedCells) => [...prevSelectedCells, cellId]);
        setErrorMessage(null);
        checkWin(rowIndex, columnIndex);
      }
    } else {
      setErrorMessage('Select the cell with the current number!');
    }
  };

  //TODO: Fix win condition detection.
  const checkRowWin = (rowIndex) => {
    const row = board[rowIndex];
    console.log(row)
    return row.every((cell, columnIndex) => row[columnIndex] == null || (row[columnIndex] != null && selectedCells.includes(`${rowIndex}-${columnIndex}`)));
  };

  const checkColumnWin = (columnIndex) => {
    return board.every((row, rowIndex) => selectedCells.includes(`${rowIndex}-${columnIndex}`));
  };

  const checkBoardWin = () => {
    console.log("selectedCells.length:", selectedCells.length, ",totalNumbers:", totalNumbers)
    return selectedCells.length === totalNumbers;
  };

  const checkWin = (rowIndex, columnIndex) => {
    console.log("Checking for wins:",rowIndex, columnIndex)
     if (checkRowWin(rowIndex)) {
      setWinningRows((prevWinningRows) => [...prevWinningRows, rowIndex]);
      console.log("Winning row:", rowIndex)
    }
    if (checkColumnWin(columnIndex)) {
      setWinningColumns((prevWinningColumns) => [...prevWinningColumns, columnIndex]);
      console.log("Winning column:", rowIndex)
    } 
    if (checkBoardWin()) {
      setWinningBoard(true);
    }
  };

  const resetGame = () => {
    setBoard(generateRandomBoard());
    setSelectedCells([]);
    setCurrentNumber(null);
    setErrorMessage(null);
    setWinningRows([]);
    setWinningColumns([]);
    setWinningBoard(false);
  };
  
  useEffect(() => {

    var randomNum = -1
    do {
      randomNum = Math.floor(Math.random() * (columnRanges[columnSize - 1].end - columnRanges[0].start + 1)) + columnRanges[0].start;
    }while (calledNumbers.includes(randomNum))
    setCurrentNumber(randomNum);
    setCalledNumbers((prevCalledNumbers)=>[...prevCalledNumbers,randomNum])
    setErrorMessage(null);

    const interval = setInterval(() => {
      //console.log("useEffect-selectedCells:", selectedCells)
      do{
      randomNum = Math.floor(Math.random() * (columnRanges[columnSize - 1].end - columnRanges[0].start + 1)) + columnRanges[0].start;
      //console.log(":Generated random number:", randomNum)
      }while (calledNumbers.includes(randomNum))
      //console.log("Selected random number:", randomNum)

      setCurrentNumber(randomNum);
      setCalledNumbers((prevCalledNumbers)=>[...prevCalledNumbers,randomNum])
      console.log("selectedCells:",selectedCells)
      setErrorMessage(null);
      if (checkBoardWin()) {
        setWinningBoard(true);
      }
    }, 1000); // Change the number here to set the interval in milliseconds (e.g., 5000 = 5 seconds)

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <TouchableOpacity
                key={columnIndex}
                style={[
                  styles.cell,
                  {
                    backgroundColor: selectedCells.includes(`${rowIndex}-${columnIndex}`)
                      ? '#9BC53D'
                      : winningRows.includes(rowIndex) || winningColumns.includes(columnIndex)
                      ? '#FFD700'
                      : 'transparent',
                  },
                ]}
                onPress={() => markCell(rowIndex, columnIndex)}
                disabled={cell === null || winningBoard}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.currentNumberContainer}>
        <Text style={styles.currentNumberText}>Current Number: {currentNumber}</Text>
        { <Text style={styles.recentNumbers}>Last 5 called numbers:{calledNumbers.slice(-5).join(', ')}</Text> }
      </View>
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      {winningBoard && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Bingo! You won the board!</Text>
        </View>
      )}
      <View style={styles.messageContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      {winningRows.length > 0 && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Row Win:</Text>
          {winningRows.map((rowIndex) => (
            <Text key={rowIndex} style={styles.messageText}>
              Row {rowIndex + 1}
            </Text>
          ))}
        </View>
      )}
      {winningColumns.length > 0 && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Column Win:</Text>
          {winningColumns.map((columnIndex) => (
            <Text key={columnIndex} style={styles.messageText}>
              Column {columnIndex + 1}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    marginTop: 20,
    backgroundColor: '#ff8c00',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    //marginBottom: 5,
  },
  cell: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#3498db',
  },
  cellText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  currentNumberContainer: {
    marginTop: 20,
  },
  currentNumberText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  messageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameFinishedText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default App;
