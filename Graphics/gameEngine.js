var GamePiece;
var Obstacles = [];
var testWall;
var testWall2;
var maze;

function startGame() {
    //GameArea.start();
    //GamePiece = new createWall(30, 30, "blue", 10, 120);
    GamePiece = new createPlayer(60, 60, 15, 0, 2 * Math.PI, "blue");
    //testWall = new createWall(30, 90, "red", 70, 90);
    //testWall2 = new createWall(30, 90, "red", 200, 90);
    maze = generateMaze(720,600);
    for(let i = 0; i < maze.length; i++){
      for(let j = 0; j < maze[i].length; j++){
        if(maze[i][j] == 1){
          Obstacles.push(new createWall(10, 10, "red", i, j));
        }
      }
    }
    GameArea.start();
    //console.log(maze);
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
  this.velocityX = 0;
  this.velocityY = 0;
  this.update = function(){
      ctx = GameArea.context;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
      ctx.fillStyle = color;
      ctx.fill();
  }
  this.newPos = function(){
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  this.addForce = function(forceX, forceY){
    this.velocityX += forceX;
    this.velocityY += forceY;
  }
}

function applyForce(forceX, forceY) {
  this.velocityX += forceX;
  this.velocityY += forceY;
}

function updatePosition() {
  this.x += this.velocityX;
  this.y += this.velocityY;
}

function moveup() {
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
}

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
  GamePiece.newPos();
  //testWall.update();
  //testWall2.update();
  for(i = 0; i < Obstacles.length; i++){
    Obstacles[i].update();
  }
  
}