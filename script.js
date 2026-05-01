alert("You are cute😍😘💕😁👍");
// ================= CANVAS =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

// ================= UI =================
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const finalText = document.getElementById("finalText");
const scoreDisplay = document.getElementById("score");

// ================= IMAGES =================
const playerImg = new Image();
playerImg.src = "player.png";

const gfImg = new Image();
gfImg.src = "gf.png";

const bambooImg = new Image();
bambooImg.src = "bamboo.png";

// ================= SOUNDS =================
const flapSound = new Audio("flap.mp3");
const winSound = new Audio("win.mp3");

// ================= GAME STATE =================
let gameRunning = false;
let gameOver = false;
let hugging = false;
let score = 0;

// ================= PLAYER =================
let player;

// ================= GAME DATA =================
let pipes;
let frame;
let pipeSpeed;

// ================= PHYSICS =================
let gravity = 0.22;
let jump = -5.5;
let maxFall = 5;

// ================= GF =================
let gf;

// ================= CLOUDS =================
let clouds = [];

// ================= INIT =================
function init() {
    player = {
        x: 80,
        y: 300,
        width: 50,
        height: 50,
        velocity: 0
    };

    pipes = [];
    frame = 0;
    score = 0;
    pipeSpeed = 1.2;

    gameOver = false;
    hugging = false;

    gf = {
        x: 2800,
        y: 250,
        width: 60,
        height: 60
    };

    clouds = [
        { x: 100, y: 100 },
        { x: 250, y: 200 }
    ];

    scoreDisplay.innerText = score;
}

// ================= START GAME =================
function startGame() {
    console.log("Game Started");

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    init();
    gameRunning = true;
}

// ================= RESTART =================
function restartGame() {
    gameOverScreen.classList.add("hidden");

    init();
    gameRunning = true;
}

// ================= EVENTS =================
playBtn.addEventListener("click", startGame);
playBtn.addEventListener("touchstart", startGame);

restartBtn.addEventListener("click", restartGame);
restartBtn.addEventListener("touchstart", restartGame);

// ================= CONTROLS =================
function flap() {
    if (!gameRunning || gameOver) return;

    player.velocity = jump;

    flapSound.currentTime = 0;
    flapSound.play();
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// ================= CREATE PIPE =================
function createPipe() {
    let gap = 180;
    let gapY = Math.random() * (canvas.height - gap - 100) + 50;

    pipes.push({
        x: canvas.width + 100,
        width: 60,
        gapY: gapY,
        gapHeight: gap,
        passed: false
    });
}

// ================= UPDATE =================
function update() {
    if (!gameRunning) return;
    if (gameOver && !hugging) return;

    frame++;

    // PLAYER
    player.velocity += gravity;
    if (player.velocity > maxFall) player.velocity = maxFall;
    player.y += player.velocity;

    // PIPES
    if (frame % 140 === 0) createPipe();

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // SCORE
        if (!pipe.passed && pipe.x < player.x) {
            pipe.passed = true;
            score++;
            scoreDisplay.innerText = score;

            pipeSpeed += 0.05;
        }

        // COLLISION
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

    // WALL COLLISION
    if (!hugging && (player.y < 0 || player.y + player.height > canvas.height)) {
        endGame(false);
    }

    // MOVE GF
    gf.x -= pipeSpeed;

    // WIN
    if (
        !hugging &&
        player.x < gf.x + gf.width &&
        player.x + player.width > gf.x &&
        player.y < gf.y + gf.height &&
        player.y + player.height > gf.y
    ) {
        hugging = true;
        winSound.play();
        endGame(true);
    }

    // HUG ANIMATION
    if (hugging) {
        player.x += (gf.x - player.x) * 0.05;
        player.y += (gf.y - player.y) * 0.05;
    }

    // CLOUDS
    clouds.forEach(c => {
        c.x -= 0.5;
        if (c.x < -50) c.x = canvas.width;
    });
}

// ================= DRAW =================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // CLOUDS
    ctx.fillStyle = "white";
    clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });

    // PIPES
    pipes.forEach(pipe => {
        ctx.drawImage(bambooImg, pipe.x, 0, pipe.width, pipe.gapY);
        ctx.drawImage(bambooImg, pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, canvas.height);
    });

    // GF
    ctx.drawImage(gfImg, gf.x, gf.y, gf.width, gf.height);

    // PLAYER
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// ================= END GAME =================
function endGame(win) {
    gameOver = true;
    gameRunning = false;

    setTimeout(() => {
        gameOverScreen.classList.remove("hidden");
        finalText.innerText = win ? "❤️ You Won ❤️" : "Game Over";
    }, 800);
}

// ================= LOOP =================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
