const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = document.body.clientWidth;
canvas.height = 1004;
const ROW = 20;
const COLUMN = 10;
const VACANT = "white";
const SQ = 40;

const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
];

const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ],
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ],
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ],
];

const PIECES = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'yellow'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange']
];


document.addEventListener('keydown', controls);

function controls({ key }) {
    if(key === 'ArrowLeft') {
        moveLeft(z);
    }
    else if(key === 'ArrowRight') {
        moveRight(z);
    }
    else if(key === 'ArrowUp') {
        rotate(z);
    }
    else if(key === 'ArrowDown') {
        moveDown(z);
    }
}

let board = [];
for(let r = 0; r < ROW; r++) {
    board[r] = [];
    for(let c = 0; c < COLUMN; c++) {
        board[r][c] = VACANT;
    }   
}

function drawBoard() {
    for(let r = 0; r < ROW; r++) {
        for(let c = 0; c < COLUMN; c++) {
            drawSquare(c, r, board[r][c]);   
        }   
    }
}

function drawSquare(x, y, color) { 
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.fillStyle = 'black';
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawPiece({activeTetromino, color, x, y}) {
    for(let r = 0; r < activeTetromino.length; r++) {
        for(let c = 0; c < activeTetromino.length; c++) {
            if(activeTetromino[r][c]) {
                drawSquare(c + x, r + y, color);
            }
        }
    }
}

function removePiece({activeTetromino, color, x, y}) {
    for(let r = 0; r < activeTetromino.length; r++) {
        for(let c = 0; c < activeTetromino.length; c++) {
            if(activeTetromino[r][c]) {
                drawSquare(c + x, r + y, VACANT);
            }
        }
    }
}

function lockPiece(piece) {
    for(let r = 0; r < piece.activeTetromino.length; r++) {
        for(let c = 0; c < piece.activeTetromino.length; c++) {
            if(!piece.activeTetromino[r][c]) {
                continue;
            }
            board[piece.y + r][piece.x + c] = piece.color;
        }   
    }

    for(let r = 0; r < ROW; r++) {
        let isRowFull = true;
        for(let c = 0; c < COLUMN; c++) { 
            isRowFull = isRowFull && (board[r][c] !== VACANT);
        }
        if(isRowFull) {
            for(let y = r; y > 1; y--) {
                for(let c = 0; c < COLUMN; c++) { 
                    board[y][c] = board[y-1][c];
                }
            }
        }
    }
    drawBoard();
    z = randomPiece();
}

function gameOver() {}

// function removePiece({ activeTetromino, x, y }) {
//     drawPiece({ activeTetromino, VACANT, x, y});
// }

function collision(x, y, piece) {
    for(let r = 0; r < piece.activeTetromino.length; r++) {
        for(let c = 0; c < piece.activeTetromino.length; c++) {
            if(!piece.activeTetromino[r][c]) {
                continue;
            }

            const newX = piece.x + c + x;
            const newY = piece.y + r + y;

            if(newX < 0 || newX >= COLUMN || newY >= ROW) {
                return true;
            }

            if(newY < 0) {
                continue;
            }

            if(board[newY][newX] != VACANT) {
                return true
            }
        }
    }  

    return false;
}

function rotate(tetromino) {
    removePiece(tetromino);
    if (tetromino.tetrominoN < 3) {
        tetromino.tetrominoN +=1;
    } else {
        tetromino.tetrominoN = 0;
    }
    tetromino.activeTetromino = tetromino.tetromino[tetromino.tetrominoN];
    drawPiece(tetromino);
}

function moveDown(tetromino) {
    if(!collision(0,1,tetromino)) {
        removePiece(tetromino);
        tetromino.y++;
        drawPiece(tetromino);
    } else { 
        lockPiece(tetromino);
    }
}

function moveLeft(tetromino) {
    if(!collision(-1,0,tetromino)) {
        removePiece(tetromino);
        tetromino.x--;
        drawPiece(tetromino);
    }
}

function moveRight(tetromino) {
    if(!collision(1,0,tetromino)) {
        removePiece(tetromino);
        tetromino.x++;
        drawPiece(tetromino);
    }
}

const newPiece = (tetromino, color) => {
    let tetrominoN = 0;
    return {
        tetromino,
        tetrominoN,
        activeTetromino: tetromino[tetrominoN],
        x: 3,
        y: -2,
        color,
    };
}

function randomPiece() {
    const r = Math.floor(Math.random() * PIECES.length);
    return newPiece(PIECES[r][0], PIECES[r][1]);
}

let z = randomPiece();

function draw() {
    moveDown(z);
    // requestAnimationFrame(draw);
}

drawBoard();
setInterval(draw, 1000);
