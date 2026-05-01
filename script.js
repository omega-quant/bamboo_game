alert("You are cute😍😘💕😁👍");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

// UI
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const finalText = document.getElementById("finalText");

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

let gravity = 0.15;   // smoother falling
let jump = -2.2;      // easier control
let maxFall = 3.5;    // prevent fast drop
// INIT
function init() {
    player = { x: 80, y: 300, width: 50, height: 50, velocity: 0 };
    pipes = [];
    frame = 0;
    score = 0;
    pipeSpeed = 0.9;
    gameOver = false;
    hugging = false;

    gf = { x: 2800, y: 250, width: 60, height: 60 };

    scoreDisplay.innerText = score;
}

// PLAY BUTTON (FIXED)
playBtn.onclick = function () {
    startScreen.style.display = "none";
    init();
    gameRunning = true;
};

// RESTART
restartBtn.onclick = function () {
    gameOverScreen.style.display = "none";
    init();
    gameRunning = true;
};

// TAP CONTROL
document.addEventListener("click", () => {
    if (!gameRunning || gameOver) return;
    player.velocity = jump;
});

// CREATE PIPE
function createPipe() {
    let gap = 240; // 🔥 bigger gap (easy to pass)
    let gapY = Math.random() * (canvas.height - gap - 120) + 60;

    pipes.push({
        x: canvas.width,
        width: 1000, // 🔥 thicker bamboo (visible + fair)
        gapY: gapY,
        gapHeight: gap,
        passed: false
    });
}
// UPDATE
function update() {
    if (!gameRunning) return;
    if (gameOver && !hugging) return;

    frame++;

    player.velocity += gravity;

if (player.velocity > maxFall) {
    player.velocity = maxFall;
}

player.y += player.velocity;
    if (frame % 140 === 0) createPipe();

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (!pipe.passed && pipe.x + pipe.width < player.x) {
            pipe.passed = true;
            score++;
            scoreDisplay.innerText = score;
            pipeSpeed += 0.05;
        }

        if (
            !hugging &&
            player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.gapY ||
             player.y + player.height > pipe.gapY + pipe.gapHeight)
        ) {
            endGame(false);
        }
    });

    if (!hugging && (player.y < 0 || player.y + player.height > canvas.height)) {
        endGame(false);
    }

    gf.x -= pipeSpeed;

    if (
        !hugging &&
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
        ctx.drawImage(bambooImg, pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, canvas.height);
    });

    ctx.drawImage(gfImg, gf.x, gf.y, gf.width, gf.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// END GAME
function endGame(win) {
    gameOver = true;
    gameRunning = false;

    setTimeout(() => {
        gameOverScreen.style.display = "flex";
        finalText.innerText = win ? "❤️ You Won ❤️" : "Game Over";
    }, 800);
}

// LOOP
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
