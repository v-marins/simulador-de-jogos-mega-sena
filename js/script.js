var state = { board: [], currentGame: [], savedGame: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
  render();
}
//Faz a leitura dos jogos salvos no localStorage
function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGamesLocalStorage = window.localStorage.getItem("saved-games");

  if (savedGamesLocalStorage) {
    state.savedGame = JSON.parse(savedGamesLocalStorage);
  }
}
// Escreve os jogos salvos no localStorage
function writeToLocalStorage() {
  window.localStorage.setItem("saved-games", JSON.stringify(state.savedGame));
}
// Cria uma board (objeto) com 60 números
function createBoard() {
  state.board = [];
  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}
// Renderiza a board na DIV (lista e linhas)
function renderBoard() {
  var divBoard = document.querySelector("#megasena-board");
  divBoard.innerHTML = "";

  var ulNumbers = document.createElement("ul");
  ulNumbers.classList.add("numbers");

  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement("li");
    liNumber.textContent = currentNumber;
    liNumber.classList.add("number");
    liNumber.addEventListener("click", handleNumberClick);

    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add("selected-number");
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}
// Renderiza os botões na DIV
function renderButtons() {
  var divButtons = document.querySelector("#megasena-buttons");
  divButtons.innerHTML = "";

  var buttonNewGame = createNewGameButton();
  var buttonRandomGame = createRandomGameButton();
  var buttonSaveGame = createSaveGameButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
}
//Renderiza os Jogos salvos na DIV
function renderSavedGames() {
  var divSavedGames = document.querySelector("#megasena-saved-games");
  divSavedGames.innerHTML = "";

  if (state.savedGame.length === 0) {
    divSavedGames.innerHTML = "<p>Nenhum jogo salvo!</P>";
  } else {
    var ulSavedGames = document.createElement("ul");

    for (var i = 0; i < state.savedGame.length; i++) {
      var currentGame = state.savedGame[i];

      var liGame = document.createElement("li");
      liGame.textContent = currentGame.join(", ");

      ulSavedGames.appendChild(liGame);
    }

    divSavedGames.appendChild(ulSavedGames);
  }
}
//Renderiza o estado da board
function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}
//Captura os números clicados no board
function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }

  render();
}
// Cria o botão de Novo Jogo
function createNewGameButton() {
  var button = document.createElement("button");
  button.textContent = "Novo Jogo";

  button.addEventListener("click", newGame);

  return button;
}
//cria o botão de Jogo aleatório
function createRandomGameButton() {
  var button = document.createElement("button");
  button.textContent = "Jogo Aleatório";

  button.addEventListener("click", randomGame);

  return button;
}
//Cria o botão Salvar jogo
function createSaveGameButton() {
  var button = document.createElement("button");
  button.textContent = "Salvar Jogo";
  button.disabled = !isGameComplete();

  button.addEventListener("click", saveGame);

  return button;
}
// Limpa o tabuleiro para um novo jogo
function newGame() {
  resetGame();
  render();
}
// Gera um jogo aleatório
function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }
  console.log(state.currentGame);
  render();
}
// Salva o jogo atual
function saveGame() {
  if (!isGameComplete) {
    console.error("O jogo não esta completo");
    return;
  }
  state.savedGame.push(state.currentGame);
  writeToLocalStorage();
  newGame();
}
// Adicionar número ao jogo
function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error("NUMERO INVÁLIDO", numberToAdd);
    return;
  }

  if (state.currentGame.length >= 6) {
    console.error("O Jogo já está completo");
    return;
  }

  if (isNumberInGame(numberToAdd)) {
    console.error("Esse número já esta no jogo", numberToAdd);
    return;
  }

  state.currentGame.push(numberToAdd);
}
// Verifica se o número adicionado já foi adicionado anteriormente.
function isNumberInGame(numberToCheck) {
  /*   if (state.currentGame.includes(numberToCheck)) {
    return true;
  }
  return false;*/

  // mesmo resultado do if
  return state.currentGame.includes(numberToCheck);
}
// Verifica se o jogo tem 6 números
function isGameComplete() {
  return state.currentGame.length === 6;
}
// Remover um número do jogo
function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error("NUMERO INVÁLIDO", numberToRemove);
    return;
  }

  var newGame = [];

  for (var i = 0; i < state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i];

    if (currentNumber === numberToRemove) {
      continue;
    }

    newGame.push(currentNumber);
  }

  state.currentGame = newGame;
}
// Reseta o jogo atual
function resetGame() {
  state.currentGame = [];
}

start();
