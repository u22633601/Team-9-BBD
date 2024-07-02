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
const handleCollision = require('./MazeLogic/CollisionHandling.js');
const Maze = require('./MazeLogic/Maze.js');
const Ball = require('./MazeLogic/Ball.js');

var options = {
	key: fs.readFileSync('certs/mazegame.key'),
	cert: fs.readFileSync('certs/mazegame.crt')
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
            host: socket.id
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
            } else if (game.players.map(player => player.username).includes(username) ||
                       game.viewers.includes(username)) {
                socket.emit('joinError', 'Username is already taken');
            } else {
                const player = new Player(username, socket);
                game.players.push(player);
                game.sockets.push(socket);
                socket.join(gameId);
                io.to(gameId).emit('playerJoined', game.players.map(player => player.username));
                socket.emit('gameJoined', {
                    gameId,
                    players: game.players.map(player => player.username),
                    viewers: game.viewers,
                    isHost: false
                });
                console.log('gameId:', gameId, '\t|\tPlayer joined the game, username: ', username, ', playerCount: ', game.players.length);
            }
        } else {
            socket.emit('joinError', 'Game not found or already started');
        }
    });


    socket.on('startGame', (gameId) => {
        const game = games.get(gameId);
        if (game && socket.id === game.host) {
            game.isStarted = true;
            io.to(gameId).emit('gameStarted');
            console.log('gameId:', gameId, '\t|\tGame started');
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