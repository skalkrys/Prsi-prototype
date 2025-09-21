// Prší - s pravidly

const suits = ["♠", "♥", "♦", "♣"];
const values = ["7", "8", "9", "10", "J", "Q", "K", "A"];
let deck = [];
let players = [];
let discardPile = [];
let currentPlayer = 0;
let skipNext = false; // pro eso
let drawTwo = false;  // pro sedmu
let chooseSuit = null; // pro spodka

const output = document.createElement("div");
document.body.appendChild(output);

function initGame(numPlayers = 2) {
  deck = createDeck();
  shuffle(deck);

  players = [];
  for (let i = 0; i < numPlayers; i++) {
    players.push({ hand: deck.splice(0, 5) });
  }

  discardPile = [deck.pop()];
  currentPlayer = 0;
  render();
}

function createDeck() {
  let d = [];
  for (let s of suits) {
    for (let v of values) {
      d.push(v + s);
    }
  }
  return d;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function playCard(playerIndex, cardIndex) {
  let card = players[playerIndex].hand[cardIndex];
  let top = discardPile[discardPile.length - 1];

  if (
    card[card.length - 1] === top[top.length - 1] ||
    card.slice(0, -1) === top.slice(0, -1) ||
    chooseSuit === card[card.length - 1]
  ) {
    discardPile.push(card);
    players[playerIndex].hand.splice(cardIndex, 1);
    chooseSuit = null;

    // Zvláštní efekty
    if (card.startsWith("7")) drawTwo = true;
    if (card.startsWith("A")) skipNext = true;
    if (card.startsWith("J")) {
      chooseSuit = prompt("Vyber barvu: ♠ ♥ ♦ ♣");
    }

    if (players[playerIndex].hand.length === 0) {
      alert("Hráč " + (playerIndex + 1) + " vyhrál!");
      initGame(players.length);
      return;
    }

    nextPlayer();
  } else {
    alert("Tuto kartu nemůžeš zahrát!");
  }
  render();
}

function drawCard(playerIndex) {
  if (deck.length === 0) reshuffle();

  let cardsToDraw = drawTwo ? 2 : 1;
  drawTwo = false;

  for (let i = 0; i < cardsToDraw; i++) {
    players[playerIndex].hand.push(deck.pop());
  }

  nextPlayer();
  render();
}

function reshuffle() {
  let top = discardPile.pop();
  deck = discardPile;
  discardPile = [top];
  shuffle(deck);
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % players.length;

  if (skipNext) {
    skipNext = false;
    currentPlayer = (currentPlayer + 1) % players.length;
  }
}

function render() {
  output.innerHTML = "";

  let info = document.createElement("h2");
  info.textContent = "Na tahu je hráč " + (currentPlayer + 1);
  output.appendChild(info);

  let topCard = document.createElement("p");
  topCard.textContent =
    "Na stole: " +
    discardPile[discardPile.length - 1] +
    (chooseSuit ? " (zvolená barva: " + chooseSuit + ")" : "");
  output.appendChild(topCard);

  let hand = document.createElement("div");
  hand.textContent = "Tvoje karty: " + players[currentPlayer].hand.join(", ");
  output.appendChild(hand);

  players[currentPlayer].hand.forEach((card, index) => {
    let btn = document.createElement("button");
    btn.textContent = "Zahrát " + card;
    btn.onclick = () => playCard(currentPlayer, index);
    output.appendChild(btn);
  });

  let drawBtn = document.createElement("button");
  drawBtn.textContent = drawTwo ? "Líznout 2 karty" : "Líznout kartu";
  drawBtn.onclick = () => drawCard(currentPlayer);
  output.appendChild(drawBtn);
}

initGame(2);
