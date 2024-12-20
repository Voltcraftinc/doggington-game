// Variables to Track Game Progress
let totalRounds = 0;
let currentRound = 0;
let selectedCards = null;
let selectedWager = null;
let waitingForNextRound = false; // Tracks if we are in the delay period between rounds
let walletAddress = ""; // Wallet address placeholder
let doggingtonBalance = 0; // Updated to start with real balance once fetched

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

// Configure Wallet Adapters
let selectedWalletAdapter = null;
let wallets = {};

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize wallet adapters after the page loads
        if (window.solana && window.solana.isPhantom) {
            wallets.Phantom = window.solana;
            console.log("Phantom Wallet available");
        } else {
            console.warn("Phantom Wallet is not available.");
        }
        
        // Add other wallets if necessary
        wallets.Solflare = new solanaWalletAdapter.Wallets.SolflareWalletAdapter();
        wallets.Glow = new solanaWalletAdapter.Wallets.GlowWalletAdapter();
    } catch (error) {
        console.error("Error initializing wallets: ", error);
    }
});

// DOM Elements
const p1CardPic = document.getElementById("p1-card-pic");
const p2CardPic = document.getElementById("p2-card-pic");
const p1ScoreDisplay = document.getElementById("p1-score");
const p2ScoreDisplay = document.getElementById("p2-score");
const statButtons = document.querySelectorAll(".stat-btn");
const gameModeButtons = document.querySelectorAll(".game-mode-btn");
const wagerButtons = document.querySelectorAll(".wager-btn");
const roundDisplay = document.createElement('div');
const mainContainer = document.getElementById("main-container");
const topBar = document.getElementById("top-bar");
const walletAddressDisplay = document.getElementById("wallet-address");
const doggingtonBalanceDisplay = document.getElementById("doggington-balance");
const logoutBtn = document.getElementById("logout-btn");
const proceedBtn = document.getElementById("proceed-btn");

let p1Score = 0;
let p2Score = 0;
let p1Deck = [];
let p2Deck = [];

// Append round display to the score container
const scoreContainer = document.getElementById('score-container');
roundDisplay.id = 'round-display';
roundDisplay.style.fontSize = '1.5rem';
scoreContainer.appendChild(roundDisplay);

// Landing Screen Logic to Show Wallet Selection Modal
document.getElementById("connect-wallet-btn").addEventListener("click", () => {
    document.getElementById("wallet-selection-modal").style.display = "flex";
});

// Wallet Selection Modal Logic
document.getElementById("phantom-wallet-btn").addEventListener("click", async () => {
    await connectWallet('Phantom');
});
document.getElementById("solflare-wallet-btn").addEventListener("click", async () => {
    await connectWallet('Solflare');
});
document.getElementById("glow-wallet-btn").addEventListener("click", async () => {
    await connectWallet('Glow');
});

document.getElementById("cancel-wallet-btn").addEventListener("click", () => {
    document.getElementById("wallet-selection-modal").style.display = "none";
});

async function connectWallet(walletName) {
    try {
        if (!wallets[walletName]) {
            console.error("Wallet adapter not found for", walletName);
            alert("Wallet adapter not found. Please make sure the extension is installed.");
            return;
        }
        
        selectedWalletAdapter = wallets[walletName];
        if (walletName === 'Phantom') {
            await window.solana.connect();
            selectedWalletAdapter = window.solana;
        } else {
            await selectedWalletAdapter.connect();
        }

        if (selectedWalletAdapter && selectedWalletAdapter.publicKey) {
            walletAddress = selectedWalletAdapter.publicKey.toString();
            walletAddressDisplay.textContent = walletAddress;
            // Fetch Doggington Token Balance
            await updateDoggingtonBalance();

            // Hide wallet modal and show the game setup screen
            document.getElementById("top-bar").style.display = "flex";
            document.getElementById("wallet-selection-modal").style.display = "none";
            document.getElementById("landing-screen").style.display = "none";
            document.getElementById("game-setup-screen").style.display = "block";
        } else {
            console.error("Wallet connection unsuccessful.");
            alert("Could not connect wallet. Please try again.");
        }
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Could not connect wallet. Please try again. Make sure the wallet extension is installed and you have approved the connection.");
    }
}

// Function to Update Doggington Token Balance
async function updateDoggingtonBalance() {
    try {
        const tokenAddress = '9KQFQeqtVZ3mpo6asGKUiv9xEwuZYqWeAL781AABKD8f';
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            selectedWalletAdapter.publicKey,
            {
                programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
            }
        );

        console.log("Fetched Token Accounts: ", tokenAccounts);
        let balance = 0;
        tokenAccounts.value.forEach(({ account }) => {
            const tokenInfo = account.data.parsed.info;
            console.log("Checking Token Info: Mint -", tokenInfo.mint, "Expected -", tokenAddress);
            if (tokenInfo.mint === tokenAddress) {
                balance = tokenInfo.tokenAmount.uiAmount;
                console.log("Doggington Token Balance Found: ", balance);
            }
        });

        if (balance === 0) {
            console.warn("No balance found for Doggington tokens.");
        }

        doggingtonBalance = balance;
        doggingtonBalanceDisplay.textContent = doggingtonBalance;
    } catch (error) {
        console.error("Failed to fetch Doggington balance:", error);
        doggingtonBalanceDisplay.textContent = "Error fetching balance";
    }
}

