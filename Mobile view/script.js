let gameId;
let players = [];

function createSession() {
    gameId = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('session-id').innerText = `Game ID: ${gameId}`;
    document.getElementById('create-session').classList.add('hidden');
    document.getElementById('waiting-area').classList.remove('hidden');
    players.push('Host');
    updatePlayersList();
}

function joinSession() {
    const enteredGameId = document.getElementById('game-id').value;
    if (enteredGameId == gameId && players.length < 4) {
        players.push(`Player ${players.length}`);
        updatePlayersList();
        if (players.length >= 2) {
            startGame();
        }
    } else {
        alert('Invalid Game ID or Session Full');
    }
}

function updatePlayersList() {
    const playersList = document.getElementById('players-list');
