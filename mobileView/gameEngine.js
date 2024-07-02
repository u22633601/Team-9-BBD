var GamePiece;
var Obstacles = [];
var testWall;
var testWall2;
var gameMaze;

function startGame() {
  removeOtherScreens();
    //GameArea.start();
    //GamePiece = new createWall(30, 30, "blue", 10, 120);
    GamePiece = new createPlayer(60, 60, 15, 0, 2 * Math.PI, "blue");
    //testWall = new createWall(30, 90, "red", 70, 90);
    //testWall2 = new createWall(30, 90, "red", 200, 90);
    gameMaze = generateMaze(720,600);
    for(let i = 0; i < gameMaze.length; i++){
      for(let j = 0; j < gameMaze[i].length; j++){
        if(gameMaze[i][j] == 1){
          Obstacles.push(new createWall(10, 10, "red", i, j));
        }
      }
    }
    GameArea.start();
    //console.log(gameMaze);
  }

  function removeOtherScreens() {
    // Hide all screens
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('waiting-screen').classList.add('hidden');

    // Show the game canvas
    //GameArea.canvas.classList.remove('hidden');

    // Optionally, you can adjust the canvas size to fill the screen
    //GameArea.canvas.style.width = '100vw';
    //GameArea.canvas.style.height = '100vh';
}
  
var GameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 720;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function everyinterval(n) {
  if ((GameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function renderBall(x,y,radius,color){
  ctx = GameArea.context;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2* Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
}

function createWall(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = GameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function createPlayer(x,y,radius,startAngle,endAngle,color){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.startAngle = startAngle;
  this.endAngle = endAngle;
  //this.velocityX = 0;
  //this.velocityY = 0;
  this.update = function(){
      ctx = GameArea.context;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
      ctx.fillStyle = color;
      ctx.fill();
  }
  /*this.newPos = function(){
    this.x += this.velocityX;
    this.y += this.velocityY;
    if(this.x >= 720){
      this.x = 720;
      this.velocityX = 0;
    }
    if(this.x < 0){
      this.x = 0;
      this.velocityX = 0;
    }
    if(this.y >= 600){
      this.y = 600;
      this.velocityY = 0;
    }
    if(this.y < 0){
      this.y = 0;
      this.velocityY = 0;
    }
  }

  this.addForce = function(forceX, forceY){
    this.velocityX += forceX;
    this.velocityY += forceY;
  }*/

  
}

/*function handleCollision(){
  // Getting the coordinates of the ball's edges
  const ballTopCoords = GamePiece.y - GamePiece.radius;
  const ballBottomCoords = GamePiece.y + GamePiece.radius;
  const ballLeftCoords = GamePiece.x - GamePiece.radius;
  const ballRightCoords = GamePiece.x + GamePiece.radius;

  // Getting the cell values of the maze at the ball's edges
  const mazeAbove = gameMaze[ballTopCoords[0]][ballTopCoords[1]];
  const mazeBelow = gameMaze[ballBottomCoords[0]][ballBottomCoords[1]];
  const mazeLeft = gameMaze[ballLeftCoords[0]][ballLeftCoords[1]];
  const mazeRight = gameMaze[ballRightCoords[0]][ballRightCoords[1]];

  // Handling collisions with the maze walls (1 == wall, 0 == path)
  // - For this collision handling, walls are considered to be solid and should be wider than the ball
  if (mazeAbove === 1) {
    GamePiece.velocityY = 0;
    GamePiece.y = GamePiece.radius;
  }
  if (mazeBelow === 1) {
    GamePiece.velocityY = 0;
    GamePiece.y = gameMaze.length - GamePiece.radius;
  }
  if (mazeLeft === 1) {
    GamePiece.velocityX = 0;
    GamePiece.x = GamePiece.radius;
  }
  if (mazeRight === 1) {
    gamePiece.velocityX = 0;
    gamePiece.x = gameMaze[0].length - gamePiece.radius;
  }
}*/

function applyForce(forceX, forceY) {
  this.velocityX += forceX;
  this.velocityY += forceY;
}

function updatePosition() {
  this.x += this.velocityX;
  this.y += this.velocityY;
}

/*function moveup() {
  //myGamePiece.speedY -= 1;
  GamePiece.addForce(0,-1);
}

function movedown() {
  //myGamePiece.speedY += 1;
  GamePiece.addForce(0,1);
}

function moveleft() {
  //myGamePiece.speedX -= 1;
  GamePiece.addForce(-1,0);
}

function moveright() {
  //myGamePiece.speedX += 1;
  GamePiece.addForce(1,0);
}*/

function generateMaze(sizeX, sizeY) {
  // Stub: returns box maze (walls on the perimeter, path in the middle)
  const maze = [];

  for (let i = 0; i < sizeX; i++) {
    maze.push([]);
    for (let j = 0; j < sizeY; j++) {
      if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1) {
        maze[i].push(1);
      } else {
        maze[i].push(0);
      }
    }
  }
  return maze;
}


function updateGameArea() {
  GameArea.clear();
  GamePiece.update();
  //GamePiece.newPos();
  //handleCollision();
  //testWall.update();
  //testWall2.update();
  for(i = 0; i < Obstacles.length; i++){
    Obstacles[i].update();
  }
  
}

//module.exports = startGame;