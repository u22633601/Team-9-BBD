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

io.on('connection', (socket) => {
	socket.on('createGame', (username) => {
		const gameId = Math.random().toString(36).substring(2, 8);

		const player = new Player(username, socket);


        games.set(gameId, { 
            players: [player], 
            viewers:[],
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

	socket.on('startGame', (gameId) => {
		const game = games.get(gameId);
		if (game && socket.id === game.host) {
			game.isStarted = true;

			// Initialise game state variables: Ball, Maze, Hole

			let ball = new Ball(85, 85, 2);
			let hole = new MazeObject(12, 12, 2);

			const maze = new Maze(11, 11, 1, 1, 9, 9);

			game.maze = maze;

			timeLeft = 500;

			console.log(
				'gameId:',
				gameId,
				'\t|\tGame started.\n Players: ',
				game.players,
				'\n Ball: ',
				ball,
				'\n Hole: ',
				hole,
				'\n Time Left: ',
				timeLeft
			);

			// Emit initial game state to all players
			io.to(gameId).emit('initGameState', {
				ball: ball,
				hole: hole,
				maze: maze.getMazeData(),
				timeLeft: timeLeft,
			});

			// Start timer for this game
			let gameTimerId = setInterval(() => {
				console.log("<", gameId, "> Time Left: ", timeLeft);
				timeLeft -= 1;
				io.to(gameId).emit('updateTime', timeLeft); // Emit timer updates

				// Stop the timer when time runs out
				if (timeLeft <= 0) {
					clearInterval(gameTimerId);
				}
			}, 1000);

			// Start game loop for this game (60 frames per seconds)
			gameLoopId = setInterval(() => {
				// Collect all orientation data from all players
				let resultantForce = { x: 0, y: 0 };
				for (let player of game.players) {
					// Generate resultant force vector from all players' orientation data (needs conversion from angles to force x and y vectors)
					// - Invert the y-axis for the orientation data
					let orientation = player.getOrientation();
					resultantForce.x += orientation.x*0.01	;
					resultantForce.y += -1*orientation.y*0.01;
				}

				// Update ball velocity and position based on resultant force vector
				let futureCoordinates = ball.getFuturePosition();

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
								console.log("Collision detected at maze wall")
								// resultantForce.x = -3 *resultantForce.x;
								// resultantForce.y = -3*resultantForce.y;

								// Set velocities to 0
								if (Math.abs(futureCoordinates.x - (i * maze.wallSize + maze.wallSize / 2)) < (maze.wallSize / 2 + ball.radius))
									// ball.velocityY = -ball.velocityY;
									// ball.velocityX = -ball.velocityX;

								resultantForce.x = 0;
								resultantForce.y = 0;

								ball.velocityX = 0;
								ball.velocityY = 0;

								break;

								
							}
						}
					}
				}

				ball.applyForce(resultantForce.x, resultantForce.y);
				ball.updatePosition();
				

				// Check for win condition
				if (timeLeft <= 0) {
					// Game over, time's up -> Emit game over event to all players (loss)
					console.log('Game ID: ', gameId, " | Time's up, game over (loss)");
					io.to(gameId).emit('gameOver', { win: false });					// Stop the game loop
					clearInterval(gameLoopId);
				} else if (checkMarkerCollision(ball, hole)) {
					// Game over, players win -> Emit game over event to all players (win)
					console.log('Game ID: ', gameId, " | Ball reached the hole, game over (win)");
					io.to(gameId).emit('gameOver', { win: true });

					// Stop the game loop
					clearInterval(gameLoopId);
				} else {
					// Game still in progress - emit updated game state to all players
					io.to(gameId).emit('updateGameState', {
						ball: ball,
						timeLeft: timeLeft,
					});
				}
			}, 1000 / 60);
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
