let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.getElementById("msg");
let turnIndicator = document.getElementById("turn-indicator");

let turn0 = true;
let gameOver = false;

const winPattern = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

const updateTurnIndicator = () => {
    if (gameOver) return;  

    if (turn0) {
        turnIndicator.innerText = "Player O's Turn";
        turnIndicator.style.color = "white";
    } else {
        turnIndicator.innerText = "Player X's Turn";
        turnIndicator.style.color = "lightblue";
    }

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
        if (gameOver) return;
        if(turn0){
            box.innerText="O";
            turn0=false;
        }
        else{
            box.innerText="X";
            turn0=true;
        }
        box.disabled = true;
        updateTurnIndicator();
        checkWinner();
    });
});

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled=true;
    }
}

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled=false;
        box.innerText="";
    }
}

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};


const checkWinner = () =>{
    for(let pattern of winPattern){
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if(pos1val && pos2val  && pos3val){
            if(pos1val=== pos2val && pos2val === pos3val){
                showWinner(pos1val);
                return;
            }
        }
    }
    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove("hide");
    }
};

newGameBtn.addEventListener("click",resetGame);
resetbtn.addEventListener("click",resetGame);