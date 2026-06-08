let selectedFormation = "4-3-3";
let selectedDifficulty = "easy";
let currentPitchFormation = [];
let lockedNamesRegistry = [];
let sessionTeamsHistory = [];
let playerAwaitingPlacement = null;
let activeRoundCount = 0;
let remainingRerolls = 3;

const tacticPitchRows = {
    "4-3-3": { A: ["EXE", "PL", "EXD"], M: ["MC", "MC", "MC"], D: ["DE", "DC", "DC", "DD"] },
    "4-4-2": { A: ["PL", "PL"], M: ["ME", "MC", "MC", "MD"], D: ["DE", "DC", "DC", "DD"] },
    "5-3-2": { A: ["PL", "PL"], M: ["MC", "MC", "MC"], D: ["DE", "DC", "DC", "DC", "DD"] },
    "3-5-2": { A: ["PL", "PL"], M: ["ME", "MC", "MDC", "MC", "MD"], D: ["DC", "DC", "DC"] },
    "5-4-1": { A: ["PL"], M: ["ME", "MC", "MC", "MD"], D: ["DE", "DC", "DC", "DC", "DD"] },
    "3-4-3": { A: ["EXE", "PL", "EXD"], M: ["ME", "MC", "MC", "MD"], D: ["DC", "DC", "DC"] }
};

const roleCompatibility = {
    "GR": ["GR"], "DC": ["DC"], "DD": ["DD", "MD"], "DE": ["DE", "ME"],
    "MDC": ["MDC", "MC"], "MC": ["MC", "MDC"], "MCO": ["MCO", "MC"],
    "MD": ["MD", "EXD", "DD"], "ME": ["ME", "EXE", "DE"],
    "EXD": ["EXD", "MD"], "EXE": ["EXE", "ME"], "PL": ["PL"]
};

const colorMap = {
    "GR": "var(--color-gr)", "DD": "var(--color-def)", "DE": "var(--color-def)", "DC": "var(--color-def)",
    "MC": "var(--color-med)", "MDC": "var(--color-med)", "MCO": "var(--color-med)", "MD": "var(--color-med)",
    "ME": "var(--color-med)", "EXD": "var(--color-ata)", "EXE": "var(--color-ata)", "PL": "var(--color-ata)"
};

window.addEventListener('DOMContentLoaded', () => {
    if (typeof database !== 'undefined' && database.length > 0) {
        document.getElementById("st-reg").innerText = database.length;
        let stems = new Set(database.map(e => e.id.split('_')[0]));
        document.getElementById("st-clb").innerText = stems.size;
        let plyrs = database.reduce((s, c) => s + c.jogadores.length, 0);
        document.getElementById("st-jog").innerText = plyrs;
    }
});

function toggleInterfaceTheme() {
    document.body.classList.toggle("dark-theme");
}

function setForm(f, element) {
    selectedFormation = f;
    document.querySelectorAll("#group-formations .selector-card").forEach(c => c.classList.remove("active-card"));
    element.classList.add("active-card");
}

function setDiff(d, element) {
    selectedDifficulty = d;
    document.querySelectorAll("#group-difficulties .selector-card").forEach(c => c.classList.remove("active-card"));
    element.classList.add("active-card");
    document.getElementById("lbl-diff-desc").innerText = d === "easy" ? "Permite equipas All-Time e concede 3 baralhamentos livres." : d === "medium" ? "Futebol real competitivo. Sem baralhamentos disponíveis." : "Modo Cego! Sem baralhamentos e com os Overalls ocultos no sorteio.";
}

function startDraftSession() {
    if (typeof database === 'undefined' || database.length === 0) return;
    document.getElementById("projection-zone").style.display = "none";
    document.getElementById("btn-simulate-season").style.display = "none";
    
    const rowsSetup = tacticPitchRows[selectedFormation];
    currentPitchFormation = [];
    currentPitchFormation.push({ id: "GR-G-0", sector: "G", role: "GR", name: null, ovr: null });
    
    ["D", "M", "A"].forEach(key => {
        rowsSetup[key].forEach((pos, idx) => {
            currentPitchFormation.push({ id: `${pos}-${key}-${idx}`, sector: key, role: pos, name: null, ovr: null });
        });
    });

    lockedNamesRegistry = []; sessionTeamsHistory = []; activeRoundCount = 0; playerAwaitingPlacement = null;
    remainingRerolls = (selectedDifficulty === "easy") ? 3 : 0;
    
    const uiReroll = document.getElementById("reroll-counter");
    if (remainingRerolls > 0) {
        uiReroll.innerText = `Baralhamentos: ${remainingRerolls}`;
        uiReroll.style.display = "inline";
    } else {
        uiReroll.style.display = "none";
    }

    document.getElementById("main-menu").style.display = "none";
    document.getElementById("game-container").style.display = "grid";
    buildVisualPitch();
    updateRoundLabels();
    calculateTeamOveralls();
}

