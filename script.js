let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.getElementById("msg");
let turnIndicator = document.getElementById("turn-indicator");
let modeSelection = document.querySelector(".mode-selection");
let playWithFriendsBtn = document.querySelector("#play-friends");
let playWithComputerBtn = document.querySelector("#play-computer");
let mainGame = document.querySelector("main");

// Player name input elements
let nameContainer = document.querySelector(".name-container");
let player2Input = document.querySelector("#player2-name");
let startGameBtn = document.querySelector("#start-game-btn");

let turn0 = true;
let gameOver = false;
let playWithComputer = false;

// Default player names
let player1Name = "Roni";  // Always Roni
let player2Name = "";  // Set dynamically when user enters name

const winPattern = [
    [0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], 
    [2,4,6], [3,4,5], [6,7,8]
];

const startGame = (computerMode) => {
    playWithComputer = computerMode;
    modeSelection.classList.add("hide"); // Hide mode selection

    if (playWithComputer) {
        player2Name = "Computer"; // Fixed name for computer
        mainGame.classList.remove("hide"); // Show game board
        resetGame();
    } else {
        nameContainer.classList.remove("hide"); // Show player name input
    }
};

startGameBtn.addEventListener("click", () => {
    player2Name = player2Input.value.trim() || "Player 2"; // Default name if empty
    nameContainer.classList.add("hide"); // Hide name input
    mainGame.classList.remove("hide"); // Show game board
    resetGame();
});

const updateTurnIndicator = () => {
    if (gameOver) return;
    turnIndicator.innerText = turn0 ? `${player1Name}'s Turn (O)` : `${player2Name}'s Turn (X)`;
    turnIndicator.style.color = turn0 ? "white" : "lightblue";

    turnIndicator.classList.add("turn-animation");
    setTimeout(() => {
        turnIndicator.classList.remove("turn-animation");
    }, 300);
};

const resetGame = () => {
    turn0 = true;
    gameOver = false;
    enableBoxes();
    msgContainer.classList.add("hide");
    updateTurnIndicator();
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (gameOver || box.innerText !== "") return;

        box.innerText = turn0 ? "O" : "X";
        box.style.color = turn0 ? "blue" : "red";
        box.disabled = true;
        turn0 = !turn0;

        updateTurnIndicator();
        checkWinner();

        if (playWithComputer && !turn0 && !gameOver) {
            setTimeout(computerMove, 500);
        }
    });
});

const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

const showWinner = (winner) => {
    let winnerName = winner === "O" ? player1Name : player2Name;
    msg.innerText = `Congratulations, ${winnerName} Wins!`;
    msgContainer.classList.remove("hide");
    gameOver = true;
    disableBoxes();
};

const checkWinner = () => {
    for (let pattern of winPattern) {
        let [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[b].innerText === boxes[c].innerText) {
            showWinner(boxes[a].innerText);
            return;
        }
    }

    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove("hide");
        gameOver = true;
    }
};

const computerMove = () => {
    let emptyBoxes = [...boxes].filter(box => box.innerText === "");
    if (emptyBoxes.length === 0 || gameOver) return;

    let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    randomBox.innerText = "X";
    randomBox.style.color = "red";
    randomBox.disabled = true;
    turn0 = true;

    updateTurnIndicator();
    checkWinner();
};

playWithFriendsBtn.addEventListener("click", () => startGame(false));
playWithComputerBtn.addEventListener("click", () => startGame(true));
newGameBtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
