const { Server } = require('socket.io');

const games = new Map();

module.exports = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

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

    console.log('Socket is initialized');
    res.end();
};