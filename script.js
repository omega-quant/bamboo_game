const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

// UI
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const finalText = document.getElementById("finalText");
const jumpBtn = document.getElementById("jumpBtn");

// IMAGES
const playerImg = new Image();
playerImg.src = "player.png";

const gfImg = new Image();
gfImg.src = "gf.png";

const bambooImg = new Image();
bambooImg.src = "bamboo.png";

// GAME STATE
let gameRunning = false;
let gameOver = false;
let hugging = false;
let score = 0;

let player, pipes, frame, pipeSpeed, gf;

let gravity = 0.25;
let jump = -5;

// INIT
function init() {
    player = { x: 80, y: 300, width: 50, height: 50, velocity: 0 };
    pipes = [];
    frame = 0;
    score = 0;
    pipeSpeed = 2;
    gameOver = false;
    hugging = false;

    gf = { x: 2000, y: 250, width: 60, height: 60 };

    scoreDisplay.innerText = score;
}

// START
playBtn.onclick = () => {
    startScreen.classList.add("hidden");
    init();
    gameRunning = true;
};

// RESTART
restartBtn.onclick = () => {
    gameOverScreen.classList.add("hidden");
    init();
    gameRunning = true;
};

// CONTROL
function jumpAction() {
    if (!gameRunning || gameOver) return;
    player.velocity = jump;
}

document.addEventListener("click", jumpAction);
jumpBtn.addEventListener("click", jumpAction);

// CREATE PIPE
function createPipe() {
    let gap = 180;
    let gapY = Math.random() * (canvas.height - gap - 100) + 50;

    pipes.push({
        x: canvas.width,
        width: 80,   // ✅ FIXED thickness
        gapY: gapY,
        gapHeight: gap,
        passed: false
    });
}

// UPDATE
function update() {
    if (!gameRunning) return;

    frame++;

    player.velocity += gravity;
    player.y += player.velocity;

    if (frame % 100 === 0) createPipe();

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (!pipe.passed && pipe.x < player.x) {
            pipe.passed = true;
            score++;
            scoreDisplay.innerText = score;
        }

        // COLLISION
        if (
            player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.gapY ||
             player.y + player.height > pipe.gapY + pipe.gapHeight)
        ) {
            endGame(false);
        }
    });

    // FLOOR / CEILING
    if (player.y < 0 || player.y + player.height > canvas.height) {
        endGame(false);
    }

    // GF MOVEMENT
    gf.x -= pipeSpeed;

    if (
        player.x < gf.x + gf.width &&
        player.x + player.width > gf.x &&
        player.y < gf.y + gf.height &&
        player.y + player.height > gf.y
    ) {
        hugging = true;
        endGame(true);
    }

    if (hugging) {
        player.x += (gf.x - player.x) * 0.05;
        player.y += (gf.y - player.y) * 0.05;
    }
}

// DRAW
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pipes.forEach(pipe => {
        ctx.drawImage(bambooImg, pipe.x, 0, pipe.width, pipe.gapY);
        ctx.drawImage(
            bambooImg,
            pipe.x,
            pipe.gapY + pipe.gapHeight,
            pipe.width,
            canvas.height
        );
    });

    ctx.drawImage(gfImg, gf.x, gf.y, gf.width, gf.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// END GAME
function endGame(win) {
    gameOver = true;
    gameRunning = false;

    setTimeout(() => {
        gameOverScreen.classList.remove("hidden");
        finalText.innerText = win ? "❤️ You Won ❤️" : "Game Over";
    }, 500);
}

// LOOP
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
