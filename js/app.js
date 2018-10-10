/*
 * GAME SETUP
 */

let cards = Array.from(document.querySelectorAll('.card'));
let currentPair = [];
let moveCounter = document.querySelector('.moves');
let matches = 0;
let finalStars;
let time;
let timerID;
let minutes;
let seconds;
let finalTime;
const stars = Array.from(document.querySelectorAll('.star'));
const maxMovesForTwoStars = 25;
const maxMovesForThreeStars = 15;
const restart = document.querySelector('.restart');
const timer = document.querySelector('.timer');


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
    resetValues();
    startTimer();
    shuffleCards();
    updateCardDeck();
}

function resetValues() {
    resetCurrentPair();
    resetMoveCounter();
    resetMatches();
    resetStars();
    resetTime();
} 

// counts the time in seconds
function startTimer() {
    timerID = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
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

function resetCardToVirginState(card) {
    card.classList.remove('match');
}

function resetCurrentPair() {
    currentPair.length = 0;
}

function resetMoveCounter() {
    moveCounter.textContent = 0;
}

function resetMatches() {
    matches = 0;
}

function resetStars() {
    setStars(3);
}

function resetTime() {
    stopTimer();
    time = 0;
    timer.innerHTML = "0:00";
}

// displays the time in the format m:ss
function displayTime() {   
    minutes = Math.floor(time / 60);
    seconds = time % 60;
    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
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
    }, 500);
}

function matchFound() {
    currentPair.forEach(function(card) {       
        setTimeout(function() {
            hideSymbol(card);
            displayMatch(card);
        }, 500)      
    });
    resetCurrentPair();
    matches++;
}

function gameWon() {
    stopTimer();
    displayWinnerMessage();
}

// stops the timer
function stopTimer() {
    clearInterval(timerID);
    finalTime = timer.innerHTML;
}

function displayWinnerMessage() {
    setTimeout(function() {
        swal("Congratulations!", "You won with " + moveCounter.textContent + " moves in " + finalTime + "! " + finalStars + " " + (finalStars > 1 ? "stars" : "star") + " !", "success", {
            button: "PLAY AGAIN",
            }).then((willPlayAgain) => {
                if (willPlayAgain) {
                    startGame();
                }             
        })
    }, 700)
}

function incrementMoveCounter() {
    moveCounter.textContent++;
    changeRating();
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


/*
 * FUNCTIONS FOR STAR RATING
 */

function changeRating() {
    if (moveCounter.textContent > maxMovesForTwoStars) {
        setStars(1);
    } else if (moveCounter.textContent > maxMovesForThreeStars) {
        setStars(2);
    } else {
        setStars(3);
    }
}

function setStars(numberOfStars) {
    highlightStar(stars[0], numberOfStars > 0);
    highlightStar(stars[1], numberOfStars > 1);
    highlightStar(stars[2], numberOfStars > 2);
    finalStars = numberOfStars;
}

function highlightStar(star, on) {
    if(on) {
        star.classList.remove('off');
    } else {
        star.classList.add('off');
    }
}
