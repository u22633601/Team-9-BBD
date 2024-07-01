import {Ball} from '../MazeLogic/Ball';

//var GamePiece;
var Obstacles = [];
var testWall;
var testWall2;
var ball;

function startGame() {
    //GameArea.start();
    //GamePiece = new createWall(30, 30, "blue", 10, 120);
    //GamePiece = new createPlayer(60, 60, 15, 0, 2 * Math.PI, "blue");
    testWall = new createWall(30, 90, "red", 70, 90);
    testWall2 = new createWall(30, 90, "red", 200, 90);
    ball = new Ball(90,90,20);
    GameArea.start();
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
    this.update = function(){
        ctx = GameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
        ctx.fillStyle = color;
        ctx.fill();
    }
  }
  
  function renderBall(x,y,radius,color){
    ctx = GameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2* Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
  }

  function updateGameArea() {
    GameArea.clear();
    //GamePiece.update();
    renderBall(ball.x, ball.y, ball.radius, "red");
    testWall.update();
    testWall2.update();
  }