function buildVisualPitch() {
    const pitch = document.getElementById("live-pitch");
    pitch.innerHTML = '<div class="pitch-center-circle"></div>';
    ["A", "M", "D", "G"].forEach(sec => {
        const nodes = currentPitchFormation.filter(n => n.sector === sec);
        const rowDiv = document.createElement("div");
        rowDiv.className = "pitch-line-row";
        nodes.forEach(node => {
            const nodeDiv = document.createElement("div");
            nodeDiv.className = "pitch-player-node";
            nodeDiv.id = `node-ui-${node.id}`;
            const color = colorMap[node.role] || "#475569";
            if (node.name) {
                nodeDiv.classList.add("node-filled");
                nodeDiv.style.borderTop = `4px solid ${color}`;
                nodeDiv.innerHTML = `<div class="node-pos" style="background:${color}; color:#fff;">${node.role}</div><div class="node-name">${node.name.split(" ")[0]}</div><div class="node-ovr" style="color:${color}">${node.ovr}</div>`;
            } else {
                nodeDiv.innerHTML = `<div class="node-pos" style="background:#475569; color:#fff;">${node.role}</div><div class="node-ovr" style="color:rgba(255,255,255,0.6); font-size:12px;">+</div>`;
            }
            rowDiv.appendChild(nodeDiv);
        });
        pitch.appendChild(rowDiv);
    });
}

function drawNextTeamSquad() {
    playerAwaitingPlacement = null;
    clearPitchNodeHighlights();
    const nationalTags = ["por_", "slb_", "scp_", "bel_", "boa_", "scb_", "vsc_", "cfb_", "sal_", "far_", "cam_", "bei_", "lei_", "set_", "aca_", "pac_", "ave_"];
    let pool = database.filter(e => {
        const hasValidTag = nationalTags.some(tag => e.id.startsWith(tag));
        const isUcl = e.isChampionsOnly === true || e.isChampionsOnly === "true";
        return hasValidTag && !isUcl;
    });
    if (selectedDifficulty !== "easy") pool = pool.filter(e => !e.id.includes("alltime"));
    let available = pool.filter(e => !sessionTeamsHistory.includes(e.id));
    if (available.length === 0) { sessionTeamsHistory = []; available = pool; }
    
    const team = available[Math.floor(Math.random() * available.length)];
    sessionTeamsHistory.push(team.id);
    document.getElementById("display-team-name").innerText = team.nomeEquipa;
    
    const grid = document.getElementById("display-players-grid");
    grid.innerHTML = "";
    team.jogadores.forEach(p => {
        const card = document.createElement("div");
        card.className = "player-card";
        const pName = p.nome || p.name;
        const isLocked = lockedNamesRegistry.includes(pName);
        let compatibleSlot = false;
        
        p.posicoes.forEach(pos => {
            currentPitchFormation.forEach(node => {
                let allowed = roleCompatibility[node.role] || [node.role];
                if (allowed.includes(pos) && !node.name) compatibleSlot = true;
            });
        });

        if (isLocked || !compatibleSlot) card.classList.add("disabled-card");
        else card.onclick = () => bindSelectedPlayerCard(p, card);

        const color = colorMap[p.posicoes[0]] || "#334155";
        card.innerHTML = `<div class="card-top"><span class="card-pos" style="background:${color}">${p.posicoes.join("/")}</span><span class="card-ovr">${selectedDifficulty === "hard" ? "?" : p.ovr}</span></div><div style="font-weight:900; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${pName}</div>`;
        grid.appendChild(card);
    });
    document.getElementById("draw-squad-zone").style.display = "block";
    document.getElementById("btn-trigger-draw").style.display = "none";
    if (remainingRerolls > 0) document.getElementById("btn-trigger-reroll").style.display = "block";
}

