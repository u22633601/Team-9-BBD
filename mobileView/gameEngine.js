var Balls = [];
var Obstacles = [];
var testWall;
var testWall2;
var gameMaze;
var gameHole;


function startGame(balls, maze, hole) {
	gameMaze = maze;

	removeOtherScreens();

	GameArea.start();

	for(let i = 0; i < balls.length; i++){
		Balls.push(new createPlayer(balls[i].x, balls[i].y, balls[i].radius, balls[i].team == "red" ? "#ff0000" : "#0000ff"));
	}
	
	gameHole = new createPlayer(hole.x, hole.y, hole.radius, "#2f2f2f");

	for(let i = 0; i < gameMaze.map.length; i++){
		for(let j = 0; j < gameMaze.map[i].length; j++){
			if(gameMaze.map[i][j] == 1){
				Obstacles.push(new createWall(i*gameMaze.wallSize, j*gameMaze.wallSize, gameMaze.wallSize, "#2f2f2f"));
			}
		}
	}

  window.requestAnimationFrame(updateGameArea);
}

function removeOtherScreens() {
	// Hide all screens
	document.getElementById('login-screen').classList.add('hidden');
	document.getElementById('lobby-screen').classList.add('hidden');
	document.getElementById('waiting-screen').classList.add('hidden');
}

function resizeCanvas() {
	// Calculate 100vmin based on the current viewport size
	let vmin = Math.min(window.innerWidth, window.innerHeight);

	// Set the canvas element's width and height attributes
	GameArea.canvas.width = vmin;
	GameArea.canvas.height = vmin;

	// Also set the canvas CSS width and height to ensure it displays correctly
	GameArea.canvas.style.width = `${vmin}px`;
	GameArea.canvas.style.height = `${vmin}px`;
}
  
var GameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.classList.add('game-canvas');

		resizeCanvas();

		window.addEventListener('resize', resizeCanvas);

		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function everyinterval(n) {
	if ((GameArea.frameNo / n) % 1 == 0) {return true;}
	return false;
}

// function renderBall(x,y,radius,color){
//   ctx = GameArea.context;
//       ctx.beginPath();
//       ctx.arc(this.x/100 * GameArea.canvas.width, this.y/100 * GameArea.canvas.width, this.radius/100 * GameArea.canvas.width, 0, 2* Math.PI);
//       ctx.fillStyle = color;
//       ctx.fill();
// }

function createWall( x, y, size, color) {
	this.size = size;
	this.x = x;
	this.y = y;

	this.canvasX = Math.round(this.x/100 * GameArea.canvas.width);
	this.canvasY = Math.round(this.y/100 * GameArea.canvas.width);
	this.canvasSize = Math.round(this.size/100 * GameArea.canvas.width)+1;

	this.update = function(){
		ctx = GameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.canvasX , this.canvasY, this.canvasSize, this.canvasSize);
		// ctx.fillRect(this.x/100 * GameArea.canvas.width, this.y/100 * GameArea.canvas.width, this.size/100 * GameArea.canvas.width, this.size/100 * GameArea.canvas.width);
	}
}

function createPlayer(x,y,radius,color){
	this.x = x;
	this.y = y;
	this.radius = radius;
  	this.canvasRadius = Math.round(this.radius/100 * GameArea.canvas.width);

	this.update = function(){
		ctx = GameArea.context;
		ctx.beginPath();
		ctx.arc(Math.round((this.x)/100 * GameArea.canvas.width), ((this.y)/100 * GameArea.canvas.width), this.canvasRadius, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
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

function updateBallPositions(balls) {
	for(let i = 0; i < balls.length; i++){
		Balls[i].x = balls[i].x;
		Balls[i].y = balls[i].y;
	}
}

function updateGameArea() {
  // console.time('updateGameArea Execution Time');

	GameArea.clear();
	gameHole.update();
	
	for(i = 0; i < Obstacles.length; i++){
		Obstacles[i].update();
	}

	for(i = 0; i < Balls.length; i++){
		Balls[i].update();
	}
  // console.timeEnd('updateGameArea Execution Time');

  window.requestAnimationFrame(updateGameArea);


}

//module.exports = startGame;