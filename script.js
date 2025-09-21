let deck = [];
let players = [];
let discardPile = [];
let currentPlayer = 0;

function createDeck() {
  const suits = ["♥", "♦", "♣", "♠"];
  const values = ["7", "8", "9", "10", "J", "Q", "K", "A"];
  let newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push(value + suit);
    }
  }
  return newDeck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function startGame() {
  const playerCount = parseInt(document.getElementById("playerCount").value);
  deck = shuffle(createDeck());
  players = [];

  // Rozdat 4 karty každému hráči
  for (let p = 0; p < playerCount; p++) {
    players.push(deck.splice(0, 4));
  }

  // Začít odhazovací balíček
  discardPile = [deck.pop()];

  currentPlayer = 0;
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  updateUI();
}

function updateUI() {
  document.getElementById("playerTurn").innerText = 
    `Na tahu je hráč ${currentPlayer + 1}`;
  
  let handDiv = document.getElementById("hand");
  handDiv.innerHTML = "";
  for (let card of players[currentPlayer]) {
    let cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.innerText = card;
    handDiv.appendChild(cardDiv);
  }

  let discardDiv = document.getElementById("discard");
  discardDiv.innerText = discardPile[discardPile.length - 1];
}
