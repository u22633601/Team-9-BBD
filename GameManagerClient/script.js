var gameid = "Game ID";
const players = ["Player 1", "Player 2", "Player 3", "Player 4"];
var timeleft = 60 * 5;
var isPaused = false;
var timerInterval; // Declare the timerInterval variable globally

function setGameId() {
    document.getElementById("GameId").innerText = gameid;
}

function generatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        playerList.appendChild(listItem);
    });
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;

    timerInterval = setInterval(function () {
        if (!isPaused) {
            minutes = Math.floor(timer / 60);
            seconds = timer % 60;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = 0;
                clearInterval(timerInterval); // Stop the timer when it reaches 0
            }
        }
    }, 1000);
}

function PauseResume() {
    if (isPaused) {
        document.getElementById("PauseResume").innerText = "Pause";
        isPaused = false;
    } else {
        document.getElementById("PauseResume").innerText = "Resume";
        isPaused = true;
    }
}

window.onload = function () {
    setGameId();
    generatePlayerList();
    const timerDuration = timeleft;
    const display = document.getElementById('timer');
    startTimer(timerDuration, display);
};
