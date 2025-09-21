// Prší - základní textová verze

// Balíček karet (32 karet)
const suits = ["♠", "♥", "♦", "♣"];
const values = ["7", "8", "9", "10", "J", "Q", "K", "A"];
let deck = [];
let players = [];
let discardPile = [];
let currentPlayer = 0;

// HTML prvky
const output = document.createElement("div");
document.body.appendChild(output);

function initGame(numPlayers = 2) {
  deck = createDeck();
  shuffle(deck);

  players = [];
  for (let i = 0; i < numPlayers; i++) {
    players.push({
      hand: deck.splice(0, 5) // každému 5 karet
    });
  }

  // první karta na odhazovací hromádku
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

  // jednoduché pravidlo: můžeš zahrát pokud se shoduje barva nebo hodnota
  if (card[card.length - 1] === top[top.length - 1] || card.slice(0, -1) === top.slice(0, -1)) {
    discardPile.push(card);
    players[playerIndex].hand.splice(cardIndex, 1);
    nextPlayer();
  } else {
    alert("Tuto kartu nemůžeš zahrát!");
  }
  render();
}

function drawCard(playerIndex) {
  if (deck.length === 0) {
    alert("Balíček je prázdný!");
    return;
  }
  players[playerIndex].hand.push(deck.pop());
  nextPlayer();
  render();
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % players.length;
}

function render() {
  output.innerHTML = "";

  let info = document.createElement("h2");
  info.textContent = "Na tahu je hráč " + (currentPlayer + 1);
  output.appendChild(info);

  let topCard = document.createElement("p");
  topCard.textContent = "Na stole: " + discardPile[discardPile.length - 1];
  output.appendChild(topCard);

  let hand = document.createElement("div");
  hand.textContent = "Tvoje karty: " + players[currentPlayer].hand.join(", ");
  output.appendChild(hand);

  // tlačítka pro zahrání karty
  players[currentPlayer].hand.forEach((card, index) => {
    let btn = document.createElement("button");
    btn.textContent = "Zahrát " + card;
    btn.onclick = () => playCard(currentPlayer, index);
    output.appendChild(btn);
  });

  // tlačítko pro líznutí
  let drawBtn = document.createElement("button");
  drawBtn.textContent = "Líznout kartu";
  drawBtn.onclick = () => drawCard(currentPlayer);
  output.appendChild(drawBtn);
}

// spusť hru pro 2 hráče
initGame(2);
