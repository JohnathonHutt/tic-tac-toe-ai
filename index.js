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

let diff;
let gameOver = true;
let numPlayerMoves = 0;
let didPlayerGo = false;

const diffButtons = document.getElementById('diffButtons');

diffButtons.addEventListener('click', function(e) {
  diff = e.target.id;
  gameOver = false;
  document.getElementById(diff).classList.add('pressed');
  let buttons = ['e', 'm', 'h'];
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i] !== diff) {
      let button = document.getElementById(buttons[i]);
      if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
      }
    }
  }
});

gameBoard.addEventListener('click', monitorGame);

function monitorGame(e) {
  let elemId = e.target.id;
  let clickedElem = document.getElementById(e.target.id);
  addLetter(elemId, clickedElem);
  checkForWin('X');
  checkForAndDisplayDraw();

  if (diff === 'e' && !gameOver && didPlayerGo) {
    setTimeout(aiTurnEasy, 500);
  } else if (diff === 'm' && !gameOver && didPlayerGo) {
    setTimeout(aiTurnMedium, 500);
  } else if (diff === 'h' && !gameOver && didPlayerGo) {
    setTimeout(aiTurnUltron, 500);
  }
  didPlayerGo = false;
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
  if (!gameOver) {
    if (gameObject[elemId] !== 'X' && gameObject[elemId] !== 'O') {
      didPlayerGo = true;
      assignSquareX(elemId);
      numPlayerMoves += 1;
    }
    checkForWin('X');
  }
}

function aiTurnEasy() {
  //plays a square at random from remaining squares, then checks for win
  if (gameArray.length > 0) {
    let aIElemId = gameArray[Math.floor(Math.random() * gameArray.length)];
    assignSquareO(aIElemId);
  }
  checkForWin('O');
}

function aiTurnMedium() {
  let haveMoved = false;
  //checks remaining moves for a win, plays if found
  for (let i = 0; i < gameArray.length; i++) {
    gameObject[gameArray[i]] = 'O';
    if (checkAiMove('O')) {
      let currSquare = document.getElementById(gameArray[i]);
      currSquare.innerHTML = 'O';
      currSquare.classList.add('o');
      remArrVal(gameArray, gameArray[i]);
      haveMoved = true;
      break;
    } else {
      gameObject[gameArray[i]] = null;
    }
  }
  //"plays" for X, if X would win play to block X win
  if (!haveMoved) {
    for (let i = 0; i < gameArray.length; i++) {
      gameObject[gameArray[i]] = 'X';
      if (checkAiMove('X')) {
        gameObject[gameArray[i]] = 'O';
        let currSquare = document.getElementById(gameArray[i]);
        currSquare.innerHTML = 'O';
        currSquare.classList.add('o');
        remArrVal(gameArray, gameArray[i]);
        haveMoved = true;
        break;
      } else {
        gameObject[gameArray[i]] = null;
      }
    }
  }

  if (!haveMoved && gameArray.length > 0) {
    let aIElemId = gameArray[Math.floor(Math.random() * gameArray.length)];
    assignSquareO(aIElemId);
  }
  checkForWin('O');
}

function aiTurnUltron() {
  let haveMoved = false;
  //checks remaining moves for a win, plays if found
  for (let i = 0; i < gameArray.length; i++) {
    gameObject[gameArray[i]] = 'O';
    if (checkAiMove('O')) {
      let currSquare = document.getElementById(gameArray[i]);
      currSquare.innerHTML = 'O';
      currSquare.classList.add('o');
      remArrVal(gameArray, gameArray[i]);
      haveMoved = true;
      break;
    } else {
      gameObject[gameArray[i]] = null;
    }
  }
  //"plays" for X, if X would win play to block X win
  if (!haveMoved) {
    for (let i = 0; i < gameArray.length; i++) {
      gameObject[gameArray[i]] = 'X';
      if (checkAiMove('X')) {
        gameObject[gameArray[i]] = 'O';
        let currSquare = document.getElementById(gameArray[i]);
        currSquare.innerHTML = 'O';
        currSquare.classList.add('o');
        remArrVal(gameArray, gameArray[i]);
        haveMoved = true;
        break;
      } else {
        gameObject[gameArray[i]] = null;
      }
    }
  }
  //play middle if not assigned, then edge || play corners (if middle was chosen)
  if (!haveMoved) {
    if (numPlayerMoves === 1 && gameObject.mm === null) {
      assignSquareO('mm');
    } else if (numPlayerMoves === 2 && gameObject.mm === 'O') {
      assignEdgeO();
    } else if (isThereAnEmptyCorner()){
      assignCornerO();
    } else {
      assignEdgeO();
    }
  }
  checkForWin('O');
}

