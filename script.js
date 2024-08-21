let highscore = 0;
function main() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  
  const dinoSize = 160; // dino is a square, no need for separate width and height
  
  const dinoStanding1 = new Image();
  dinoStanding1.src = "dino-standing 1.png";
  const dinoStanding2 = new Image();
  dinoStanding2.src = "dino-standing 2.png";
  const dinoShort1 = new Image();
  dinoShort1.src = "dino-short 1.png";
  const dinoShort2 = new Image();
  dinoShort2.src = "dino-short 2.png";
  
  let score = 0;
  let dead = false;
  let dinoY = 200;
  let dinoX = 90;
  let jumpState = "start";
  let isJumping = false;
  let jumpWait = 5;
  let movingLeft = false;
  let movingRight = false;
  let isShort = false;
  let dinoFrame = 0; // 0 for dinoStanding1, 1 for dinoStanding2, 2 for dinoShort1, 3 for dinoShort2
  
  class FakeCactus {
    constructor() {
      this.y = 350;
      this.x = 1000;
      this.speed = 10;
    }
    update() {
      this.x -= this.speed;
      if (this.x < -50) {
        this.x = 1000;
      }
    }
    draw() {
      ctx.font = "50px serif";
      ctx.fillText("13", this.x, this.y);
    }
  }
  
  function drawDino() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    if (isShort == true && dinoFrame < 2) {
      dinoFrame += 2;
    } else if (isShort == false && dinoFrame >= 2) {
      dinoFrame -= 2;
    }
    if (dinoX != 90 && isJumping == false) {
      dinoX -= 1;
    }
    if (dinoFrame == 0) {
      ctx.drawImage(dinoStanding1, dinoX, dinoY, dinoSize, dinoSize);
      dinoFrame++
    } else if (dinoFrame == 1) {
      ctx.drawImage(dinoStanding2, dinoX, dinoY, dinoSize, dinoSize);
      dinoFrame--
    } else if (dinoFrame == 2) {
      ctx.drawImage(dinoShort1, dinoX, dinoY, dinoSize, dinoSize);
      dinoFrame++
    } else if (dinoFrame == 3) {
      ctx.drawImage(dinoShort2, dinoX, dinoY, dinoSize, dinoSize);
      dinoFrame--
    }
    if (dead == false) {
      window.requestAnimationFrame(drawDino)
    }
  }
  
  function jump() {
    if (isJumping == true) {
      if (dinoY <= 200 && dinoY > 60 && jumpState == "start") {
        dinoY -= 70;
        dinoX += 40;
      } else if (dinoY >= 60 && dinoY < 200 && jumpState == "end") {
        dinoY += 70;
      } else if (dinoY == 60 && jumpState == "start" && jumpWait > 0) {
        jumpWait -= 1;
      } else if (dinoY == 200 && jumpState == "end") {
        isJumping = false;
        jumpState = "start";
      } else if (jumpWait == 0 && jumpState == "start") {
        jumpState = "end";
        jumpWait = 5;
      }
    }
    if (dead == false) {
      window.requestAnimationFrame(jump)
    }
  }
  
  function drawScore() {
    score++
    if (score > highscore) {
      highscore = score
    }
    ctx.font = "20px serif";
    ctx.fillText("Score: " + score, 1000, 50);
    ctx.fillText("Highscore: " + highscore, 1000, 80);
    if (dead == false) {
      window.requestAnimationFrame(drawScore)
    }
  }
  
  function moveDino() {
    if (dinoX > 90 && movingLeft == true && isJumping == false) {
      dinoX -= 10;
    } else if (dinoX < 880 && movingRight == true && isJumping == false) {
      dinoX += 10;
    } else if (dinoX <= 90) {
      movingLeft = false;
      dinoX = 90;
    } else if (dinoX >= 880) {
      movingRight = false;
      dinoX = 880;
    }
    if (dead == false) {
      window.requestAnimationFrame(moveDino)
    }
  }
  
  window.addEventListener("keydown", (event) => {
    if (event.key == "ArrowDown") {
      isShort = true;
    } else if (event.key == "ArrowUp" || event.key == " ") {
      if (isShort == false) {
        isJumping = true;
      }
    } else if (event.key == "ArrowLeft") {
      movingLeft = true;
    } else if (event.key == "ArrowRight") {
      movingRight = true;
    }
  });
  
  window.addEventListener("keyup", (event) => {
    if (event.key == "ArrowDown") {
      isShort = false;
    } else if (event.key == "ArrowLeft") {
      movingLeft = false;
    } else if (event.key == "ArrowRight") {
      movingRight = false;
    }
  });
  
  let cactus = new FakeCactus(score);
  
  function makeObstacles() {
    cactus.update();
    cactus.draw();
    if (dead == false) {
      window.requestAnimationFrame(makeObstacles);
    }
  }

  function resetPos() {
    dinoY = 200;
    dinoX = 90;
    cactus.x = 1000;
  }
  
  function checkCollision() {
    console.log(dinoX)
    console.log(cactus.x)
    if (cactus.x >= dinoX - 40 && cactus.x <= dinoX + 70 && isJumping == false) {
      dead = true;
      retry = prompt("You died! Your score was " + score + "\nTry again? (y/n)");
      if (retry == "y") {
        resetPos()
        main();
      } 
    }
    if (dead == false) {
      window.requestAnimationFrame(checkCollision);
    }
  }
  
  Promise.all([
    new Promise((resolve) => { dinoStanding1.onload = resolve; }),
    new Promise((resolve) => { dinoStanding2.onload = resolve; }),
    new Promise((resolve) => { dinoShort1.onload = resolve; }),
    new Promise((resolve) => { dinoShort2.onload = resolve; })
  ]).then(() => {
    if (dead == false) {
      window.requestAnimationFrame(jump);
      window.requestAnimationFrame(drawDino);
      window.requestAnimationFrame(drawScore);
      window.requestAnimationFrame(makeObstacles);
      window.requestAnimationFrame(checkCollision);  
      window.requestAnimationFrame(moveDino);
    }
  });
}
main();
