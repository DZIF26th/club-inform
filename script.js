const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
let board = Array(9).fill(null);
let humanPlayer = 'X';
let aiPlayer = 'O';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function disableBoard() {
    cells.forEach(cell => {
        if (cell.textContent === '') {
            cell.removeEventListener('click', handleClick);
        }
    });
}

function enableBoard() {
    cells.forEach(cell => {
        if (cell.textContent === '') {
            cell.addEventListener('click', handleClick, { once: true });
        }
    });
}

function handleClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (board[index] !== null) return;

    board[index] = humanPlayer;
    cell.textContent = humanPlayer;

    if (checkWin(board, humanPlayer)) {
        document.getElementById('outcome').textContent = 'You win';
        disableBoard(); 
        return;
    }

    if (board.every(cell => cell !== null)) {
        document.getElementById('outcome').textContent = 'Draw';
        return;
    }

    aiMove();
}

function aiMove() {
    disableBoard();
    const bestMove = minimax(board, aiPlayer).index;

    setTimeout(() => {
        board[bestMove] = aiPlayer;
        cells[bestMove].textContent = aiPlayer;

        if (checkWin(board, aiPlayer)) {
            document.getElementById('outcome').textContent = 'You lose';
            disableBoard();  
            return;
        }

        if (board.every(cell => cell !== null)) {
            document.getElementById('outcome').textContent = 'Draw';
        }
        else {
            enableBoard();  
        }
    }, 800);

}

function checkWin(board, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.reduce((acc, el, i) => {
        if (el === null) acc.push(i);
        return acc;
    }, []);

    if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    availableSpots.forEach(spot => {
        const move = {};
        move.index = spot;
        newBoard[spot] = player;

        if (player === aiPlayer) {
            const result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[spot] = null;
        moves.push(move);
    });

    let bestMove;

    if (player === aiPlayer) {
        let bestScore = -Infinity;
        moves.forEach((move, i) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((move, i) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
}

function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    document.getElementById('outcome').textContent = '';  // 重置 outcome 显示
}

resetButton.addEventListener('click', resetGame);


document.querySelectorAll('.bookmark a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 50, 
            behavior: 'smooth'
        });
    });
});


// 當按鈕被點擊時觸發的動作
document.getElementById('celebrateButton').addEventListener('click', function() {
    // 顯示懸浮訊息
    const message = document.getElementById('floatingMessage');
    message.style.display = 'block';

    // 5秒後自動隱藏訊息
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);

    // 呼叫彩帶效果
    launchConfetti();
});

// 彩帶效果函數
function launchConfetti() {
    const colors = ['#FF0D57', '#FFD700', '#8B00FF', '#00C8FF'];
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
            colors: colors,
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}