const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let food = {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
};

let snake = [
    { x: 200, y: 100 },
];
let score = 0;
let direction = "RIGHT";
let game, countDown;
let speed;
let isObstacles, isPortal
let obsticales1 = [
    { x: 40, y: 40 },
    { x: 40, y: 80 }, { x: 40, y: 100 }, { x: 40, y: 120 }, { x: 40, y: 140 },
    { x: 80, y: 40 }, { x: 100, y: 40 }, { x: 120, y: 40 }, { x: 140, y: 40 },
]
let obsticales2 = [
    { x: 360, y: 360 },
    { x: 360, y: 340 }, { x: 360, y: 320 }, { x: 360, y: 300 }, { x: 360, y: 260 },
    { x: 340, y: 360 }, { x: 320, y: 360 }, { x: 300, y: 360 }, { x: 260, y: 360 },
]
let obsticales3 = [
    { x: 180, y: 180 },
    { x: 180, y: 220 },
    { x: 220, y: 180 },
    { x: 220, y: 220 },
]
let portal = [
    { x: 60, y: 320 },
    { x: 320, y: 60 },
];

let isPaused = false;
document.addEventListener("keydown", pausePlay)
function pausePlay(e) {
    if (e.key === "p" || e.key === "P") {
        isPaused = !isPaused;
        document.getElementById("timer").innerText = isPaused ? "⏸ Game Paused" : "▶️ Game Running";
    }
}

function drawObstacles() {
    if (isObstacles) {
        ctx.fillStyle = "black";
        for (let i = 0; i < obsticales1.length; i++) {
            ctx.fillRect(obsticales1[i].x, obsticales1[i].y, 20, 20);
        }
        for (let i = 0; i < obsticales2.length; i++) {
            ctx.fillRect(obsticales2[i].x, obsticales2[i].y, 20, 20);
        }
        for (let i = 0; i < obsticales3.length; i++) {
            ctx.fillRect(obsticales3[i].x, obsticales3[i].y, 20, 20);
        }
    }
}

function drawPortals() {
    if (isPortal) {
        ctx.save();
        ctx.fillStyle = "purple";
        ctx.shadowColor = "magenta";
        ctx.shadowBlur = 20;

        for (let i = 0; i < portal.length; i++) {
            ctx.fillRect(portal[i].x, portal[i].y, 20, 20);
        }

        ctx.restore();
    }
}

function updateFood() {
    const head = snake[0];
    if (head.x == food.x && head.y == food.y) {

        updateScore()

        food = {
            x: Math.floor(Math.random() * 20) * 20,
            y: Math.floor(Math.random() * 20) * 20
        };
    } else {
        snake.pop();
    }
}

function updateScore() {
    score++;
    document.getElementById("scoreDisplay").innerText = "Score: " + score;

    let highScore = localStorage.getItem("highScore") || 0;

    if (score > highScore) {
        localStorage.setItem("highScore", score);
        document.getElementById("highScoreDisplay").innerText = "H SCORE : " + score;
    } else {
        document.getElementById("highScoreDisplay").innerText = "H SCORE : " + highScore;
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        clearAllIntervals("💥 Collided with wall");
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearAllIntervals("💥 Collided with body");
        }
    }

    if (isObstacles) {
        for (let i = 0; i < obsticales1.length; i++) {
            if (head.x == obsticales1[i].x && head.y == obsticales1[i].y) clearAllIntervals("💥 Collided with Obstacle");
        }
        for (let i = 0; i < obsticales2.length; i++) {
            if (head.x == obsticales2[i].x && head.y == obsticales2[i].y) clearAllIntervals("💥 Collided with Obstacle");
        }
        for (let i = 0; i < obsticales3.length; i++) {
            if (head.x == obsticales3[i].x && head.y == obsticales3[i].y) clearAllIntervals("💥 Collided with Obstacle");
        }
    }

    if (isPortal) {
        if (head.x == portal[0].x && head.y == portal[0].y) {
            head.x = portal[1].x
            head.y = portal[1].y
        }else if (head.x == portal[1].x && head.y == portal[1].y) {
            head.x = portal[0].x
            head.y = portal[0].y
        }
    }

}

document.addEventListener("keydown", changeDirection);
document.getElementById("start").addEventListener("click", startGame);

function changeDirection(e) {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        let alpha = 1 - i * 0.05;
        ctx.fillStyle = `rgba(255, 0, 0, ${i === 0 ? 1 : alpha})`;
        ctx.fillRect(snake[i].x, snake[i].y, 20, 20);
    }

    ctx.fillStyle = "blue";
    ctx.fillRect(food.x, food.y, 20, 20);

    drawObstacles()
    drawPortals()

}

function moveSnake() {
    if (isPaused) return;

    const head = { ...snake[0] };

    if (direction === "RIGHT") head.x += 20;
    else if (direction === "LEFT") head.x -= 20;
    else if (direction === "UP") head.y -= 20;
    else if (direction === "DOWN") head.y += 20;

    snake.unshift(head);

    checkCollision()

    updateFood()
}

function startGame() {
    // Reset values
    snake = [{ x: 100, y: 100 }];
    score = 0;
    direction = "RIGHT";
    document.getElementById("scoreDisplay").innerText = "Score: 0";
    isObstacles = document.getElementById("obstacles").checked
    isPortal = document.getElementById("portals").checked

    // Set time from dropdown
    let selectedTime = parseInt(document.getElementById("timeSelect").value) || 10;
    document.getElementById("timer").innerText = "⏱ Time Left : " + selectedTime + " sec";

    let Selectspeed = parseInt(document.getElementById("Selectspeed").value) || 300;

    let speedtype = () => {
        if (Selectspeed == 400) return "slow";
        else if (Selectspeed == 200) return "standard";
        else if (Selectspeed == 100) return "fast";
        else return "standard";
    };

    document.getElementById("speedLevel").innerText = "Speed level: " + speedtype();


    // Clear previous intervals
    clearAllIntervals();

    // Start game loop
    game = setInterval(() => {
        moveSnake();
        drawSnake();
    }, Selectspeed); // You can link this to speed dropdown too later

    // Start countdown
    countDown = setInterval(() => {
        if (isPaused) return; // ⏸ Don't reduce time if paused

        selectedTime--;
        document.getElementById("timer").innerText = "⏱ Time Left : " + selectedTime + " sec";

        if (selectedTime === 0) {
            clearAllIntervals();
        }
    }, 1000);

}

function clearAllIntervals(reason = "game over") {
    document.getElementById("timer").innerText = "⏱ Time Left : " + reason;
    clearInterval(game);
    clearInterval(countDown);
}
