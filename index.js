//jshint esversion:6

const gameBoard = document.getElementById('gameBoard');

const title = document.getElementById('title');
//tile ids
const tl = document.getElementById('tl');
const tm = document.getElementById('tm');
const tr = document.getElementById('tr');
const ml = document.getElementById('ml');
const mm = document.getElementById('mm');
const mr = document.getElementById('mr');
const bl = document.getElementById('bl');
const bm = document.getElementById('bm');
const br = document.getElementById('br');

let diff = 'e';
let gameOver = false;

gameBoard.addEventListener('click', monitorGame);

function monitorGame(e) {
  let elemId = e.target.id;
  let clickedElem = document.getElementById(e.target.id);
  addLetter(elemId, clickedElem);
  checkForWin('X');
  if (diff === 'e' && !gameOver) {
    setTimeout(aiTurnEasy, 500);
  }
}

const gameObject = {
  tl: null,
  tm: null,
  tr: null,
  ml: null,
  mm: null,
  mr: null,
  bl: null,
  bm: null,
  br: null
};

const gameArray = ["tl", "tm", "tr", "ml", "mm", "mr", "bl", "bm", "br"];

function addLetter(elemId, clickedElem) {
  if (gameObject[elemId] !== 'X' || gameObject[elemId] !== 'O') {
    gameObject[elemId] = 'X';
    clickedElem.innerHTML = 'X';
    clickedElem.classList.add('x');
    console.log(gameObject);
    remArrVal(gameArray, elemId);
  }
}

function aiTurnEasy() {
  if (gameArray.length > 0) {
    let aIElemId = gameArray[Math.floor(Math.random() * gameArray.length)];
    console.log('Random elem: ' + aIElemId);
    gameObject[aIElemId] = 'O';
    let aIElem = document.getElementById(aIElemId);
    aIElem.innerHTML = 'O';
    aIElem.classList.add('o');
    remArrVal(gameArray, aIElemId);
  }
  checkForWin('O');
}

function aiTurnMedium() {
  //check for AI win
  //iterate through all possible choices - check for win have it return true - play that
  //check for and block player win
  //iterate through all possible moves - check for X win have it return true, play that
  //place high value move
}

function checkForWin(value) {
  if (gameObject.tl === value && gameObject.tm === value && gameObject.tr === value) {
    tl.classList.add('win');
    tm.classList.add('win');
    tr.classList.add('win');
    displayWin(value);
    gameOver = true;
  } else if (gameObject.ml === value && gameObject.mm === value && gameObject.mr === value) {
    ml.classList.add('win');
    mm.classList.add('win');
    mr.classList.add('win');
    displayWin(value);
    gameOver = true;
  } else if (gameObject.bl === value && gameObject.bm === value && gameObject.br === value) {
    bl.classList.add('win');
    bm.classList.add('win');
    br.classList.add('win');
    displayWin(value);
    gameOver = true;

    //vertical
  } else if (gameObject.tl === value && gameObject.ml === value && gameObject.bl === value) {
    tl.classList.add('win');
    ml.classList.add('win');
    bl.classList.add('win');
    displayWin(value);
    gameOver = true;
  } else if (gameObject.tm === value && gameObject.mm === value && gameObject.bm === value) {
    tm.classList.add('win');
    mm.classList.add('win');
    bm.classList.add('win');
    displayWin(value);
    gameOver = true;
  } else if (gameObject.tr === value && gameObject.mr === value && gameObject.br === value) {
    tr.classList.add('win');
    mr.classList.add('win');
    br.classList.add('win');
    displayWin(value);
    gameOver = true;

    //diagonal
  } else if (gameObject.tl === value && gameObject.mm === value && gameObject.br === value) {
    tl.classList.add('win');
    mm.classList.add('win');
    br.classList.add('win');
    displayWin(value);
    gameOver = true;
  } else if (gameObject.tr === value && gameObject.mm === value && gameObject.bl === value) {
    tr.classList.add('win');
    mm.classList.add('win');
    bl.classList.add('win');
    displayWin(value);
    gameOver = true;
  }
}

function displayWin(value) {
  gameBoard.removeEventListener('click', monitorGame);
  let msg;
  (value === 'X') ? msg = 'You Won! ': msg = 'OOh, So Close... ';
  title.innerHTML = msg + "Click To Play Again.";
  title.addEventListener('click', function() {
    document.location.reload();
  });
}

function remArrVal(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
