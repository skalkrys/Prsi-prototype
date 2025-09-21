// Firebase importy
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// ⚠️ SEM vlož svůj config z Firebase
const firebaseConfig = {
  apiKey: "TVŮJ_API_KEY",
  authDomain: "prsi-online-fa7b3.firebaseapp.com",
  databaseURL: "https://prsi-online-fa7b3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "prsi-online-fa7b3",
  storageBucket: "prsi-online-fa7b3.appspot.com",
  messagingSenderId: "946839505610",
  appId: "1:946839505610:web:d2a1930d41f12eccabbc43"
};

// Inicializace
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Uložit testovací zprávu
function saveTest() {
  set(ref(db, "test/"), {
    message: "Ahoj světe!"
  });
}

// Načíst testovací zprávu
function loadTest() {
  const dbRef = ref(db);
  get(child(dbRef, "test/")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log("Data z Firebase:", snapshot.val());
    } else {
      console.log("Žádná data");
    }
  });
}

// Spuštění
saveTest();
loadTest();
// Multiplayer - generování kódu hry
function createGameId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Tlačítko pro založení hry
document.getElementById("new-game").addEventListener("click", () => {
    const gameId = createGameId();
    alert("Tvůj kód hry je: " + gameId);
});
