// jednoduchý hot-seat prší prototyp
const SUITS = ['♣','♦','♥','♠'];
const RANKS = ['7','8','9','10','J','Q','K','A'];

let deck = [], discard = [], players = [], currentPlayer = 0, playerCount = 2;
let sevenStack = 0;

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('drawBtn').addEventListener('click', onDraw);
  document.getElementById('passBtn').addEventListener('click', ()=> showPassOverlay());
  document.getElementById('okPassBtn').addEventListener('click', ()=> { hidePassOverlay(); renderGame(); });

  // registrační pokus o service worker (povolit offline)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{/* ignore */});
  }
});

function createDeck(){
  const d = [];
  for(const s of SUITS) for(const r of RANKS) d.push({suit:s, rank:r});
  return d;
}
function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame(){
  playerCount = parseInt(document.getElementById('playerCount').value,10) || 2;
  deck = shuffle(createDeck());
  players = [];
  for(let i=0;i<playerCount;i++) players.push({hand:[]});
  const handSize = 4;
  for(let k=0;k<handSize;k++){
    for(let i=0;i<playerCount;i++){
      players[i].hand.push(deck.pop());
    }
  }
  // zajistit počáteční kartu není těžká speciálka (zjednodušení)
  let top = deck.pop();
  while(['7','J','A'].includes(top.rank)){
    deck.unshift(top);
    top = deck.pop();
  }
  discard = [top];
  currentPlayer = 0;
  sevenStack = 0;
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  renderGame();
}

function renderGame(){
  document.getElementById('deckCount').textContent = deck.length;
  const top = discard[discard.length-1];
  document.getElementById('discard').textContent = top.rank + top.suit;
  document.getElementById('turnInfo').textContent = `Na tahu: Hráč ${currentPlayer+1}` + (sevenStack>0 ? ` • Trest: ${sevenStack} karet (7)` : '');

  // players area: ostatní zobrazíme jen počet karet
  const pa = document.getElementById('playersArea'); pa.innerHTML = '';
  for(let i=0;i<players.length;i++){
    const box = document.createElement('div'); box.className='playerBox';
    if(i===currentPlayer) box.innerHTML = `<strong>Hráč ${i+1} — TVŮJ TAH</strong><div>Karet: ${players[i].hand.length}</div>`;
    else box.innerHTML = `<strong>Hráč ${i+1}</strong><div>Karet: ${players[i].hand.length}</div>`;
    pa.appendChild(box);
  }

  // hand
  const handDiv = document.getElementById('hand'); handDiv.innerHTML = '';
  players[currentPlayer].hand.forEach((card, idx) => {
    const c = document.createElement('div'); c.className='card';
    c.textContent = card.rank + card.suit;
    if(canPlay(card)) c.classList.add('playable');
    c.addEventListener('click', ()=> playCard(idx));
    handDiv.appendChild(c);
  });
}

function canPlay(card){
  const top = discard[discard.length-1];
  if(sevenStack>0) return card.rank === '7';
  if(card.rank === 'J') return true; // spodek / volba barvy
  return card.suit === top.suit || card.rank === top.rank;
}

function playCard(index){
  const card = players[currentPlayer].hand[index];
  if(!canPlay(card)){ alert('Tuto kartu nelze zahrát.'); return; }

  players[currentPlayer].hand.splice(index,1);
  discard.push(card);

  // výhra
  if(players[currentPlayer].hand.length === 0){
    renderGame();
    setTimeout(()=> alert(`Hráč ${currentPlayer+1} vyhrál!`), 50);
    return;
  }

  // speciální karty
  if(card.rank === '7'){
    sevenStack += 2;
    currentPlayer = (currentPlayer + 1) % playerCount;
    showPassOverlay();
    renderGame();
    return;
  }
  if(card.rank === 'A'){
    currentPlayer = (currentPlayer + 2) % playerCount; // přeskočit jednoho hráče
    showPassOverlay();
    renderGame();
    return;
  }
  if(card.rank === 'J'){
    // vybrat barvu
    showSuitOverlay(chosen => {
      // upravíme poslední odhozenou kartu na tu vybranou barvu (J jako "barva")
      discard[discard.length-1].suit = chosen;
      currentPlayer = (currentPlayer + 1) % playerCount;
      showPassOverlay();
      renderGame();
    });
    return;
  }

  // normální karta
  currentPlayer = (currentPlayer + 1) % playerCount;
  showPassOverlay();
  renderGame();
}

function onDraw(){
  if(sevenStack > 0){
    drawCards(currentPlayer, sevenStack);
    sevenStack = 0;
    currentPlayer = (currentPlayer + 1) % playerCount;
    showPassOverlay();
    renderGame();
    return;
  }
  drawCards(currentPlayer, 1);
  renderGame();
}

function drawCards(playerIdx, n){
  for(let i=0;i<n;i++){
    if(deck.length === 0) refillDeck();
    if(deck.length === 0) break;
    players[playerIdx].hand.push(deck.pop());
  }
}

function refillDeck(){
  if(discard.length <= 1) return;
  const top = discard.pop();
  deck = shuffle(discard.splice(0));
  discard = [top];
}

/* overlayy */
function showSuitOverlay(callback){
  const overlay = document.getElementById('suitOverlay');
  const choices = document.getElementById('suitChoices');
  choices.innerHTML = '';
  SUITS.forEach(s => {
    const b = document.createElement('button');
    b.textContent = s;
    b.addEventListener('click', ()=>{
      overlay.classList.add('hidden');
      callback(s);
    });
    choices.appendChild(b);
  });
  overlay.classList.remove('hidden');
}
function showPassOverlay(){
  const po = document.getElementById('passOverlay');
  document.getElementById('passText').textContent = `Předat zařízení Hráči ${currentPlayer+1}`;
  po.classList.remove('hidden');
}
function hidePassOverlay(){ document.getElementById('passOverlay').classList.add('hidden'); }