// Function to Sign and Send a Transaction
async function signAndSendTransaction() {
    if (!selectedWalletAdapter) {
        alert("Please connect a wallet first.");
        return;
    }

    try {
        const { Connection, SystemProgram, Transaction, clusterApiUrl } = solanaWeb3;
        let connection = new Connection(clusterApiUrl('mainnet-beta'));

        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: selectedWalletAdapter.publicKey,
                toPubkey: selectedWalletAdapter.publicKey, // Replace with recipient public key
                lamports: 100, // Amount in lamports to transfer
            })
        );

        let { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = selectedWalletAdapter.publicKey;

        let signed = await selectedWalletAdapter.signTransaction(transaction);
        let txid = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(txid);

        console.log("Transaction successful with ID:", txid);
        alert("Transaction successful!");
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. Please try again.");
    }
}

// Function to Sign a Message
async function signMessage() {
    if (!selectedWalletAdapter) {
        alert("Please connect a wallet first.");
        return;
    }

    try {
        const message = "Please sign this message for proof of address ownership.";
        const data = new TextEncoder().encode(message);
        let signature = await selectedWalletAdapter.signMessage(data);
        console.log("Message signed successfully with signature:", signature);
        alert("Message signed successfully!");
    } catch (error) {
        console.error("Message signing failed:", error);
        alert("Message signing failed. Please try again.");
    }
}

// Log Out Button Logic
logoutBtn.addEventListener("click", () => {
    // Reset and hide wallet information
    document.getElementById("main-container").style.display = "none";
    document.getElementById("game-setup-screen").style.display = "none";
    topBar.style.display = "none";

    // Show landing screen again
    document.getElementById("landing-screen").style.display = "block";

    // Reset wallet info
    walletAddress = "";
    walletAddressDisplay.textContent = "";
    doggingtonBalance = 0; // Reset balance to 0
    doggingtonBalanceDisplay.textContent = doggingtonBalance;
    selectedWalletAdapter = null; // Clear selected wallet adapter
});

// Game Setup Logic
gameModeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedCards = parseInt(btn.dataset.cards);
        document.getElementById("wager-selection").style.display = "block";
        updateWagerOptions(); // Re-check wager options
    });
});

// Update Wager Options Based on Balance
function updateWagerOptions() {
    wagerButtons.forEach(btn => {
        const wagerAmount = parseInt(btn.dataset.wager);
        if (wagerAmount > doggingtonBalance) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        } else {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    });
}

wagerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedWager = parseInt(btn.dataset.wager);
        proceedBtn.style.display = "block";
    });
});

// Proceed to Main Game Logic
proceedBtn.addEventListener("click", () => {
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
    waitingForNextRound = false; // Not waiting for the next round yet
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

            // Wait 5 seconds before starting the next round or skip if clicked/pressed
            waitingForNextRound = true; // Set waiting state
            const nextRoundTimeout = setTimeout(() => {
                proceedToNextRound();
            }, 5000); // 5-second delay

            // Allow the player to skip the delay
            function skipDelay() {
                if (waitingForNextRound) {
                    clearTimeout(nextRoundTimeout); // Cancel the existing timeout
                    proceedToNextRound(); // Proceed to the next round immediately
                }
            }

            // Event listeners for skipping the delay
            mainContainer.addEventListener("click", skipDelay, { once: true });
            document.addEventListener("keydown", (e) => {
                if (e.key === " " || e.key === "Enter") {
                    skipDelay();
                }
            }, { once: true });
        }

    }, 500); // Halfway through the flip animation (adjust if necessary)
}

// Function to Proceed to the Next Round
function proceedToNextRound() {
    waitingForNextRound = false; // Reset waiting state
    p1Deck.push(p1Deck.shift());
    p2Deck.push(p2Deck.shift());
    displayCards();
    enableStatButtons(); // Re-enable stat buttons for the new round
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
    let winner;
    if (p1Score > p2Score) {
        winner = "Player One Wins!";
        doggingtonBalance += selectedWager; // Player wins the wager
    } else if (p1Score < p2Score) {
        winner = "CPU Wins!";
        doggingtonBalance -= selectedWager; // Player loses the wager
    } else {
        winner = "It's a Draw!"; // No change in balance for a draw
    }

    // Update the balance display
    doggingtonBalanceDisplay.textContent = doggingtonBalance;

    // Display the winner
    const overlay = document.getElementById("game-over-overlay");
    const winnerText = document.getElementById("winner-text");

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
    selectedCards = null;
    selectedWager = null;

    // Hide subsequent sections in game setup screen
    document.getElementById("wager-selection").style.display = "none";
    document.getElementById("proceed-btn").style.display = "none";
}

// Initial Game Setup
shuffleDeck();
displayCards();