function assignSquareO(spaceId) {
  //spaceId is a lower case string e.g. 'tl'
  gameObject[spaceId] = 'O';
  let currSquare = document.getElementById(spaceId);
  currSquare.innerHTML = 'O';
  currSquare.classList.add('o');
  remArrVal(gameArray, spaceId);
}

function assignSquareX(spaceId) {
  //spaceId is a lower case string e.g. 'tl'
  gameObject[spaceId] = 'X';
  let currSquare = document.getElementById(spaceId);
  currSquare.innerHTML = 'X';
  currSquare.classList.add('x');
  remArrVal(gameArray, spaceId);
}

function assignEdgeO() {
  let isThereAGoodEdge = false;
  let edges = ['tm', 'ml', 'mr', 'bm'];
  let oppEdges = {tm: 'bm', bm: 'tm', ml: 'mr', mr: 'ml'};
  for (let i = 0; i < edges.length; i++) {
    if (gameObject[edges[i]] === null && gameObject[oppEdges[edges[i]]] === null) {
      assignSquareO(edges[i]);
      isThereAGoodEdge = true;
      break;
    }
  }
  if (!isThereAGoodEdge) {
    for (let i = 0; i < edges.length; i++) {
      if (gameObject[edges[i]] === null) {
        assignSquareO(edges[i]);
        break;
      }
    }
  }
}

function assignCornerO() {
  let corners = ['tl', 'tr', 'bl', 'br'];
  for (let i = 0; i < corners.length; i++) {
    if (gameObject[corners[i]] === null) {
      assignSquareO(corners[i]);
      break;
    }
  }
}

function isThereAnEmptyCorner() {
  let corners = ['tl', 'tr', 'bl', 'br'];
  for (let i = 0; i < corners.length; i++) {
    if (gameObject[corners[i]] === null) {
      return true;
    }
  }
}

function checkAiMove(value) {
  //value is 'X' or 'O'
  //tests whether a given move will result in a win
  //horizontal
  if (gameObject.tl === value && gameObject.tm === value && gameObject.tr === value) {
    return true;
  } else if (gameObject.ml === value && gameObject.mm === value && gameObject.mr === value) {
    return true;
  } else if (gameObject.bl === value && gameObject.bm === value && gameObject.br === value) {
    return true;

    //vertical
  } else if (gameObject.tl === value && gameObject.ml === value && gameObject.bl === value) {
    return true;
  } else if (gameObject.tm === value && gameObject.mm === value && gameObject.bm === value) {
    return true;
  } else if (gameObject.tr === value && gameObject.mr === value && gameObject.br === value) {
    return true;

    //diagonal
  } else if (gameObject.tl === value && gameObject.mm === value && gameObject.br === value) {
    return true;
  } else if (gameObject.tr === value && gameObject.mm === value && gameObject.bl === value) {
    return true;
  }
}

function checkForWin(value) {
  //value is 'X' or 'O' - checks and displays win if present for player or AI depending on value
  //horizontal
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
  //value is 'X' or 'O'
  //displays winning message, click title to restart
  gameBoard.removeEventListener('click', monitorGame);
  let msg;
  (value === 'X') ? msg = 'You Won! ': msg = 'OOh, So Close... ';
  title.innerHTML = msg + "Click To Play Again.";
  title.addEventListener('click', function() {
    document.location.reload();
  });
}

function checkForAndDisplayDraw() {
  //checks gameArray for remaining moves, if none displays draw message, click to reload
  if (gameArray.length === 0) {
    gameBoard.removeEventListener('click', monitorGame);
    title.innerHTML = "It's a Draw. Click To Play Again.";
    title.addEventListener('click', function() {
      document.location.reload();
    });
  }
}

function remArrVal(arr, spaceId) {
  //arr is gameArray, spaceId is a lower case string e.g. 'tl'
  //removes a space from the gameArray so AI moves can only be chosen from available spaces
  let index = arr.indexOf(spaceId);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