function executeReroll() {
    if (remainingRerolls <= 0) return;
    remainingRerolls--;
    document.getElementById("reroll-counter").innerText = `Baralhamentos: ${remainingRerolls}`;
    document.getElementById("btn-trigger-reroll").style.display = "none";
    drawNextTeamSquad();
}

function bindSelectedPlayerCard(player, cardEl) {
    document.querySelectorAll('.player-card').forEach(c => c.classList.remove('selected-card'));
    clearPitchNodeHighlights();
    playerAwaitingPlacement = player;
    cardEl.classList.add('selected-card');
    player.posicoes.forEach(pos => {
        currentPitchFormation.forEach(node => {
            let allowed = roleCompatibility[node.role] || [node.role];
            if (allowed.includes(pos) && !node.name) {
                const targetUi = document.getElementById(`node-ui-${node.id}`);
                if (targetUi) {
                    targetUi.classList.add("node-active");
                    targetUi.onclick = () => confirmPlayerPlacement(node);
                }
            }
        });
    });
}

function confirmPlayerPlacement(targetNode) {
    try {
        if (!playerAwaitingPlacement) return;
        const pName = playerAwaitingPlacement.nome || playerAwaitingPlacement.name || "Jogador";
        targetNode.name = pName;
        targetNode.ovr = parseInt(playerAwaitingPlacement.ovr, 10) || 80;
        lockedNamesRegistry.push(pName);
        activeRoundCount++;
        playerAwaitingPlacement = null;
        
        document.getElementById("draw-squad-zone").style.display = "none";
        document.getElementById("btn-trigger-reroll").style.display = "none";
        buildVisualPitch();
        calculateTeamOveralls();
        
        if (activeRoundCount < 11) {
            updateRoundLabels();
            document.getElementById("btn-trigger-draw").style.display = "block";
        } else {
            document.getElementById("round-title").innerText = "Draft Completo!";
            document.getElementById("btn-trigger-draw").style.display = "none";
            document.getElementById("btn-simulate-season").style.display = "block";
            triggerPreSeasonOddsDisplay();
        }
    } catch (err) {
        document.getElementById("btn-trigger-draw").style.display = "block";
    }
}

function calculateTeamOveralls() {
    const def = currentPitchFormation.filter(n => ["G", "D"].includes(n.sector) && n.name);
    const med = currentPitchFormation.filter(n => n.sector === "M" && n.name);
    const ata = currentPitchFormation.filter(n => n.sector === "A" && n.name);
    const tot = currentPitchFormation.filter(n => n.name);
    
    const aDef = def.length ? Math.round(def.reduce((s, n) => s + parseInt(n.ovr || 0, 10), 0) / def.length) : 0;
    const aMed = med.length ? Math.round(med.reduce((s, n) => s + parseInt(n.ovr || 0, 10), 0) / med.length) : 0;
    const aAta = ata.length ? Math.round(ata.reduce((s, n) => s + parseInt(n.ovr || 0, 10), 0) / ata.length) : 0;
    const aTot = tot.length ? Math.round(tot.reduce((s, n) => s + parseInt(n.ovr || 0, 10), 0) / tot.length) : 0;
    
    document.getElementById("ovr-def").innerText = aDef;
    document.getElementById("ovr-med").innerText = aMed;
    document.getElementById("ovr-ata").innerText = aAta;
    document.getElementById("ovr-tot").innerText = aTot;
    return { def: aDef, med: aMed, ata: aAta, ger: aTot };
}

/* CURVA DE ODDS FLUIDA E PROGRESSIVA SOLICITADA */
function computeDynamicOdds(ovr, targetMin) {
    let base = 50;
    let diff = ovr - targetMin;
    let pct = base + (diff * 7); 
    return Math.max(1, Math.min(99, Math.round(pct)));
}

function evalCupStage(userStats, reqMed, reqSec) {
    if (userStats.ger >= reqMed && userStats.def >= reqSec && userStats.med >= reqSec && userStats.ata >= reqSec) {
        return Math.random() > 0.02;
    }
    return Math.random() < 0.12;
}

