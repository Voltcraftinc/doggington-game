const cards = [
    { name: "Winston", breed: "Rottweiler", stats: { speed: 7, strength: 9, cuteness: 6, woofFactor: 10 }, img: "images/WINSTON.png" },
    { name: "Bella", breed: "Golden Retriever", stats: { speed: 8, strength: 7, cuteness: 10, woofFactor: 8 }, img: "images/BELLA.png" },
    { name: "Max", breed: "German Shepherd", stats: { speed: 8, strength: 8, cuteness: 6, woofFactor: 9 }, img: "images/MAX.png" },
    { name: "Poppy", breed: "Beagle", stats: { speed: 7, strength: 5, cuteness: 10, woofFactor: 7 }, img: "images/POPPY.png" },
    { name: "Rufus", breed: "Border Collie", stats: { speed: 9, strength: 6, cuteness: 9, woofFactor: 8 }, img: "images/RUFUS.png" },
    { name: "Humphrey", breed: "Bulldog", stats: { speed: 5, strength: 8, cuteness: 7, woofFactor: 9 }, img: "images/HUMPHREY.png" },
    { name: "Lulu", breed: "Pomeranian", stats: { speed: 7, strength: 3, cuteness: 10, woofFactor: 6 }, img: "images/LULU.png" },
    { name: "Apollo", breed: "Great Dane", stats: { speed: 6, strength: 9, cuteness: 7, woofFactor: 10 }, img: "images/APOLLO.png" },
    { name: "Augie", breed: "Saint Bernard", stats: { speed: 5, strength: 10, cuteness: 8, woofFactor: 9 }, img: "images/AUGIE.png" },
    { name: "Clementine", breed: "Dachshund", stats: { speed: 8, strength: 4, cuteness: 10, woofFactor: 7 }, img: "images/CLEMENTINE.png" },
    { name: "Dexter", breed: "Labrador Retriever", stats: { speed: 8, strength: 7, cuteness: 9, woofFactor: 8 }, img: "images/DEXTER.png" },
    { name: "Charlie", breed: "Cocker Spaniel", stats: { speed: 7, strength: 5, cuteness: 10, woofFactor: 6 }, img: "images/CHARLIE.png" },
    { name: "Diesel", breed: "Doberman", stats: { speed: 9, strength: 8, cuteness: 5, woofFactor: 9 }, img: "images/DIESEL.png" },
    { name: "Mochi", breed: "Shiba Inu", stats: { speed: 8, strength: 6, cuteness: 10, woofFactor: 8 }, img: "images/MOCHI.png" },
    { name: "Rosie", breed: "Jack Russell Terrier", stats: { speed: 9, strength: 4, cuteness: 9, woofFactor: 7 }, img: "images/ROSIE.png" },
    { name: "Hank", breed: "Boxer", stats: { speed: 8, strength: 8, cuteness: 7, woofFactor: 8 }, img: "images/HANK.png" },
    { name: "Sadie", breed: "Yorkshire Terrier", stats: { speed: 7, strength: 3, cuteness: 10, woofFactor: 6 }, img: "images/SADIE.png" },
    { name: "Tank", breed: "Bullmastiff", stats: { speed: 6, strength: 10, cuteness: 6, woofFactor: 9 }, img: "images/TANK.png" },
    { name: "Milo", breed: "Dalmatian", stats: { speed: 8, strength: 7, cuteness: 9, woofFactor: 7 }, img: "images/MILO.png" },
    { name: "Pepper", breed: "Schnauzer", stats: { speed: 7, strength: 6, cuteness: 8, woofFactor: 7 }, img: "images/PEPPER.png" }
];

// DOM Elements
const p1CardPic = document.getElementById("p1-card-pic");
const p2CardPic = document.getElementById("p2-card-pic");
const p1ScoreDisplay = document.getElementById("p1-score");
const p2ScoreDisplay = document.getElementById("p2-score");
const nextGameBtn = document.getElementById("next-game-btn");
const statButtons = document.querySelectorAll(".stat-btn");

let p1Score = 0;
let p2Score = 0;
let p1Deck = [];
let p2Deck = [];

function shuffleDeck() {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    p1Deck = shuffled.slice(0, shuffled.length / 2);
    p2Deck = shuffled.slice(shuffled.length / 2);
}

function displayCards() {
    const p1Card = p1Deck[0];
    p1CardPic.src = p1Card.img;
    p2CardPic.src = "images/backer.png";
}

function compareStat(stat) {
    const p1Card = p1Deck[0];
    const p2Card = p2Deck[0];
    const p1Stat = p1Card.stats[stat];
    const p2Stat = p2Card.stats[stat];

    // Add the flip animation to the CPU card
    const p2CardElement = document.getElementById("p2-card");
    p2CardElement.classList.add("flip");

    // After the animation ends, reveal the CPU card's image
    setTimeout(() => {
        p2CardPic.src = p2Card.img;

        if (p1Stat > p2Stat) {
            p1Score++;
            p1Deck.push(p2Deck.shift());
        } else if (p1Stat < p2Stat) {
            p2Score++;
            p2Deck.push(p1Deck.shift());
        }

        updateScores();
        nextGameBtn.style.display = "block";
        disableStatButtons();

        // Remove the flip class after animation completes
        p2CardElement.classList.remove("flip");

    }, 500); // Halfway through the flip animation (adjust if necessary)
}


function updateScores() {
    p1ScoreDisplay.textContent = `Player One Score: ${p1Score}`;
    p2ScoreDisplay.textContent = `CPU Score: ${p2Score}`;
}

function disableStatButtons() {
    statButtons.forEach(btn => btn.disabled = true);
}

function enableStatButtons() {
    statButtons.forEach(btn => btn.disabled = false);
}

function nextGame() {
    if (p1Deck.length === 0 || p2Deck.length === 0) {
        const winner = p1Deck.length > p2Deck.length ? "Player One" : "CPU";
        alert(`${winner} wins the game!`);
        location.reload();
    } else {
        p1Deck.push(p1Deck.shift());
        p2Deck.push(p2Deck.shift());
        displayCards();
        nextGameBtn.style.display = "none";
        enableStatButtons();
    }
}

statButtons.forEach(btn => {
    btn.addEventListener("click", () => compareStat(btn.dataset.stat));
});

nextGameBtn.addEventListener("click", nextGame);

shuffleDeck();
displayCards();
