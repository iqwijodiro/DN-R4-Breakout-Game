const rulesBtn = document.querySelector('#rules-btn');
const closeBtn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');
const canvas = document.querySelector('#canvas'); //lienzo o canvas
const ctx = canvas.getContext('2d'); //contexto del canvas

let score = 0;

const bricksRows = 10;
const brickColumns = 5;

// detalles de la bola
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 12,
  speed: 4,
  dx: 4,
  dy: -4
};

// detalles de la paddle
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 100,
  height: 15,
  speed: 8,
  dx: 0
};

// detalles de los ladrillos
const brickInfo = {
  width: 70,
  height: 20,
  padding: 10,
  offsetX: 50,
  offsetY: 60,
  visible: true
};

const bricks = [];

// Crea los ladrillos
for (let i = 0; i < bricksRows; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumns; j++) {
    const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Dibuja la bola en el canva
function drawBall() {
  ctx.beginPath(); // Metodo de canvas 2d para comenzar el dibujo
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); // dibuja el movimiento de la bola
  ctx.fillStyle = '#2d2d2d';
  ctx.fill();
  ctx.closePath();
}

// dibuja la raqueta en el canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = '#00bf09';
  ctx.fill();
  ctx.closePath();
}

// Reporta el puntaje
function drawScore() {
  ctx.font = '20px Kurale';
  ctx.fillText(`Puntos: ${score}`, canvas.width - 100, 30);
}

// dibuja los ladrillos en el canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visible ? '#919191' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// controla la paddle en izq o der
function movePaddle() {
  paddle.x += paddle.dx;

  // Limites para el movimiento del paddle
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Mueve la bola en el canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Limites para la bola (lados)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // limites para la bola (arriba/abajo)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }


  // Contacto del paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.width &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Contacto con el ladrillo
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.width &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.height
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Si pierdes al golpear la parte inferior
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// Aumenta el contador
function increaseScore() {
  score++;

  if (score % (bricksRows * bricksRows) === 0) {
    showAllBricks();
  }
}

// Reaparecen los ladrillos
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Pintar en el canvas
function draw() {
  // Limpia el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// actualiza el canvas y la animation
function update() {
  movePaddle();
  moveBall();

  // dibuja todo el juevo
  draw();

  requestAnimationFrame(update);
}

update();

// Pulsado de teclas
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

// levante de las teclas
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

// Listeners para las teclas
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// panel de reglas
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
