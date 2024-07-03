// HTTP stuff is commented out as HTTPS is required for mobile devices to access the gyroscope
// Dont remove the HTTP stuff though, we might use it for testing since the HTTPS stuff has that
// annoying message about invalid certs

const express = require('express');
// const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const Player = require('./MazeLogic/Player.js');
const {
	checkMarkerCollision,
} = require('./MazeLogic/CollisionHandling.js');
const Maze = require('./MazeLogic/Maze.js');
const MazeObject = require('./MazeLogic/MazeObject.js');
const Ball = require('./MazeLogic/Ball.js');
const { time } = require('console');

var options = {
	key: fs.readFileSync('certs/mazegame.key'),
	cert: fs.readFileSync('certs/mazegame.crt'),
};

const app = express();
// const server = http.createServer(app);
const server = https.createServer(options, app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'mobileView')));

const games = new Map();

const PUZZLE_TIME = 100; 
const frame_period = 1000 / 60;

io.on('connection', (socket) => {
	socket.on('createGame', (username) => {
		const gameId = Math.random().toString(36).substring(2, 8);

		const player = new Player(username, socket);


		games.set(gameId, {
			players: [player],
			viewers: [],
			sockets: [socket],
			isStarted: false,
			host: socket.id,
		});
		socket.join(gameId);
		socket.emit('gameCreated', gameId);

		console.log('gameId:', gameId, '\t|\tGame created, host: ', username);
	});

	socket.on('viewGame', ({ gameId, username }) => {
		const game = games.get(gameId);
		if (game) {
			if (game.players.map(player => player.username).includes(username) ||
				game.viewers.includes(username)) {
				socket.emit('joinError', 'Username is already taken');
			} else {
				game.viewers.push(username);
				socket.join(gameId);
				io.to(gameId).emit('playerJoined', game.players.map(player => player.username));
				socket.emit('gameJoined', {
					gameId,
					players: game.players.map(player => player.username),
					viewers: game.viewers,
					isHost: false
				});
				console.log('gameId:', gameId, '\t|\tViewer joined the game, username: ', username);
			}
		} else {
			socket.emit('joinError', 'Game not found');
		}
	});

	socket.on('joinGame', ({ gameId, username }) => {
		const game = games.get(gameId);
		if (game && !game.isStarted) {
			if (game.players.length >= 4) {
				socket.emit('joinError', 'Game is already full');
				console.log(
					'gameId:',
					gameId,
					'\t|\tPlayer tried to join a full game, username: ',
					username
				);
			} else if (
				game.players.map((player) => player.username).includes(username)
			) {
				socket.emit('joinError', 'Username is already taken');
				console.log(
					'gameId:',
					gameId,
					'\t|\tPlayer tried to join with an existing username: ',
					username
				);
			} else {
				const player = new Player(username, socket);

				console.log(
					'gameId:',
					gameId,
					'\t|\tPlayer joined the game, username: ',
					username,
					', playerCount: ',
					game.players.length + 1
				);

				game.players.push(player);
				game.sockets.push(socket);
				socket.join(gameId);
				io.to(gameId).emit(
					'playerJoined',
					game.players.map((player) => player.username)
				);
				socket.emit('gameJoined', {
					gameId,
					players: game.players.map((player) => player.username),
					viewers: game.viewers,
					isHost: false,
				});
			}
		} else {
			socket.emit('joinError', 'Game not found or already started');
			console.log(
				'gameId:',
				gameId,
				'\t|\tPlayer tried to join a non-existent or started game, username: ',
				username
			);
		}
	});

	function AddBallToMaze(ball, maze){
		ball.radius = maze.wallSize / 4;
		
		ball.x = maze.start.x * maze.wallSize + maze.wallSize / 2;
		ball.y = maze.start.y * maze.wallSize + maze.wallSize / 2;
	}

	function AddEndToMaze(end, maze){
		end.radius = maze.wallSize / 4;
		
		end.x = maze.finish.x * maze.wallSize + maze.wallSize / 2;
		end.y = maze.finish.y * maze.wallSize + maze.wallSize / 2;
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	socket.on('startGame', (gameId) => {
		const game = games.get(gameId);
		if (game && socket.id === game.host) {
			game.isStarted = true;

			const teams = ['red', 'blue'];
			game.players.forEach((player, index) => {
				player.team = teams[index % 2];
			});

			// Initialise game state variables: Ball, Maze, Hole


			// 11x11, start position at cell 1,1 and end at cell 9,9 
			// const maze = new Maze(15, 15, getRandomInt(1, 14), getRandomInt(1, 14), getRandomInt(1, 14), getRandomInt(1, 14));
			const maze = new Maze(15, 15, 1, 1, 13, 13);

			let balls = [new Ball(0, 0, 0, teams[0]), new Ball(0, 0, 0, teams[1])];
			
			let hole = new MazeObject(0, 0, 0);

			AddBallToMaze(balls[0], maze);
			AddBallToMaze(balls[1], maze);
			AddEndToMaze(hole, maze);

			game.maze = maze;

			// timeLeft = 500;

			console.log(
				'gameId:',
				gameId,
				'\t|\tGame started.\n Players: ',
				game.players,
				'\n Balls: ',
				balls,
				'\n Hole: ',
				hole,
				// '\n Time Left: ',
				// timeLeft
			);

			// Emit initial game state to all players
			io.to(gameId).emit('initGameState', {
				balls: balls,
				hole: hole,
				maze: maze.getMazeData(),
				// timeLeft: timeLeft,
				players: game.players.map(p => ({ username: p.username, team: p.team }))
			});

			// Start game loop for this game (60 frames per seconds)
			let gameLoopId = setInterval(() => {
				// Collect all orientation data from all players
				for(let ball of balls){
					for (let player of game.players) {
						if(player.team != ball.team){
							continue;
						}
						// Generate resultant force vector from all players' orientation data (needs conversion from angles to force x and y vectors)
						// - Invert the y-axis for the orientation data
						let orientation = player.getOrientation();

						ball.acceleration.x += orientation.y * 9.8 * 10;
						ball.acceleration.y += orientation.x * 9.8 * 10;
					}

					// Update ball velocity and position based on resultant force vector
					let futureCoordinates = ball.getFuturePosition(frame_period / 1000);

					// let updatePosition = true
					for (let i = 0; i < maze.map.length; i++) {
						for (let j = 0; j < maze.map[i].length; j++) {
							if (maze.map[i][j] == 1) {
								// if ((futureCoordinates.x >= j - 5 && futureCoordinates.x <= j + 5) || (futureCoordinates.y >= i - 5 && futureCoordinates.y <= i + 5)) {
								// if ((futureCoordinates.x >= j * maze.wallSize - 5 && futureCoordinates.x <= j * maze.wallSize + 5) || (futureCoordinates.y >= i * maze.wallSize && futureCoordinates.y <= i * maze.wallSize)) {
								if ((Math.abs(futureCoordinates.x - (i * maze.wallSize + maze.wallSize / 2)) < (maze.wallSize / 2 + ball.radius) &&
									Math.abs(futureCoordinates.y - (j * maze.wallSize + maze.wallSize / 2)) < (maze.wallSize / 2 + ball.radius))
								) {
									// Reverse applied force
									// console.log("Collision detected at maze wall")

									// Set velocities to 0
									if (Math.abs(ball.x - (i * maze.wallSize + maze.wallSize / 2)) < (maze.wallSize / 2 + ball.radius)) {
										ball.velocityY = -ball.velocityY;
										ball.acceleration.y = 0;
									}
									else {
										ball.velocityX = -ball.velocityX;
										ball.acceleration.x = 0;
									}

									break;
								}
							}
						}
					}

					ball.updatePosition(frame_period / 1000);
				}	

				// Check for win condition
				// if (timeLeft <= 0) {
				// 	// Game over, time's up -> Emit game over event to all players (loss)
				// 	console.log('Game ID: ', gameId, " | Time's up, game over (loss)");
				// 	io.to(gameId).emit('gameOver', { win: false });					// Stop the game loop
				// 	clearInterval(gameLoopId);
				// } else 
				if (checkMarkerCollision(balls[0], hole)) {
					// Game over, players win -> Emit game over event to all players (win)
					console.log('Game ID: ', gameId, " | Ball reached the hole, game over (win)");
					io.to(gameId).emit('gameOver', { team: balls[0].team });

					// Stop the game loop
					clearInterval(gameLoopId);
				} else if(checkMarkerCollision(balls[1], hole)){
					// Game over, players win -> Emit game over event to all players (win)
					console.log('Game ID: ', gameId, " | Ball reached the hole, game over (win)");
					io.to(gameId).emit('gameOver', { team: balls[1].team });

					// Stop the game loop
					clearInterval(gameLoopId);
				} else {
					// Game still in progress - emit updated game state to all players
					io.to(gameId).emit('updateGameState', {
						balls: balls.map(b => ({ x: b.x, y: b.y, team: b.team })),
						// timeLeft: timeLeft,
					});

					console.log("updateGameState emitted");
				}

				// console.timeEnd('gameLoop Execution Time');
				
			}, frame_period);
		}
	});


	socket.on('no-orientation', () => {
		// TODO: disconnecting the client or otherwise preventing them from going further is probably a good idea here
		console.log('No orientation data available');
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
