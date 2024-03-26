const cells = document.querySelectorAll('.cell');
const turnInfo = document.getElementById('turn-info');
const resetBtn = document.getElementById('reset-btn');
const resetPopupBtn = document.getElementById('reset-popup-btn');
const winnerPopup = document.getElementById('winner-popup');
const winnerMessage = document.getElementById('winner-message');
const playerForm = document.getElementById('player-form');
const startGameBtn = document.getElementById('start-game');
const gameContainer = document.getElementById('game-container');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const player1NameInputGame = document.getElementById('player1-name-input');
const player2NameInputGame = document.getElementById('player2-name-input');
const changeNamesBtn = document.getElementById('change-names');
const player1ScoreSpan = document.getElementById('player1-score');
const player2ScoreSpan = document.getElementById('player2-score');

let currentPlayer = 'X';
let gameOver = false;
let board = ['', '', '', '', '', '', '', '', ''];
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let player1Score = 0;
let player2Score = 0;
let player1Streak = 0;
let player2Streak = 0;
let player1HighestStreak = 0;
let player2HighestStreak = 0;

function startGame() {
    player1Name = player1NameInput.value || 'Player 1';
    player2Name = player2NameInput.value || 'Player 2';
    player1NameInputGame.value = player1Name;
    player2NameInputGame.value = player2Name;
    playerForm.style.display = 'none';
    gameContainer.style.display = 'block';
    turnInfo.textContent = `${player1Name}'s Turn (X)`;
    resetGame();
}

function changeNames() {
    player1Name = player1NameInputGame.value || 'Player 1';
    player2Name = player2NameInputGame.value || 'Player 2';
    turnInfo.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s Turn (${currentPlayer})`;
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            showWinnerPopup(board[a]);
            return board[a];
        }
    }

    return null;
}

function handleCellClick(e) {
    const cellIndex = Array.from(cells).indexOf(e.target);

    if (board[cellIndex] === '' && !gameOver) {
        board[cellIndex] = currentPlayer;
        e.target.textContent = currentPlayer;

        const winner = checkWinner();
        if (winner) {
            gameOver = true;
        } else if (!board.includes('')) {
            showWinnerPopup('Tie');
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            turnInfo.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s Turn (${currentPlayer})`;
        }
    }
}

function showWinnerPopup(winner) {
    if (winner === 'Tie') {
        winnerMessage.textContent = "It's a Tie!";
        player1Streak = 0;
        player2Streak = 0;
    } else {
        const winnerName = winner === 'X' ? player1Name : player2Name;
        winnerMessage.textContent = `${winnerName} Wins!`;
        if (winner === 'X') {
            player1Score++;
            player1ScoreSpan.textContent = player1Score;
            player1Streak++;
            player1HighestStreak = Math.max(player1HighestStreak, player1Streak);
            player2Streak = 0;
        } else {
            player2Score++;
            player2ScoreSpan.textContent = player2Score;
            player2Streak++;
            player2HighestStreak = Math.max(player2HighestStreak, player2Streak);
            player1Streak = 0;
        }
    }
    winnerPopup.style.display = 'block';
    displayStreaks();
}

function displayStreaks() {
    const streakTableBody = document.getElementById('streak-table-body');
    streakTableBody.innerHTML = '';

    const currentStreakRow = document.createElement('tr');
    const currentStreakHeader = document.createElement('th');
    currentStreakHeader.textContent = 'Current Streak';
    currentStreakRow.appendChild(currentStreakHeader);

    const player1CurrentStreakCell = document.createElement('td');
    player1CurrentStreakCell.textContent = player1Streak;
    currentStreakRow.appendChild(player1CurrentStreakCell);

    const player2CurrentStreakCell = document.createElement('td');
    player2CurrentStreakCell.textContent = player2Streak;
    currentStreakRow.appendChild(player2CurrentStreakCell);

    streakTableBody.appendChild(currentStreakRow);

    const highestStreakRow = document.createElement('tr');
    const highestStreakHeader = document.createElement('th');
    highestStreakHeader.textContent = 'Highest Streak';
    highestStreakRow.appendChild(highestStreakHeader);

    const player1HighestStreakCell = document.createElement('td');
    player1HighestStreakCell.textContent = player1HighestStreak;
    highestStreakRow.appendChild(player1HighestStreakCell);

    const player2HighestStreakCell = document.createElement('td');
    player2HighestStreakCell.textContent = player2HighestStreak;
    highestStreakRow.appendChild(player2HighestStreakCell);

    streakTableBody.appendChild(highestStreakRow);
}

function resetGame() {
    currentPlayer = 'X';
    gameOver = false;
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    winnerPopup.style.display = 'none';
    turnInfo.textContent = `${player1Name}'s Turn (X)`;
    displayStreaks();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
resetPopupBtn.addEventListener('click', resetGame);
startGameBtn.addEventListener('click', startGame);
changeNamesBtn.addEventListener('click', changeNames);

const resetScoresBtn = document.getElementById('reset-scores-btn');

function resetScores() {
    player1Score = 0;
    player2Score = 0;
    player1Streak = 0;
    player2Streak = 0;
    player1HighestStreak = 0;
    player2HighestStreak = 0;
    player1ScoreSpan.textContent = player1Score;
    player2ScoreSpan.textContent = player2Score;
    displayStreaks();
}

resetScoresBtn.addEventListener('click', resetScores);

window.addEventListener('click', function(event) {
    if (event.target === winnerPopup) {
        winnerPopup.style.display = 'none';
    }
});