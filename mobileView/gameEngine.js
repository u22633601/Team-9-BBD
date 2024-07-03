var GamePiece;
var Obstacles = [];
var testWall;
var testWall2;
var gameMaze;
var gameHole;


function startGame(ballX, ballY, ballRadius, a_gameMaze, holeX, holeY, holeRadius) {
	gameMaze = a_gameMaze;

	removeOtherScreens();

	GameArea.start();

	GamePiece = new createPlayer(ballX, ballY, ballRadius, "#f39c12");
	gameHole = new createPlayer(holeX, holeY, holeRadius, "#4a90e2");

	for(let i = 0; i < gameMaze.map.length; i++){
		for(let j = 0; j < gameMaze.map[i].length; j++){
			if(gameMaze.map[i][j] == 1){
				Obstacles.push(new createWall(i*a_gameMaze.wallSize, j*a_gameMaze.wallSize, a_gameMaze.wallSize, "#2f2f2f"));
			}
		}
	}
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
		this.interval = setInterval(updateGameArea, 60);
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
	this.update = function(){
		ctx = GameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(Math.round(this.x/100 * GameArea.canvas.width) , Math.round(this.y/100 * GameArea.canvas.width), Math.round(this.size/100 * GameArea.canvas.width)+1, Math.round(this.size/100 * GameArea.canvas.width)+1);
		// ctx.fillRect(this.x/100 * GameArea.canvas.width, this.y/100 * GameArea.canvas.width, this.size/100 * GameArea.canvas.width, this.size/100 * GameArea.canvas.width);
	}
}

function createPlayer(x,y,radius,color){
	this.x = x;
	this.y = y;
	this.radius = radius;

	this.update = function(){
		ctx = GameArea.context;
		ctx.beginPath();
		ctx.arc(Math.round((this.x)/100 * GameArea.canvas.width), Math.round((this.y)/100 * GameArea.canvas.width), Math.round(this.radius/100 * GameArea.canvas.width), 0, 2 * Math.PI);
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

function updateBallPosition(ballX, ballY) {
	GamePiece.x = ballX;
	GamePiece.y = ballY;
}

function updateGameArea() {
	GameArea.clear();
	gameHole.update();
	
	//GamePiece.newPos();
	//handleCollision();
	//testWall.update();
	//testWall2.update();
	for(i = 0; i < Obstacles.length; i++){
		Obstacles[i].update();
	}

	GamePiece.update();

}

//module.exports = startGame;