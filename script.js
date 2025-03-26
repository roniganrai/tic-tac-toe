let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.getElementById("msg");
let turnIndicator = document.getElementById("turn-indicator");
let modeSelection = document.querySelector(".mode-selection");
let playWithFriendsBtn = document.querySelector("#play-friends");
let playWithComputerBtn = document.querySelector("#play-computer");
let mainGame = document.querySelector(".size");

// Player name input elements
let nameContainer = document.querySelector(".name-container");
let player2Input = document.querySelector("#player2-name");
let startGameBtn = document.querySelector("#start-game-btn");

// Scoreboard elements
let player1ScoreDisplay = document.getElementById("player1-score");
let player2ScoreDisplay = document.getElementById("player2-score");

let turn0 = true;
let gameOver = false;
let playWithComputer = false;

// Default player names
let player1Name = "Roni"; // Always Roni
let player2Name = ""; // Set dynamically when user enters name

// Scores
let player1Score = 0;
let player2Score = 0;

// 🎵 Sound Effects
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");
const errorSound = new Audio("sounds/error.mp3");

const winPattern = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Function to start the game
const startGame = (computerMode) => {
  playWithComputer = computerMode;
  modeSelection.classList.add("hide");

  if (playWithComputer) {
    player2Name = "Computer";
    mainGame.classList.remove("hide");
    updateScoreboard();
    resetGame();
  } else {
    nameContainer.classList.remove("hide");
  }
};

// Event listener for player 2 name input
startGameBtn.addEventListener("click", () => {
  player2Name = player2Input.value.trim() || "Player 2";
  nameContainer.classList.add("hide");
  mainGame.classList.remove("hide");
  updateScoreboard();
  resetGame();
});

const updateTurnIndicator = () => {
  if (gameOver) return;
  if (turn0) {
    turnIndicator.innerText = `${player1Name}'s Turn (O)`;
    turnIndicator.style.color = "blue"; // Color for O
  } else {
    turnIndicator.innerText = `${player2Name}'s Turn (X)`;
    turnIndicator.style.color = "red"; // Color for X
  }

  turnIndicator.classList.add("turn-animation");
  setTimeout(() => {
    turnIndicator.classList.remove("turn-animation");
  }, 300);
};

// Function to reset the game but keep scores
const resetGame = () => {
  turn0 = true;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
  updateTurnIndicator();
};

// Function to reset the entire game including scores
const resetFullGame = () => {
  player1Score = 0;
  player2Score = 0;
  updateScoreboard();
  resetGame();
};

const updateScoreboard = () => {
  player1ScoreDisplay.innerText = `${player1Name}: ${player1Score}`;
  player2ScoreDisplay.innerText = `${player2Name}: ${player2Score}`;
};

// 🎵 Adding Sound to Click Events
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameOver) return;

    if (box.innerText !== "") {
      errorSound.play(); // Play error sound if box is already occupied
      return;
    }

    box.innerText = turn0 ? "O" : "X";
    box.style.color = turn0 ? "blue" : "red";
    box.disabled = true;
    clickSound.play(); // Play click sound on valid move
    turn0 = !turn0;

    updateTurnIndicator();
    checkWinner();

    if (playWithComputer && !turn0 && !gameOver) {
      setTimeout(computerMove, 500);
    }
  });
});

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
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

  winSound.play(); // 🎵 Play win sound

  // Update score
  if (winner === "O") {
    player1Score++;
  } else {
    player2Score++;
  }

  updateScoreboard();
};

const checkWinner = () => {
  for (let pattern of winPattern) {
    let [a, b, c] = pattern;
    if (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      showWinner(boxes[a].innerText);
      return;
    }
  }

  if ([...boxes].every((box) => box.innerText !== "")) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    gameOver = true;
    drawSound.play(); // 🎵 Play draw sound
  }
};

const computerMove = () => {
  let emptyBoxes = [...boxes].filter((box) => box.innerText === "");
  if (emptyBoxes.length === 0 || gameOver) return;

  let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  randomBox.innerText = "X";
  randomBox.style.color = "red";
  randomBox.disabled = true;
  clickSound.play(); // 🎵 Play click sound for computer move
  turn0 = true;

  updateTurnIndicator();
  checkWinner();
};

playWithFriendsBtn.addEventListener("click", () => startGame(false));
playWithComputerBtn.addEventListener("click", () => startGame(true));
newGameBtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetFullGame);
