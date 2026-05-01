// ================= CANVAS =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 600;

// ================= IMAGES =================
const playerImg = new Image();
playerImg.src = "player.png";

const gfImg = new Image();
gfImg.src = "gf.png";

const bambooImg = new Image();
bambooImg.src = "bamboo.png";

// ================= PLAYER =================
let player = {
    x: 80,
    y: 300,
    width: 50,
    height: 50,
    velocity: 0,
    rotation: 0
};

// ================= PHYSICS =================
let gravity = 0.22;
let jump = -5.5;
let maxFall = 5;

// ================= GAME DATA =================
let pipes = [];
let frame = 0;
let gameOver = false;
let hugging = false;

// ================= SPEED =================
let pipeSpeed = 1.2;

// ================= GF =================
let gf = {
    x: 2800,
    y: 250,
    width: 60,
    height: 60
};

// ================= CONTROLS =================
function flap() {
    if (!gameOver) {
        player.velocity = jump;
    }
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// ================= CREATE PIPE =================
function createPipe() {
    let gap = 190;
    let gapY = Math.random() * (canvas.height - gap - 100) + 50;

    pipes.push({
        x: canvas.width + 100,
        width: 60,
        gapY: gapY,
        gapHeight: gap
    });
}

// ================= DRAW FUNCTIONS =================
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

    player.rotation = player.velocity * 0.04;
    ctx.rotate(player.rotation);

    ctx.drawImage(playerImg, -25, -25, player.width, player.height);

    ctx.restore();
}

function drawGF() {
    ctx.drawImage(gfImg, gf.x, gf.y, gf.width, gf.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        // top
        ctx.drawImage(bambooImg, pipe.x, 0, pipe.width, pipe.gapY);

        // bottom
        ctx.drawImage(
            bambooImg,
            pipe.x,
            pipe.gapY + pipe.gapHeight,
            pipe.width,
            canvas.height
        );
    });
}

// ================= UPDATE =================
function update() {
    if (gameOver && !hugging) return;

    frame++;

    // GRAVITY
    player.velocity += gravity;
    if (player.velocity > maxFall) player.velocity = maxFall;
    player.y += player.velocity;

    // CREATE PIPES
    if (frame % 140 === 0) {
        createPipe();
    }

    // MOVE PIPES + COLLISION
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (
            !hugging &&
            player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.gapY ||
             player.y + player.height > pipe.gapY + pipe.gapHeight)
        ) {
            gameOver = true;
        }
    });

    // WALL COLLISION
    if (!hugging && (player.y < 0 || player.y + player.height > canvas.height)) {
        gameOver = true;
    }

    // MOVE GF
    gf.x -= pipeSpeed;

    // WIN CONDITION
    if (
        !hugging &&
        player.x < gf.x + gf.width &&
        player.x + player.width > gf.x &&
        player.y < gf.y + gf.height &&
        player.y + player.height > gf.y
    ) {
        hugging = true;
        gameOver = true;
    }

    // HUG ANIMATION
    if (hugging) {
        player.x += (gf.x - player.x) * 0.05;
        player.y += (gf.y - player.y) * 0.05;
    }
}

// ================= DRAW =================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPipes();
    drawGF();
    drawPlayer();

    // GAME OVER TEXT
    if (gameOver && !hugging) {
        ctx.fillStyle = "red";
        ctx.font = "28px Arial";
        ctx.fillText("Game Over", 90, 300);
    }

    // WIN TEXT
    if (hugging) {
        ctx.fillStyle = "red";
        ctx.font = "24px Arial";
        ctx.fillText("❤️ Hug Complete ❤️", 50, 100);
    }
}

// ================= GAME LOOP =================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
