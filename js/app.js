/*
 * GAME SETUP
 */

let cards = Array.from(document.querySelectorAll('.card'));
let currentPair = [];
let moveCounter = document.querySelector('.moves');
let matches = 0;
const restart = document.querySelector('.restart');

startGame();


/*
 * CLICK EVENT LISTENERS
 */

cards.forEach(function(card) {
    card.addEventListener('click', function onClick(event) {

        turnOver(card);

        if(twoCardsTurnedOver()) {
            incrementMoveCounter();

            if(currentPairMatches()) {
                matchFound();

                if(allMatchesFound()) {
                    gameWon();
                }
            } else {
                turnBackOverCurrentPair();
            }
        }
    });
});

restart.addEventListener('click', function() {
    startGame();
});


/*
 * FUNCTIONS FOR GAME SETUP
 */

function startGame() {
    shuffleCards();
    updateCardDeck();
    resetValues();
}

function shuffleCards() {
    cards = shuffle(cards);
}

function updateCardDeck() {
    let deck = document.querySelector('.deck');
    cards.forEach(function(card) {
        deck.removeChild(card);
        resetCardToVirginState(card);
        deck.appendChild(card);       
    });
}

function resetValues() {
    resetCurrentPair();
    resetMoveCounter();
    resetMatches();
} 

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function resetCardToVirginState(card) {
    card.classList.remove('match');
}


/*
 * FUNCTIONS FOR CARD EVENT LISTENER
 */

function turnOver(card) {
    if (isTurnedOver(card)) {
        // Card is already turned over
        return;
    }
    if (twoCardsTurnedOver(card)) {
        // Two cards are already turned over
        return;
    }
    addToCurrentPair(card);
    displaySymbol(card);
}

function turnBackOverCurrentPair() {
    setTimeout(function() {
        currentPair.forEach(function(card) {
            hideSymbol(card);
        });
        resetCurrentPair();
    }, 1000);
}

function matchFound() {
    currentPair.forEach(function(card) {       
        setTimeout(function() {
            hideSymbol(card);
            displayMatch(card);
        }, 600)      
    });
    resetCurrentPair();
    matches++;
}

function gameWon() {
    displayWinnerMessage();
}

function displayWinnerMessage() {
    swal("Congratulations!", "You won with " + moveCounter.textContent + " moves!", "success", {
        button: "Play again!",
        }).then((willPlayAgain) => {
            if (willPlayAgain) {
                startGame();
            }             
    })
}

function incrementMoveCounter() {
    moveCounter.textContent++;
} 

function resetMoveCounter() {
    moveCounter.textContent = 0;
}

function displaySymbol(card) {
    card.classList.add('open', 'show');
}

function hideSymbol(card) {
    card.classList.remove('open', 'show');
}

function displayMatch(card) {
    card.classList.add('match');
}

function resetMatches() {
    matches = 0;
}

function addToCurrentPair(card) {
    currentPair.push(card);
}

function resetCurrentPair() {
    currentPair.length = 0;
}

function isTurnedOver(card) {
    return (card.classList.contains('open') && card.classList.contains('show'));
}

function twoCardsTurnedOver() {
    return currentPair.length == 2;
}

function currentPairMatches() {
    return currentPair[0].firstElementChild.className == currentPair[1].firstElementChild.className;
}

function allMatchesFound() {
    return matches == (cards.length/2);
}