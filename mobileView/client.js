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
const copyGameIdBtn = document.getElementById('copy-game-id-btn');
const toast = document.getElementById('toast');

const winLoseScreen = document.getElementById('win-lose-screen');
const winLoseMessage = document.getElementById('win-lose-message');
const playAgainBtn = document.getElementById('play-again-btn');

const viewGameBtn = document.getElementById('view-game-btn');
const viewerGameIdInput = document.getElementById('viewer-game-id-input');

const timerDisplay = document.getElementById('timer-display');

let currentUsername = '';
let isHost = false;

let timer = 0;
let ball = {x: 0, y: 0};

// This function sets up the socket to transmit the orientation data to the server
// Assumes that requisite permissions have been granted
function SetupOrientationSocket() {
    let lastEmitTime = 0;

    addEventListener('deviceorientation', (event) => {
        const currentTime = Date.now();

        // FIXME: this is potentially too fast or too slow
        // Orientation only updates every 100ms
        if (currentTime - lastEmitTime > 250) {
            socket.emit('orientation', 
            {
                username: currentUsername,
                orientation_data: {
                    beta : event.beta,
                    gamma : event.gamma
                }
            });
            lastEmitTime = currentTime;
        }
    });
}

// Gets the orientation permission from the user, true if permission granted, false otherwise
function RequestOrientationPermission() {
    if (typeof DeviceMotionEvent !== 'undefined') {
        if(typeof DeviceMotionEvent.requestPermission === 'function'){
        DeviceMotionEvent.requestPermission()
            .then((response) => {
                if (response == 'granted') {
                    SetupOrientationSocket();
                } else {
                    socket.emit('no-orientation');
                }
            })
            .catch(console.error);
        }
        else{
            SetupOrientationSocket();
        }
    } else {
        alert('DeviceMotionEvent is not defined');
        socket.emit('no-orientation');
    }
}


copyGameIdBtn.addEventListener('click', () => {
    const gameId = gameIdDisplay.textContent;
    navigator.clipboard.writeText(gameId).then(() => {
        showToast('Game ID copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy Game ID');
        console.error('Error copying text: ', err);
    });
});


loginBtn.addEventListener('click', () => {
    currentUsername = usernameInput.value.trim();
    if (currentUsername) {
        loginScreen.classList.add('hidden');
        lobbyScreen.classList.remove('hidden');

        RequestOrientationPermission();
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

viewGameBtn.addEventListener('click', () => {
    const gameId = gameIdInput.value.trim();
    if (gameId) {
        socket.emit('viewGame', { gameId, username: currentUsername });
    }
});

startGameBtn.addEventListener('click', () => {
    socket.emit('startGame', gameIdDisplay.textContent);
});

playAgainBtn.addEventListener('click', () => {
    location.reload(true);

    // winLoseScreen.classList.add('hidden');
    // lobbyScreen.classList.remove('hidden');
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
    updatePlayerList(data.players, data.viewers);
    lobbyScreen.classList.add('hidden');
    waitingScreen.classList.remove('hidden');
    if (isHost) {
        startGameBtn.classList.remove('hidden');
    }
});

socket.on('initGameState', (state) => {
    showToast('Game started!');
    console.log('Game state: ', state);
    // console.log("Ball's current position: ", state.ball.x, state.ball.y);

    let redBall = {x: state.redBall.x, y: state.redBall.y, radius: state.redBall.radius};
    let blueBall = {x: state.blueBall.x, y: state.blueBall.y, radius: state.blueBall.radius};

    startGame(state.ball.x, state.ball.y, state.ball.radius, state.maze, state.hole.x, state.hole.y, state.hole.radius);
});

socket.on('joinError', (message) => {
    showToast(message);
});

socket.on('gameOver', (data) => {
    if (data.win) {
        // showToast('You win!');
        winLoseMessage.textContent = 'You win!';
    } else {
        // showToast('You lose!');
        winLoseMessage.textContent = 'You lose!';
    }

    // FIXME: this shows the win/lose screen but doesnt hide anything, fix this
    timerDisplay.classList.add("hidden");
    winLoseScreen.classList.remove('hidden');
});

socket.on('updateTime', (timeLeft) => {
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
});

// socket.on('gameOver', (data) => {
//     if (data.win) {
//       showToast('You win!');
//     } else {
//       showToast('You lose!');
//     }
//     // Optionally, you can reset the game state or navigate back to the lobby
//   });

socket.on('updateGameState', (state) => {
    // const coordinateLabel = document.getElementById('coordinate-display');
    // coordinateLabel.textContent = `Ball's current position: ${state.ball.x}, ${state.ball.y}`;

    // console.log('Time left: ', state.timeLeft);
    console.log("Ball's current position: ", state.ball.x, state.ball.y);

    timer = state.timeLeft;
    timerDisplay.textContent = `Time Left: ${timer}s`; // Update the timer display

    let redBall = {x: state.redBall.x, y: state.redBall.y, radius: state.redBall.radius};
    let blueBall = {x: state.blueBall.x, y: state.blueBall.y, radius: state.blueBall.radius}; 

    // FIXME: potential issue here, double check that the ball updates correctly, might have to do a member wise assignment
    ball = state.ball;
    updateBallPosition(ball.x, ball.y);
});

function updatePlayerList(players, viewers = []) {
    playerList.innerHTML = '<h3>Players:</h3>';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playerList.appendChild(li);
    });

    const viewerList = document.createElement('ul');
    if (viewers && viewers.length > 0) {
        viewerList.innerHTML = '<h3>Viewers:</h3>';
        viewers.forEach(viewer => {
            const li = document.createElement('li');
            li.textContent = viewer;
            viewerList.appendChild(li);
        });
    }
    playerList.appendChild(viewerList);

    if (isHost && players.length >= 1) {
        startGameBtn.disabled = false;
    } else if (isHost) {
        startGameBtn.disabled = true;
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}