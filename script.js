const firebaseConfig = {
  apiKey: "AIzaSyAb06pfDPqfQmaTYOghsVrUpu_tJR6K2Lg",
  authDomain: "dame-d02ae.firebaseapp.com",
  databaseURL: "https://dame-d02ae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dame-d02ae",
  storageBucket: "dame-d02ae.firebasestorage.app",
  messagingSenderId: "964056309428",
  appId: "1:964056309428:web:5052a599633fc92ceb41e1"
};
firebase.initializeApp(firebaseConfig);

let board = [];
let currentPlayer = 1; // 1: Bleu (Humain), 2: Rouge (IA)

// MAINTENANCE
firebase.database().ref(".info/connected").on("value", (snap) => {
    const screen = document.getElementById('maintenance-screen');
    if (snap.val() === false) {
        setTimeout(() => { if(!snap.val()) screen.classList.remove('hidden'); }, 5000);
    } else { screen.classList.add('hidden'); }
});

// NOTIFICATIONS FORCÉES
function handleChampionshipClick() {
    Notification.requestPermission().then(perm => {
        if(perm === "granted") alert("Inscriptions bientôt ouvertes !");
        else alert("Le mode Championnat nécessite les notifications pour vous alerter.");
    });
}

function showTrainingForm() {
    document.getElementById('screen_menu').classList.add('hidden');
    document.getElementById('screen_form').classList.remove('hidden');
}

function startTraining() {
    const name = document.getElementById('username').value;
    if(!name) return alert("Votre nom est requis !");
    document.getElementById('player_display').innerText = name;
    document.getElementById('screen_form').classList.add('hidden');
    document.getElementById('screen_game').classList.remove('hidden');
    initGame();
}

function initGame() {
    board = Array(8).fill().map(() => Array(8).fill(0));
    for(let r=0; r<3; r++) for(let c=(r%2==1?0:1); c<8; c+=2) board[r][c] = 2;
    for(let r=5; r<8; r++) for(let c=(r%2==1?0:1); c<8; c+=2) board[r][c] = 1;
    renderBoard();
}

function renderBoard() {
    const el = document.getElementById('board');
    el.innerHTML = '';
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(r+c)%2==0?'white':'black'}`;
            if(board[r][c] > 0) {
                const p = document.createElement('div');
                p.className = `piece ${board[r][c]==1?'blue':'red'}`;
                cell.appendChild(p);
            }
            el.appendChild(cell);
        }
    }
}

function showMenu() { location.reload(); }
function exitGame() { if(confirm("Abandonner ?")) location.reload(); }
