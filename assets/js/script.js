const cards = document.querySelectorAll(".card");
// ELEMENTOS DO CRONÔMETRO
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const playerName = document.getElementById("playerName");

// VARIÁVEIS DO TEMPO
let segundos = 0;
let intervalo = null;
let jogoIniciado = false;
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

function atualizarCronometro() {

    segundos++;

    let minutos = Math.floor(segundos / 60);
    let segundosRestantes = segundos % 60;

    timerDisplay.innerText =
        String(minutos).padStart(2, "0") + ":" +
        String(segundosRestantes).padStart(2, "0");
}

function finalizarJogo() {

    // Para o cronômetro
    clearInterval(intervalo);

    // Informa que o jogo terminou
    jogoIniciado = false;

    // Pega o nome do jogador
    let nome = playerName.value.trim();

    // Salva o resultado no ranking
    salvarRanking(nome, segundos);

    alert("Parabéns! Você completou o jogo!");
}

function salvarRanking(nome, tempo) {

    // Busca os resultados já salvos
    let ranking = JSON.parse(localStorage.getItem("rankingMemory")) || [];

    // Adiciona o novo jogador
    ranking.push({
        nome: nome,
        tempo: tempo
    });

    // Organiza do menor tempo para o maior
    ranking.sort((a, b) => a.tempo - b.tempo);

    // Guarda somente os 10 melhores
    ranking = ranking.slice(0, 10);

    // Salva no navegador
    localStorage.setItem("rankingMemory", JSON.stringify(ranking));

    // Atualiza a tabela
    mostrarRanking();
}

function iniciarJogo() {

    // Verifica se o jogador digitou o nome
    if (playerName.value.trim() === "") {
        alert("Digite seu nome para começar!");
        return;
    }

    // Zera o cronômetro
    clearInterval(intervalo);
    segundos = 0;
    timerDisplay.innerText = "00:00";

    // Reinicia as variáveis do jogo
    matched = 0;
    cardOne = cardTwo = "";
    disableDeck = false;

    // Embaralha as cartas
    shuffleCard();

    // Informa que o jogo começou
    jogoIniciado = true;
    disableDeck = false;

    // Inicia o cronômetro
    intervalo = setInterval(atualizarCronometro, 1000);
}
startButton.addEventListener("click",iniciarJogo);

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
    setTimeout(() => {
        finalizarJogo();
    }, 500);
}
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `assets/img/img-${arr[i]}.png`;
    });
}

shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

function mostrarRanking() {

    let ranking = JSON.parse(localStorage.getItem("rankingMemory")) || [];

    const rankingList = document.getElementById("rankingList");

    rankingList.innerHTML = "";

    if (ranking.length === 0) {
        rankingList.innerHTML = "<li>Nenhum jogador ainda</li>";
        return;
    }

    ranking.forEach((jogador, index) => {

        let minutos = Math.floor(jogador.tempo / 60);
        let segundos = jogador.tempo % 60;

        let tempoFormatado =
            String(minutos).padStart(2, "0") + ":" +
            String(segundos).padStart(2, "0");

        let item = document.createElement("li");

        item.textContent = `${jogador.nome} - ${tempoFormatado}`;

        rankingList.appendChild(item);
    });
}

mostrarRanking();