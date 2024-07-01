
var gameid = "Game ID";


function setGameId() {
    document.getElementById("GameId").innerText = gameid;
}
const players = ["Player 1", "Player 2", "Player 3", "Player 4"];
function generatePlayerList() {
    
    
    const playerList = document.getElementById('playerList');

   
    playerList.innerHTML = '';

    
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        playerList.appendChild(listItem);
    });
}

window.onload = generatePlayerList;
