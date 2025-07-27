const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const minWidth = 400;
  const minHeight = 300;
  canvas.width = Math.max(window.innerWidth * 0.8, minWidth);
  canvas.height = Math.max(window.innerHeight * 0.6, minHeight);
}

window.addEventListener("load", () => {
  resizeCanvas();
  startGame(); // this starts the snake after resizing
});
window.addEventListener("resize", resizeCanvas);

// move game setup into startGame()
function startGame() {
  const gridSize = 20;
  let snake = [{ x: 160, y: 200 }];
  let direction = { x: gridSize, y: 0 };
  let food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
  let score = 0;

  document.addEventListener("keydown", changeDirection);

  function changeDirection(e) {
    const key = e.key;
    if (key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
    if (key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
    if (key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
    if (key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
  }

  function drawSnake() {
    ctx.fillStyle = "#4CAF50";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
  }

  function drawFood() {
    ctx.fillStyle = "#FF6347";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
  }

  function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("score").innerText = "Score: " + score;
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
      };
    } else {
      snake.pop();
    }

    if (
      head.x < 0 || head.x >= canvas.width ||
      head.y < 0 || head.y >= canvas.height ||
      snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
      alert("Game Over! Your score was: " + score);
      snake = [{ x: 160, y: 200 }];
      direction = { x: gridSize, y: 0 };
      score = 0;
      document.getElementById("score").innerText = "Score: 0";
    }
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    update();
  }

  setInterval(gameLoop, 150);
}
