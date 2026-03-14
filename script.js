let board = [];
let currentPlayer = 1; 
let selected = null;

// On force le démarrage sans attendre Firebase
window.onload = () => {
    console.log("Jeu prêt");
};

function initGame() {
    board = Array(8).fill().map(() => Array(8).fill(0));
    // IA (Rouge) en haut
    for(let r=0; r<3; r++) for(let c=(r%2==1?0:1); c<8; c+=2) board[r][c] = 2; 
    // Humain (Bleu) en bas
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
                if(selected && selected.r === r && selected.c === c) p.classList.add('selected');
                cell.appendChild(p);
            }
            cell.onclick = () => handleCellClick(r, c);
            el.appendChild(cell);
        }
    }
}

function handleCellClick(r, c) {
    if(currentPlayer !== 1) return;
    if (board[r][c] === 1) {
        selected = {r, c};
        renderBoard();
    } else if (selected) {
        if (isValidMove(selected.r, selected.c, r, c)) {
            executeMove(selected.r, selected.c, r, c);
            selected = null;
            renderBoard();
            currentPlayer = 2;
            setTimeout(iaMove, 600);
        }
    }
}

function isValidMove(fr, fc, tr, tc) {
    if (board[tr][tc] !== 0) return false;
    const dr = tr - fr;
    const dc = tc - fc;
    if (dr === -1 && Math.abs(dc) === 1) return true; // Simple
    if (Math.abs(dr) === 2 && Math.abs(dc) === 2) { // Saut
        const mr = (fr+tr)/2, mc = (fc+tc)/2;
        if(board[mr][mc] === 2) return true;
    }
    return false;
}

function executeMove(fr, fc, tr, tc) {
    board[tr][tc] = board[fr][fc];
    board[fr][fc] = 0;
    if (Math.abs(tr-fr) === 2) board[(fr+tr)/2][(fc+tc)/2] = 0;
}

function iaMove() {
    let moved = false;
    for(let r=0; r<8 && !moved; r++) {
        for(let c=0; c<8 && !moved; c++) {
            if(board[r][c] === 2) {
                const targets = [[r+1,c+1],[r+1,c-1]];
                for(let [tr,tc] of targets) {
                    if(tr<8 && tc>=0 && tc<8 && board[tr][tc] === 0) {
                        executeMove(r, c, tr, tc);
                        moved = true; break;
                    }
                }
            }
        }
    }
    currentPlayer = 1;
    renderBoard();
}

function startTraining() {
    document.getElementById('screen_menu').classList.add('hidden');
    document.getElementById('screen_game').classList.remove('hidden');
    // On retire l'écran de maintenance de force
    const maint = document.getElementById('maintenance-screen');
    if(maint) maint.classList.add('hidden');
    initGame();
}
