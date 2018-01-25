/*
 * Create a list that holds all of your cards
 */
var game = {
    stars: 3,
    score: 0,
    moves: 0,
    time: 0,
    timerID: true,
    firstMatch: null,
    secondMatch: null,
    ready: true,
    cardItems: [
        'fa-diamond',
        'fa-paper-plane-o',
        'fa-anchor',
        'fa-bolt',
        'fa-cube',
        'fa-leaf',
        'fa-bicycle',
        'fa-bomb',
        'fa-diamond',
        'fa-paper-plane-o',
        'fa-anchor',
        'fa-bolt',
        'fa-cube',
        'fa-leaf',
        'fa-bicycle',
        'fa-bomb',
    ],
};

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


// function for restart event listener
function restartGame () {
    // shuffle cards 
    shuffle(game.cardItems);

    // create new card elements
    var newCards = document.createDocumentFragment();
    var deck = document.querySelector('.deck');
    var oldCards = document.getElementsByClassName('card');

    game.cardItems.map(function(item) {
        var card = document.createElement('li');
        card.className = 'card';
        card.innerHTML = '<i class="fa ' + item + '"></i>';
        newCards.appendChild(card);
    });

    // Remove old cards from DOM and append new cards
    while (oldCards.length !== 0) {
        oldCards[0].remove();
    }
    deck.appendChild(newCards);

    // reset time, score and moves
    reset('time');
    reset('score');
    reset('moves');

    // reset stars
    if (game.stars < 3) {
        resetStars();
    }

    //stop timer
    stopTimer();
}


// helper functions to update game data and DOM
function reset(type) {
    game[type] = 0;
    updatePanel(type);
}

function increment(type) {
    game[type]++;
    updatePanel(type);
}

function updatePanel(type) {
    document.getElementById(type).innerHTML = '' + game[type];
}

function removeStar() {
    document.querySelector('.stars').firstElementChild.remove();
    game.stars--;
}

function resetStars() {
    document.querySelector('.stars').innerHTML = '\
        <li><i class="fa fa-star"></i></li>\
        <li><i class="fa fa-star"></i></li>\
        <li><i class="fa fa-star"></i></li>';
    game.stars = 3;
}


// Timer Code
function timeCount() {
    increment('time');
}

function startTimer() {
    increment('time');
    game.timerID = window.setInterval(timeCount, 1000);    
}

function stopTimer() {
    clearInterval(game.timerID);
    game.timerID = null; 
}


// function for card event listener
function openCard (e) {

    // check if the user clicked on a card 
    // and not clicked on a card matched before
    // game.ready is to avoid bubbling fast clicks
    if (game.ready && e.target.tagName === 'LI'
        && e.target.classList[1] !== 'match'
        && e.target !== game.firstMatch) {
        
        // player have to wait openCard function 
        // to finish before clicking a new card
        game.ready = false;

        // flip and show card
        e.target.className = 'card show animated flipInY';

        // start timer at the begining
        if (game.time === 0) {
            startTimer();
        }

        // count moves
        increment('moves');

        // check num of moves to calculate stars
        calculateStars();

        // save card on relevant variables
        if (game.firstMatch === null) {
            game.firstMatch = e.target;
            game.ready = true;
        } else if (game.secondMatch === null) {
            game.secondMatch = e.target;
        }

        // compare cards
        if (game.firstMatch !== null && game.secondMatch !== null) {
            if (game.firstMatch.firstChild.className === game.secondMatch.firstChild.className) {
                matched();
            } else {
                setTimeout(notMatched, 1000);
            }
        }
    }
}

// helper functions for card comparison
function matched() {
    // update score
    increment('score');

    game.firstMatch.className = 'card match animated pulse';
    game.secondMatch.className = 'card match animated pulse';
    clearMatches();

    // check score for win situation
    if (game.score === 8) {
        win();
    }
}

function notMatched() {
    game.firstMatch.className = 'card animated shake';
    game.secondMatch.className = 'card animated shake';
    clearMatches();
}

function clearMatches() {
    game.firstMatch = null;
    game.secondMatch = null;
    game.ready = true;
}

function calculateStars() {
    if (game.moves === 24) {
        removeStar();
    } else if (game.moves === 48) {
        removeStar();
    }
}

// whenever the player wins the game
// update and toggle modal and stop timer
function win() {
    stopTimer();
    $('#finalscore').modal('toggle');
    document.getElementById('finaltime').innerHTML = '' + game.time;
    document.getElementById('finalstars').innerHTML = '' + game.stars;
    document.getElementById('playagain').addEventListener('click', restartGame);
}

// Listener for restart button
var restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', restartGame);

// Listener for cards
var cards = document.querySelector('.deck');
cards.addEventListener('click', openCard, true);

restartGame();

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
