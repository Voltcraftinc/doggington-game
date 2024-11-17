// Variables to Track Game Progress
let totalRounds = 0;
let currentRound = 0;
let selectedCards = null;
let selectedWager = null;

// Cards Data
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
const statButtons = document.querySelectorAll(".stat-btn");
const gameModeButtons = document.querySelectorAll(".game-mode-btn");
const wagerButtons = document.querySelectorAll(".wager-btn");
const roundDisplay = document.createElement('div'); // Create element to show round count

let p1Score = 0;
let p2Score = 0;
let p1Deck = [];
let p2Deck = [];

// Append round display to the score container
const scoreContainer = document.getElementById('score-container');
roundDisplay.id = 'round-display';
roundDisplay.style.fontSize = '1.5rem';
scoreContainer.appendChild(roundDisplay);

// Landing Screen Logic
document.getElementById("connect-wallet-btn").addEventListener("click", () => {
    document.getElementById("landing-screen").style.display = "none";
    document.getElementById("game-setup-screen").style.display = "block";
});

// Game Setup Logic
gameModeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedCards = parseInt(btn.dataset.cards);
        document.getElementById("wager-selection").style.display = "block";
    });
});

wagerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedWager = parseInt(btn.dataset.wager);
        document.getElementById("proceed-btn").style.display = "block";
    });
});

// Proceed to Main Game Logic
document.getElementById("proceed-btn").addEventListener("click", () => {
    if (selectedCards && selectedWager) {
        totalRounds = selectedCards; // Set total rounds based on selected cards (5 or 10)
        currentRound = 1; // Start from round 1

        // Reset scores
        p1Score = 0;
        p2Score = 0;
        updateScores();

        // Update game info
        document.getElementById("deck-info").textContent = `Deck: ${selectedCards}`;
        document.getElementById("wager-info").textContent = `Wager: ${selectedWager}`;
        roundDisplay.textContent = `Round: ${currentRound} / ${totalRounds}`;

        // Hide setup screen and show game screen
        document.getElementById("game-setup-screen").style.display = "none";
        document.getElementById("main-container").style.display = "block";

        // Shuffle and deal cards based on selection
        shuffleDeck();
        p1Deck = p1Deck.slice(0, selectedCards);
        p2Deck = p2Deck.slice(0, selectedCards);
        displayCards();
    }
});

// Function to Shuffle Deck
function shuffleDeck() {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    p1Deck = shuffled.slice(0, shuffled.length / 2);
    p2Deck = shuffled.slice(shuffled.length / 2);
}

// Function to Display Cards
function displayCards() {
    const p1Card = p1Deck[0];
    p1CardPic.src = p1Card.img;
    p2CardPic.src = "images/backer.png";
    enableStatButtons(); // Ensure stat buttons are enabled for the round
}

// Function to Compare Selected Stat
function compareStat(stat) {
    disableStatButtons(); // Disable stat buttons to prevent multiple clicks during processing

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

        // Determine the winner of the round
        if (p1Stat > p2Stat) {
            p1Score++;
            p1Deck.push(p2Deck.shift());
        } else if (p1Stat < p2Stat) {
            p2Score++;
            p2Deck.push(p1Deck.shift());
        }

        updateScores();

        // Remove the flip class after animation completes
        p2CardElement.classList.remove("flip");

        // Update the round display and check if the game should end
        if (currentRound >= totalRounds) {
            displayWinnerOverlay();
        } else {
            currentRound++; // Increment the round counter
            roundDisplay.textContent = `Round: ${currentRound} / ${totalRounds}`;
            
            // Display the next round of cards automatically after a brief delay
            setTimeout(() => {
                p1Deck.push(p1Deck.shift());
                p2Deck.push(p2Deck.shift());
                displayCards();
            }, 1000); // Delay before starting the next round
        }

    }, 500); // Halfway through the flip animation (adjust if necessary)
}

// Function to Update Scores
function updateScores() {
    p1ScoreDisplay.textContent = `Player One Score: ${p1Score}`;
    p2ScoreDisplay.textContent = `CPU Score: ${p2Score}`;
}

// Function to Disable Stat Buttons
function disableStatButtons() {
    statButtons.forEach(btn => btn.disabled = true);
}

// Function to Enable Stat Buttons
function enableStatButtons() {
    statButtons.forEach(btn => btn.disabled = false);
}

// Stat Button Event Listeners
statButtons.forEach(btn => {
    btn.addEventListener("click", () => compareStat(btn.dataset.stat));
});

// Display Winner Overlay Function
function displayWinnerOverlay() {
    // Determine the winner
    const winner = p1Score > p2Score ? "Player One Wins!" : "CPU Wins!";
    const overlay = document.getElementById("game-over-overlay");
    const winnerText = document.getElementById("winner-text");

    // Set the overlay text
    winnerText.textContent = winner;

    // Show the overlay
    overlay.style.display = "flex";

    // Add animation effect
    overlay.classList.add("fade-in");

    // Enable Play Again and Exit buttons
    document.getElementById("play-again-btn").addEventListener("click", () => {
        overlay.style.display = "none";
        document.getElementById("game-setup-screen").style.display = "block";
        resetGameSetup(); // Reset the game setup to allow new selections
    });

    document.getElementById("exit-btn").addEventListener("click", () => {
        overlay.style.display = "none";
        document.getElementById("landing-screen").style.display = "block";
        document.getElementById("connect-wallet-btn").textContent = "Play";
    });
}

// Function to Reset Game Setup
function resetGameSetup() {
    // Reset game setup options
    selectedCards = null;
    selectedWager = null;

    // Hide subsequent sections in game setup screen
    document.getElementById("wager-selection").style.display = "none";
    document.getElementById("proceed-btn").style.display = "none";
}

// Initial Game Setup
shuffleDeck();
displayCards();