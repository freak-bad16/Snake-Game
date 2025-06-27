const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ctx.fillStyle = "red" ;
// ctx.fillRect(10,10,20,20)

let food = {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
}

let snake = [
    { x: 100, y: 100 },
    { x: 80, y: 100 },
    { x: 60, y: 100 },
    { x: 40, y: 100 },
    { x: 20, y: 100 },
]

// for(let i =0;i<snake.length;i++){
//     if(i==0) ctx.fillStyle = "red";
//     else ctx.fillStyle = "pink";

//     ctx.fillRect(snake[i].x , snake[i].y ,20 ,20)
// }

let score = 0;

let direction = "RIGHT"

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";

    // console.log(direction);

}


function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        if (i == 0) ctx.fillStyle = "red";
        else ctx.fillStyle = "deeppink";

        ctx.fillRect(snake[i].x, snake[i].y, 20, 20)

        ctx.fillStyle = "blue"
        ctx.fillRect(food.x, food.y, 20, 20)
    }
}

function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "RIGHT") head.x += 20;
    else if (direction === "LEFT") head.x -= 20;
    else if (direction === "UP") head.y -= 20;
    else if (direction === "DOWN") head.y += 20;

    snake.unshift(head);

    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        alert("Game Over: Wall hit");
        clearInterval(game)
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            alert("Game Over: Snake hit itself");
            clearInterval(game);
        }
    }


    if (head.x == food.x && head.y == food.y) {
        score++;
        //console.log(score);
        document.getElementById("scoreDisplay").innerText = "Score: " + score;

        food = {
            x: Math.floor(Math.random() * 20) * 20,
            y: Math.floor(Math.random() * 20) * 20
        };
    }
    else snake.pop();
}

let game = setInterval(() => {
    moveSnake();
    drawSnake();
}, 200)