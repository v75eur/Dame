let board = [];
let currentPlayer = 1; 
let selected = null;

// Initialisation au chargement
window.onload = () => {
    initGame();
};

function initGame() {
    board = Array(8).fill().map(() => Array(8).fill(0));
    // IA (Pions rouges)
    for(let r=0; r<3; r++) for(let c=(r%2==1?0:1); c<8; c+=2) board[r][c] = 2; 
    // Humain (Pions bleus)
    for(let r=5; r<8; r++) for(let c=(r%2==1?0:1); c<8; c+=2) board[r][c] = 1; 
    renderBoard();
}

function renderBoard() {
    const el = document.getElementById('board');
    if(!el) return;
    el.innerHTML = '';
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(r+c)%2==0?'white':'black'}`;
            
            if(board[r][c] > 0) {
                const p = document.createElement('div');
                p.className = `piece ${board[r][c]==1?'blue':'red'}`;
                if(selected && selected.r === r && selected.c === c) {
                    p.style.border = "3px solid yellow"; // Highlight de sélection
                }
                cell.appendChild(p);
            }
            
            cell.onclick = () => handleCellClick(r, c);
            el.appendChild(cell);
        }
    }
}

function handleCellClick(r, c) {
    // 1. Sélection du pion
    if (board[r][c] === 1) {
        selected = {r, c};
        renderBoard();
        return;
    }

    // 2. Déplacement si un pion est sélectionné
    if (selected) {
        if (isValidMove(selected.r, selected.c, r, c)) {
            executeMove(selected.r, selected.c, r, c);
            selected = null;
            renderBoard();
            
            // Tour de l'IA
            setTimeout(iaMove, 600);
        }
    }
}

function isValidMove(fr, fc, tr, tc) {
    if (board[tr][tc] !== 0) return false; // Case occupée
    const dr = tr - fr;
    const dc = tc - fc;
    
    // Déplacement simple (vers le haut pour le bleu)
    if (dr === -1 && Math.abs(dc) === 1) return true;
    
    // Capture (Saut)
    if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
        const mr = (fr + tr) / 2;
        const mc = (fc + tc) / 2;
        if (board[mr][mc] === 2) return true;
    }
    return false;
}

function executeMove(fr, fc, tr, tc) {
    board[tr][tc] = board[fr][fc];
    board[fr][fc] = 0;
    if (Math.abs(tr - fr) === 2) {
        board[(fr + tr) / 2][0 + (fc + tc) / 2] = 0; // On mange
    }
}

function iaMove() {
    // IA Basique pour tester le mouvement
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            if(board[r][c] === 2) {
                if(r+1 < 8 && c+1 < 8 && board[r+1][c+1] === 0) {
                    executeMove(r, c, r+1, c+1);
                    renderBoard();
                    return;
                }
            }
        }
    }
}

// Fonctions pour les boutons du menu
function startTraining() {
    document.getElementById('screen_menu').classList.add('hidden');
    document.getElementById('screen_game').classList.remove('hidden');
    initGame();
}
