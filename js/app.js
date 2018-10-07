/*
 * Create a list that holds all of your cards
 */
const cards = document.querySelectorAll('.card');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
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

let currentPair = [];
let moveCounter = document.querySelector('.moves');
let matches = 0;

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

function displaySymbol(card) {
    card.classList.add('open', 'show');
}

function hideSymbol(card) {
    card.classList.remove('open', 'show');
}

function displayMatch(card) {
    card.classList.add('match');
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

function incrementMoveCounter() {
    moveCounter.textContent++;
} 

function matchFound() {
    currentPair.forEach(function(card) {
        hideSymbol(card);
        displayMatch(card);
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
    // }).then((value) => {
    //     resetGame();
    })
}
