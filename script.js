let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let playWithAI = false;

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const playWithAIButton = document.getElementById('playWithAI');
const playTwoPlayersButton = document.getElementById('playTwoPlayers');

playWithAIButton.addEventListener('click', () => {
    playWithAI = true;
    resetGame();
    message.textContent = `Player ${currentPlayer}'s turn`;
    hideMenu();
});

playTwoPlayersButton.addEventListener('click', () => {
    playWithAI = false;
    resetGame();
    message.textContent = `Player ${currentPlayer}'s turn`;
    hideMenu();
});

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] === '' && !checkWinner(board)) {
        makeMove(index, currentPlayer);
        if (!checkWinner(board) && !board.every(cell => cell !== '')) {
            if (playWithAI && currentPlayer === 'X') {
                currentPlayer = 'O';
                message.textContent = `Player ${currentPlayer}'s turn`;
                setTimeout(aiMove, 500); // Delay AI move for better user experience
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                message.textContent = `Player ${currentPlayer}'s turn`;
            }
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    let result = checkWinner(board);
    if (result !== null) {
        if (result === 'Draw') {
            message.textContent = 'Draw!';
        } else {
            message.textContent = `${result} wins!`;
        }
        showMenu();
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    makeMove(move, 'O');
    if (!checkWinner(board)) {
        currentPlayer = 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    if (result !== null) {
        if (result === 'O') return 1;
        else if (result === 'X') return -1;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== '')) {
        return 'Draw';
    }
    return null;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    message.textContent = 'Choose a game mode to start playing';
    cells.forEach(cell => cell.textContent = '');
    showMenu();
}

function hideMenu() {
    document.getElementById('menu').classList.add('hidden');
}

function showMenu() {
    document.getElementById('menu').classList.remove('hidden');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