function runSeasonSimulation() {
    const scores = calculateTeamOveralls();
    const localScorers = currentPitchFormation.filter(n => ["M", "A"].includes(n.sector) && n.name).map(n => n.name.split(" ")[0]);
    const clubTags = ["por_", "slb_", "scp_", "bel_", "boa_", "scb_", "vsc_", "cfb_", "sal_", "far_", "cam_", "bei_", "lei_", "set_", "aca_", "pac_", "ave_"];
    let chosenLeagueClubs = [];
    
    clubTags.forEach(tag => {
        let pool = database.filter(e => e.id.startsWith(tag) && !e.id.includes("alltime"));
        if (pool.length > 0) {
            let selected = pool[0];
            if (tag === "por_") {
                let m = pool.find(e => e.nomeEquipa.includes("2004") || e.id.includes("2004")); if (m) selected = m;
            } else if (tag === "slb_") {
                let m = pool.find(e => e.nomeEquipa.includes("1962") || e.id.includes("1962")); if (m) selected = m;
            } else if (tag === "scp_") {
                let m = pool.find(e => e.nomeEquipa.includes("2025") || e.id.includes("2025")); if (m) selected = m;
            } else {
                pool.sort((a,b) => b.jogadores.reduce((s,n)=>s+parseInt(n.ovr || 0, 10),0) - a.jogadores.reduce((s,n)=>s+parseInt(n.ovr || 0, 10),0));
                selected = pool[0];
            }
            chosenLeagueClubs.push(selected);
        }
    });

    const screen = document.getElementById("simulation-screen");
    screen.style.display = "block";
    document.getElementById("game-container").style.display = "none";
    const timeline = document.getElementById("simulation-matches-timeline");
    timeline.innerHTML = "";

    const blockLiga = document.createElement("div");
    blockLiga.className = "comp-block-container";
    blockLiga.innerHTML = "<h2>Liga Portugal</h2>";
    
    let tableData = [{ id: "user_draft", name: "A Tua Equipa (Draft)", ger: scores.ger, points: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, isUser: true }];
    chosenLeagueClubs.forEach(club => {
        const cAvg = Math.round(club.jogadores.reduce((s, n) => s + parseInt(n.ovr || 0, 10), 0) / club.jogadores.length);
        tableData.push({ id: club.id, name: club.nomeEquipa, ger: cAvg, points: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, isUser: false });
    });

    let meetsLiga = (scores.ger >= 86 && scores.def >= 84 && scores.med >= 84 && scores.ata >= 84);
    if (meetsLiga && Math.random() > 0.02) {
        tableData.forEach(t => { 
            if(t.isUser) { t.points = 102; t.w = 34; t.gf = 98; t.ga = 12; } 
            else { t.points = Math.floor(Math.random()*48)+24; t.w = Math.floor(t.points/3); t.d = t.points%3; t.l = 34-t.w-t.d; t.gf = Math.floor(Math.random()*35)+25; t.ga = Math.floor(Math.random()*25)+45; } 
        });
    } else {
        for (let i = 0; i < tableData.length; i++) {
            for (let j = i + 1; j < tableData.length; j++) { determineLgPlacementGolos(tableData[i], tableData[j]); determineLgPlacementGolos(tableData[j], tableData[i]); }
        }
    }
    tableData.sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
    let tableHtml = `<table class="league-table"><thead><tr><th>Pos</th><th>Equipa</th><th>Pnt</th><th>V</th><th>E</th><th>D</th><th>GM</th><th>GS</th></tr></thead><tbody>`;
    tableData.forEach((row, idx) => { tableHtml += `<tr class="${row.isUser ? 'user-team-row' : ''}"><td>${idx + 1}º</td><td>${row.name}</td><td><b>${row.points}</b></td><td>${row.w}</td><td>${row.d}</td><td>${row.l}</td><td>${row.gf}</td><td>${row.ga}</td></tr>`; });
    tableHtml += `</tbody></table>`;
    const tableDiv = document.createElement("div"); tableDiv.innerHTML = tableHtml; blockLiga.appendChild(tableDiv); timeline.appendChild(blockLiga);

    const blockTL = document.createElement("div"); blockTL.className = "comp-block-container"; blockTL.innerHTML = "<h2>Taça da Liga</h2>";
    let tlStatus = evalCupStage(scores, 82, 80); appendDetailedMatchCard(blockTL, "Quartos de Final (Jogo Único)", tableData[0], chosenLeagueClubs[0], tlStatus, false);
    let tlStatus2 = tlStatus ? evalCupStage(scores, 82, 80) : false; if(tlStatus) appendDetailedMatchCard(blockTL, "Meia-Final (Final Four)", tableData[0], chosenLeagueClubs[1], tlStatus2, false);
    let tlStatus3 = tlStatus2 ? evalCupStage(scores, 82, 80) : false; if(tlStatus2) appendDetailedMatchCard(blockTL, "Grande Final", tableData[0], chosenLeagueClubs[2], tlStatus3, false);
    timeline.appendChild(blockTL);

    const blockTP = document.createElement("div"); blockTP.className = "comp-block-container"; blockTP.innerHTML = "<h2>Taça de Portugal</h2>";
    let tpStatus = evalCupStage(scores, 84, 82); appendDetailedMatchCard(blockTP, "32 avos de Final", tableData[0], chosenLeagueClubs[3], tpStatus, false);
    let tpStatus2 = tpStatus ? evalCupStage(scores, 84, 82) : false; if(tpStatus) appendDetailedMatchCard(blockTP, "16 avos de Final", tableData[0], chosenLeagueClubs[4], tpStatus2, false);
    let tpStatus3 = tpStatus2 ? evalCupStage(scores, 84, 82) : false; if(tpStatus2) appendDetailedMatchCard(blockTP, "8 avos de Final", tableData[0], chosenLeagueClubs[5], tpStatus3, false);
    let tpStatus4 = tpStatus3 ? evalCupStage(scores, 84, 82) : false; if(tpStatus3) appendDetailedMatchCard(blockTP, "Quartos de Final (Jogo Único)", tableData[0], chosenLeagueClubs[6], tpStatus4, false);
    let tpStatus5 = tpStatus4 ? evalCupStage(scores, 84, 82) : false; if(tpStatus4) { appendTwoLeggedTie(blockTP, "Meia-Final", tableData[0], chosenLeagueClubs[0], tpStatus5); }
    let tpStatus6 = tpStatus5 ? evalCupStage(scores, 84, 82) : false; if(tpStatus5) appendDetailedMatchCard(blockTP, "Grande Final (Jamor)", tableData[0], chosenLeagueClubs[1], tpStatus6, false);
    timeline.appendChild(blockTP);

    /* INJEÇÃO BLINDADA DO ARRAY DE POTÊNCIAS DA UCL EVITANDO INDEX OUT OF BOUNDS */
    const blockUCL = document.createElement("div"); blockUCL.className = "comp-block-container"; blockUCL.innerHTML = "<h2>UEFA Champions League</h2>";
    let uclPoolRaw = database.filter(e => e.isChampionsOnly === true || e.isChampionsOnly === "true");
    let uniqueUclClubs = []; let uniqueNamesSet = new Set();
    uclPoolRaw.forEach(c => {
        let baseName = c.nomeEquipa.replace(/\s\d+$/, "").trim();
        if(!uniqueNamesSet.has(baseName)) { uniqueNamesSet.add(baseName); uniqueUclClubs.push(c); }
    });
    let safetyNames = ["Arsenal", "Napoli", "Marseille", "Roma", "Lazio", "Sevilla", "Villarreal", "Lyon UCL", "Fiorentina", "Leverkusen", "Dortmund", "Monaco UCL", "Feyenoord", "Ajax UCL", "Milan UCL", "Man United", "Newcastle", "Real Sociedad", "Atalanta", "Frankfurt"];
    let sIdx = 0;
    while(uniqueUclClubs.length < 40) {
        let n = safetyNames[sIdx % safetyNames.length];
        if(!uniqueNamesSet.has(n)) uniqueUclClubs.push({ nomeEquipa: n, jogadores: [] });
        sIdx++;
    }

    let uclTable = [{ id: "user", name: "A Tua Equipa (Draft)", points: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, isUser: true }];
    for(let k=0; k<35; k++) { uclTable.push({ id: `cpu_${k}`, name: uniqueUclClubs[k].nomeEquipa, points: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, isUser: false }); }

    for (let m = 1; m <= 8; m++) {
        let oppInTable = uclTable[m]; let winM = evalCupStage(scores, 88, 86);
        let gA = 0, gB = 0;
        if(winM) { uclTable[0].points += 3; uclTable[0].w++; gA = Math.floor(Math.random()*3)+1; gB = Math.floor(Math.random()*gA); } 
        else { 
            if(Math.random() > 0.45) { uclTable[0].points += 1; oppInTable.points += 1; uclTable[0].d++; oppInTable.d++; gA = Math.floor(Math.random()*2); gB = gA; } 
            else { oppInTable.points += 3; oppInTable.w++; uclTable[0].l++; gB = Math.floor(Math.random()*3)+1; gA = Math.floor(Math.random()*gB); } 
        }
        uclTable[0].gf += gA; uclTable[0].ga += gB; oppInTable.gf += gB; oppInTable.ga += gA;
        let oppOriginal = uniqueUclClubs[m-1];
        let goalsLog = generateScorersBlock(gA > 0, gA, localScorers, gB > 0, gB, oppOriginal.jogadores ? oppOriginal.jogadores.map(n => n.nome) : ["Oponente"]);
        const mCard = document.createElement("div"); mCard.className = "match-card"; mCard.innerHTML = `<div class="match-header"><span>Jogo ${m} (${m<=4?'Casa':'Fora'})</span><span style="color:${gA>gB?'var(--pt-green)':gA===gB?'var(--pt-amber)':'var(--pt-red)'}">${gA>gB?'VITÓRIA':gA===gB?'EMPATE':'DERROTA'} ${gA}-${gB} vs ${oppOriginal.nomeEquipa}</span></div><div class="match-scorers">${goalsLog}</div>`; blockUCL.appendChild(mCard);
    }

    for(let k=1; k<36; k++) { 
        let rngPts = Math.floor(Math.random()*13)+5; uclTable[k].points += rngPts;
        uclTable[k].w = Math.floor(rngPts/3); uclTable[k].d = rngPts%3; uclTable[k].l = 8 - uclTable[k].w - uclTable[k].d;
        uclTable[k].gf += Math.floor(Math.random()*14)+4; uclTable[k].ga += Math.floor(Math.random()*10)+4;
    }
    uclTable.sort((a,b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
    let userRank = uclTable.findIndex(t => t.isUser) + 1;

    let clTableHtml = `<div class="match-card"><h3>Classificação Fase de Liga (36 Equipas)</h3><table class="league-table"><thead><tr><th>Pos</th><th>Equipa</th><th>Pnt</th><th>V</th><th>E</th><th>D</th><th>GM</th><th>GS</th></tr></thead><tbody>`;
    uclTable.forEach((row, idx) => {
        let rowClass = row.isUser ? 'user-team-row' : '';
        clTableHtml += `<tr class="${rowClass}"><td>${idx + 1}º</td><td>${row.name}</td><td><b>${row.points}</b></td><td>${row.w}</td><td>${row.d}</td><td>${row.l}</td><td>${row.gf}</td><td>${row.ga}</td></tr>`;
    });
    clTableHtml += `</tbody></table></div>`;
    let clTableWrapper = document.createElement("div"); clTableWrapper.innerHTML = clTableHtml; blockUCL.appendChild(clTableWrapper);

    if (userRank >= 25) {
        let failCard = document.createElement("div"); failCard.className = "match-card"; failCard.style.borderLeft = "6px solid var(--pt-red)"; failCard.innerHTML = `<div class="match-header" style="color:var(--pt-red)">Eliminação Direta</div><p>Posição ${userRank}º está fora do Top 24. Foste eliminado e não avanças na Champions.</p>`;
        blockUCL.appendChild(failCard); timeline.appendChild(blockUCL); return;
    }

    let chStatus = userRank <= 8 ? true : evalCupStage(scores, 88, 86); 
    if(userRank > 8) { appendTwoLeggedTie(blockUCL, "Playoffs de Acesso", tableData[0], uniqueUclClubs[15], chStatus); }
    let chStatus2 = chStatus ? evalCupStage(scores, 88, 86) : false; if(chStatus) { appendTwoLeggedTie(blockUCL, "Oitavos de Final", tableData[0], uniqueUclClubs[16], chStatus2); }
    let chStatus3 = chStatus2 ? evalCupStage(scores, 88, 86) : false; if(chStatus2) { appendTwoLeggedTie(blockUCL, "Quartos de Final", tableData[0], uniqueUclClubs[17], chStatus3); }
    let chStatus4 = chStatus3 ? evalCupStage(scores, 88, 86) : false; if(chStatus3) { appendTwoLeggedTie(blockUCL, "Meias-Finais", tableData[0], uniqueUclClubs[18], chStatus4); }
    let chStatus5 = chStatus4 ? evalCupStage(scores, 88, 86) : false; if(chStatus4) appendDetailedMatchCard(blockUCL, "Grande Final Europeia (Jogo Único)", tableData[0], uniqueUclClubs[19], chStatus5, false);
    timeline.appendChild(blockUCL);

    let completelyPerfect = (tableData[0].w === 34 && tlStatus3 && tpStatus6 && chStatus5 && scores.ger >= 90 && scores.def >= 88 && scores.med >= 88 && scores.ata >= 88);
    if (completelyPerfect) { screen.classList.add("perfect-screen"); const b = document.createElement("div"); b.style.cssText = "background:#eab308; color:#0f172a; padding:20px; border-radius:8px; font-weight:900; font-size:22px; text-align:center; margin-bottom:20px;"; b.innerText = "⭐ LENDA ABSOLUTA: ALCANÇASTE O 4a0 PERFEITO! QUADRUPLE INVICTO COM OVERALL DE CAMPEÃO ⭐"; timeline.insertBefore(b, timeline.firstChild); }
}

/* BALANÇO DE DIFICULDADE ATUALIZADO DINAMICAMENTE NO CONFRONTO */
function determineLgPlacementGolos(teamA, teamB) {
    let gerA = teamA.ger; let gerB = teamB.ger;
    if (!teamA.isUser && selectedDifficulty === "medium") gerA += 4;
    if (!teamA.isUser && selectedDifficulty === "hard") gerA += 8;
    if (!teamB.isUser && selectedDifficulty === "medium") gerB += 4;
    if (!teamB.isUser && selectedDifficulty === "hard") gerB += 8;

    const diff = gerA - gerB; const probA = 0.43 + (diff * 0.035); const rng = Math.random();
    let gA = 0, gB = 0;
    if (rng < probA) { teamA.points += 3; teamA.w++; teamB.l++; gA = Math.floor(Math.random()*3)+1; gB = Math.floor(Math.random()*gA); } 
    else if (rng < probA + 0.22) { teamA.points += 1; teamB.points += 1; teamA.d++; teamB.d++; gA = Math.floor(Math.random()*2); gB = gA; } 
    else { teamB.points += 3; teamB.w++; teamA.l++; gB = Math.floor(Math.random()*3)+1; gA = Math.floor(Math.random()*gB); }
    teamA.gf += gA; teamA.ga += gB; teamB.gf += gB; teamB.ga += gA;
}

function generateScorersBlock(hasGoalsA, goalsA, squadA, hasGoalsB, goalsB, squadB) {
    let logA = [], logB = [];
    if (hasGoalsA && goalsA > 0 && squadA.length) { for (let i = 0; i < goalsA; i++) { logA.push(`${squadA[Math.floor(Math.random() * squadA.length)]} ${Math.floor(Math.random() * 86) + 2}'`); } }
    if (hasGoalsB && goalsB > 0 && squadB.length) { for (let i = 0; i < goalsB; i++) { let name = squadB[Math.floor(Math.random() * squadB.length)]; logB.push(`${(typeof name === 'string' ? name : name.nome).split(" ")[0]} ${Math.floor(Math.random() * 86) + 2}'`); } }
    return `Golos Casa: ${logA.length ? logA.join(", ") : 'Nenhum'} | Golos Fora: ${logB.length ? logB.join(", ") : 'Nenhum'}`;
}

function appendTwoLeggedTie(container, stageName, userTeam, opponent, isUserWin) {
    let gA1 = isUserWin ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
    let gB1 = isUserWin ? Math.floor(Math.random() * gA1) : Math.floor(Math.random() * 2) + 1;
    let gA2 = isUserWin ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
    let gB2 = isUserWin ? Math.floor(Math.random() * gA2) : Math.floor(Math.random() * 2) + 1;

    let totalUser = gA1 + gA2; let totalOpp = gB1 + gB2;
    if (isUserWin && totalUser <= totalOpp) { gA2 += (totalOpp - totalUser) + 1; } 
    else if (!isUserWin && totalUser >= totalOpp) { gB2 += (totalUser - totalOpp) + 1; }

    let aggA = gA1 + gA2; let aggB = gB1 + gB2;
    renderLegCard(container, stageName + " - 1ª Mão", gA1, gB1, opponent, aggA, aggB);
    renderLegCard(container, stageName + " - 2ª Mão", gA2, gB2, opponent, aggA, aggB);
}

function renderLegCard(container, label, gA, gB, opponent, aggA, aggB) {
    const card = document.createElement("div"); card.className = "match-card";
    const oppPlayers = opponent.jogadores ? opponent.jogadores.map(n => n.nome) : ["Oponente"];
    const userPlayers = currentPitchFormation.map(n => n.name ? n.name.split(" ")[0] : "Jogador");
    let goalsLog = generateScorersBlock(gA > 0, gA, userPlayers, gB > 0, gB, oppPlayers);
    let colorResult = gA > gB ? 'var(--pt-green)' : gA === gB ? 'var(--pt-amber)' : 'var(--pt-red)';
    card.innerHTML = `<div class="match-header"><span>${label}</span><span style="color: ${colorResult}">${gA > gB ? 'VITÓRIA' : gA === gB ? 'EMPATE' : 'DERROTA'} ${gA} - ${gB} vs ${opponent.nomeEquipa || opponent.name || "Colosso"} <span style='font-size:11px; color:var(--text-muted);'>(Agregado: ${aggA}-${aggB})</span></span></div><div class="match-scorers">${goalsLog}</div>`;
    container.appendChild(card);
}

function appendDetailedMatchCard(container, stageName, userTeam, opponent, isUserWin, isTwoLegged) {
    const card = document.createElement("div"); card.className = "match-card";
    let goalsA = isUserWin ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
    let goalsB = isUserWin ? Math.floor(Math.random() * goalsA) : Math.floor(Math.random() * 2) + 1;
    if (!isUserWin && goalsA === goalsB) goalsB++;
    const oppPlayers = opponent.jogadores ? opponent.jogadores.map(n => n.nome) : ["Oponente"];
    const userPlayers = currentPitchFormation.map(n => n.name ? n.name.split(" ")[0] : "Jogador");
    let goalsLog = generateScorersBlock(true, goalsA, userPlayers, true, goalsB, oppPlayers);
    let colorResult = goalsA > goalsB ? 'var(--pt-green)' : goalsA === goalsB ? 'var(--pt-amber)' : 'var(--pt-red)';
    card.innerHTML = `<div class="match-header"><span>${stageName}</span><span style="color: ${colorResult}">${goalsA > goalsB ? 'VITÓRIA' : goalsA === goalsB ? 'EMPATE' : 'DERROTA'} ${goalsA} - ${goalsB} vs ${opponent.nomeEquipa || opponent.name || "Colosso"}</span></div><div class="match-scorers">${goalsLog}</div>`;
    container.appendChild(card);
}

function clearPitchNodeHighlights() { currentPitchFormation.forEach(node => { const el = document.getElementById(`node-ui-${node.id}`); if (el) { el.classList.remove("node-active"); if (!node.name) el.onclick = null; } }); }
function updateRoundLabels() { document.getElementById("round-title").innerText = `Ronda ${activeRoundCount + 1} de 11`; }

function triggerPreSeasonOddsDisplay() { 
    const scores = calculateTeamOveralls(); 
    let oddLiga = computeDynamicOdds(scores.ger, 86);
    let oddTp = computeDynamicOdds(scores.ger, 84);
    let oddTl = computeDynamicOdds(scores.ger, 82);
    let oddUcl = computeDynamicOdds(scores.ger, 88);
    
    document.getElementById("proj-place").innerText = scores.ger >= 86 ? "1º Lugar" : scores.ger >= 82 ? "2º Lugar" : "4º Lugar";
    document.getElementById("proj-points").innerText = scores.ger >= 86 ? "102 (Meta)" : Math.round(scores.ger * 0.95);
    
    document.getElementById("txt-odd-1").innerText = `${oddLiga}%`; 
    document.getElementById("txt-odd-2").innerText = `${oddTp}%`;
    document.getElementById("txt-odd-3").innerText = `${oddTl}%`; 
    document.getElementById("txt-odd-4").innerText = `${oddUcl}%`;
    document.getElementById("projection-zone").style.display = "block"; 
    
    setTimeout(() => { 
        document.getElementById("bar-odd-1").style.width = `${oddLiga}%`; 
        document.getElementById("bar-odd-2").style.width = `${oddTp}%`; 
        document.getElementById("bar-odd-3").style.width = `${oddTl}%`; 
        document.getElementById("bar-odd-4").style.width = `${oddUcl}%`; 
    }, 100);
}
