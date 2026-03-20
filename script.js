const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const agentSize = 30;
const enemySize = 30;
const bulletSize = 5;

let agent = { x: 50, y: 50, speed: 5, bullets: [] };
let enemies = [
    { x: 400, y: 200, alive: true },
    { x: 600, y: 400, alive: true },
    { x: 500, y: 100, alive: true },
];

let keys = {};
let shootCooldown = 0;

// Event listeners
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Shoot bullets
window.addEventListener("keydown", e => {
    if (e.key === " " && shootCooldown <= 0) {
        agent.bullets.push({ x: agent.x + agentSize/2 - bulletSize/2, y: agent.y, dy: -10 });
        shootCooldown = 15; // cooldown frames
    }
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game
function update() {
    // Agent movement
    if (keys["ArrowUp"]) agent.y -= agent.speed;
    if (keys["ArrowDown"]) agent.y += agent.speed;
    if (keys["ArrowLeft"]) agent.x -= agent.speed;
    if (keys["ArrowRight"]) agent.x += agent.speed;

    // Keep agent inside canvas
    agent.x = Math.max(0, Math.min(canvas.width - agentSize, agent.x));
    agent.y = Math.max(0, Math.min(canvas.height - agentSize, agent.y));

    // Update bullets
    agent.bullets.forEach((b, i) => {
        b.y += b.dy;
        // Remove bullets off screen
        if (b.y < 0) agent.bullets.splice(i, 1);

        // Check collision with enemies
        enemies.forEach(enemy => {
            if (enemy.alive &&
                b.x < enemy.x + enemySize &&
                b.x + bulletSize > enemy.x &&
                b.y < enemy.y + enemySize &&
                b.y + bulletSize > enemy.y) {
                    enemy.alive = false;
                    agent.bullets.splice(i, 1);
            }
        });
    });

    if (shootCooldown > 0) shootCooldown--;

    // Check if all enemies are dead
    if (enemies.every(e => !e.alive)) {
        alert("All hostiles cleared! Mission success!");
        resetGame();
    }
}

// Reset game
function resetGame() {
    agent.x = 50;
    agent.y = 50;
    agent.bullets = [];
    enemies.forEach(enemy => enemy.alive = true);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw agent (FBI)
    ctx.fillStyle = "blue";
    ctx.fillRect(agent.x, agent.y, agentSize, agentSize);

    // Draw bullets
    ctx.fillStyle = "yellow";
    agent.bullets.forEach(b => ctx.fillRect(b.x, b.y, bulletSize, bulletSize));

    // Draw enemies
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        if (enemy.alive) ctx.fillRect(enemy.x, enemy.y, enemySize, enemySize);
    });
}

gameLoop();
