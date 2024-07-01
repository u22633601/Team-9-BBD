const socket = io();

const loginScreen = document.getElementById('login-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const waitingScreen = document.getElementById('waiting-screen');

const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const createGameBtn = document.getElementById('create-game-btn');
const joinGameBtn = document.getElementById('join-game-btn');
const gameIdInput = document.getElementById('game-id-input');
const gameIdDisplay = document.getElementById('game-id-display');
const playerList = document.getElementById('player-list');
const startGameBtn = document.getElementById('start-game-btn');

let currentUsername = '';
let isHost = false;

loginBtn.addEventListener('click', () => {
    currentUsername = usernameInput.value.trim();
    if (currentUsername) {
        loginScreen.classList.add('hidden');
        lobbyScreen.classList.remove('hidden');
    }
});

createGameBtn.addEventListener('click', () => {
    socket.emit('createGame', currentUsername);
    isHost = true;
});

joinGameBtn.addEventListener('click', () => {
    const gameId = gameIdInput.value.trim();
    if (gameId) {
        socket.emit('joinGame', { gameId, username: currentUsername });
    }
});

startGameBtn.addEventListener('click', () => {
    socket.emit('startGame', gameIdDisplay.textContent);
});

socket.on('gameCreated', (gameId) => {
    gameIdDisplay.textContent = gameId;
    lobbyScreen.classList.add('hidden');
    waitingScreen.classList.remove('hidden');
    startGameBtn.classList.remove('hidden');
    updatePlayerList([currentUsername]);
});

socket.on('playerJoined', (players) => {
    updatePlayerList(players);
});

socket.on('gameJoined', (data) => {
    isHost = data.isHost;
    gameIdDisplay.textContent = data.gameId;
    updatePlayerList(data.players);
    lobbyScreen.classList.add('hidden');
    waitingScreen.classList.remove('hidden');
    if (isHost) {
        startGameBtn.classList.remove('hidden');
    }
});

socket.on('gameStarted', () => {
    alert('Game started!');
    
});

socket.on('joinError', (message) => {
    alert(message);
});

function updatePlayerList(players) {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playerList.appendChild(li);
    });

    if (isHost && players.length >= 2) {
        startGameBtn.disabled = false;
    } else if (isHost) {
        startGameBtn.disabled = true;
    }
}