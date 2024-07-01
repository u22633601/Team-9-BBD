const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'mobileView')));

const games = new Map();

io.on('connection', (socket) => {
    socket.on('createGame', (username) => {
        const gameId = Math.random().toString(36).substring(2, 8);
        games.set(gameId, { 
            players: [username], 
            sockets: [socket],
            isStarted: false,
            host: socket.id
        });
        socket.join(gameId);
        socket.emit('gameCreated', gameId);
    });

    socket.on('joinGame', ({ gameId, username }) => {
        const game = games.get(gameId);
        if (game && !game.isStarted) {
            game.players.push(username);
            game.sockets.push(socket);
            socket.join(gameId);
            io.to(gameId).emit('playerJoined', game.players);
            socket.emit('gameJoined', { gameId, players: game.players, isHost: false });
        } else {
            socket.emit('joinError', 'Game not found or already started');
        }
    });

    socket.on('startGame', (gameId) => {
        const game = games.get(gameId);
        if (game && socket.id === game.host) {
            game.isStarted = true;
            io.to(gameId).emit('gameStarted');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});