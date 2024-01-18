const playBtn = document.querySelector('#play-btn');
const matchHistoryBtn = document.querySelector('#match-history-btn')
const game = document.querySelector('#game');
const userOptions = document.querySelectorAll('#user-options li');
const overlay = document.querySelector('#overlay')
const closeBtn = document.querySelector('#matchHistoryContainer table .fa-xmark')

const botChoice = document.createElement('i');
botChoice.classList.add('fa-solid');

playBtn.addEventListener('click', () => {
    game.classList.add('active');
})

matchHistoryBtn.addEventListener('click', () => {
    displayMatchHistory();
    
    const matchHistory = document.querySelector('#matchHistoryContainer')

    matchHistory.classList.remove('hidden')
    overlay.classList.remove('hidden');
})

overlay.addEventListener('click', () => {
    const matchHistory = document.querySelector('#matchHistoryContainer')

    overlay.classList.add('hidden');
    matchHistory.classList.add('hidden')
})

closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    matchHistory.classList.add('hidden');
})

userOptions.forEach((userOption) => {
    userOption.addEventListener('click', () => {
        const userScoreElement = document.querySelector('.user-score');
        let userScore = parseInt(userScoreElement.innerHTML);

        const botScoreElement = document.querySelector('.bot-score');
        let botScore = parseInt(botScoreElement.innerHTML);

        if(userScore >= 2 || botScore >= 2) {
            return;
        }

        if(playRound(userOption.classList[1], getBotOption()) == 'user') {
            userScore++
        } else if (playRound(userOption.classList[1], getBotOption()) == 'bot') {
            botScore++
        }

        checkIfWin(userScore, botScore);
        
        userScoreElement.innerHTML = userScore.toString();
        botScoreElement.innerHTML = botScore.toString();

        
        
    })
});

function playRound(userOption, botOption) {
    let roundWinner = "";

    switch (userOption) {
        case 'rock':
            if(botOption == 'scissors') {
                // USER WIN
                roundWinner = "user";

            } else if (botOption == 'paper') {
                // LOOSE
                roundWinner = "bot";

            } else {
                // DRAW
                roundWinner = "draw";
            }
            break;

        case 'paper':
            if(botOption == 'rock') {
                // USER WIN
                roundWinner = "user";

            } else if (botOption == 'scissors') {
                // LOOSE
                roundWinner = "bot";

            } else {
                // DRAW
                roundWinner = "draw";

            }
            break;

        case 'scissors':
            if(botOption == 'paper') {
                // USER WIN
                roundWinner = "user";

            } else if (botOption == 'rock') {
                // LOOSE
                roundWinner = "bot";

            } else {
                // DRAW
                roundWinner = "draw";

            }
            break;

        default:
            console.log('error #01')
            break;
    }

    return roundWinner;
}

function getBotOption() {
    const options = ['rock', 'paper', 'scissors'];
    const option = options[Math.floor(Math.random() * 3)];
    let result = "";

    switch (option) {
        case 'rock':
            botChoice.classList.remove('fa-hand', 'fa-hand-peace')
            botChoice.classList.add('fa-hand-back-fist')
            result = 'rock';
            break;
    
        case 'paper':
            botChoice.classList.remove('fa-hand-back-fist', 'fa-hand-peace')
            botChoice.classList.add('fa-hand')
            result = 'paper';
            break;
    
        case 'scissors':
            botChoice.classList.remove('fa-hand', 'fa-hand-back-fist')
            botChoice.classList.add('fa-hand-peace')
            result = 'scissors';
            break;
    
        default:
            break;
    }

    return result;
}

function checkIfWin(userScore, botScore) {
    if (userScore >= 2 || botScore >= 2) {
        let winner = '';

        if (userScore > botScore) {
            winner = 'user';
        } else {
            winner = 'bot';
        }

        // create object with current game
        const game = {
            'userScore': userScore,
            'botScore': botScore,
            'winner': winner,
            'date': getDate(),
        }


        // get current match history from localStorage and if it's null initialize a new empty array
        const matchHistory = JSON.parse(localStorage.getItem('matchHistory')) || [];

        // add new game to matchHistory
        matchHistory.push(game);

        // convert updated array into JSON string
        const jsonArray = JSON.stringify(matchHistory);

        // store this JSON string in localStorage to maintain the game history between sessions
        localStorage.setItem('matchHistory', jsonArray);


        console.table(matchHistory);

        console.log('Winner = ' + winner);
        return;
    }
}

function getDate() {
    const currentDate = new Date();

    const addZero = (number) => (number < 10 ? '0' + number : number);

    const day = addZero(currentDate.getDate());
    const month = addZero(currentDate.getMonth() + 1); // Les mois commencent à 0, donc ajoutez 1
    const year = currentDate.getFullYear();
    const hours = addZero(currentDate.getHours());
    const minutes = addZero(currentDate.getMinutes());

    const formattedDate = `${day}/${month}/${year} ${hours}h${minutes}`;

    return formattedDate;

}

function displayMatchHistory() {
    const matchHistory = JSON.parse(localStorage.getItem('matchHistory')) || [];
    const tableContainer = document.querySelector('#matchHistoryContainer');
    const table = document.createElement('table');
    const headerRow = table.insertRow(0);
    const headerCells = ['User', 'Bot', 'Winner', 'Date'];

    const closeBtn = document.createElement('i')
    closeBtn.classList.add('fa-solid', 'fa-xmark')
    table.appendChild(closeBtn)

    headerCells.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    matchHistory.forEach((game) => {
        const row = table.insertRow(-1);

        const cell1 = row.insertCell(0);
        cell1.textContent = game.userScore;

        const cell2 = row.insertCell(1);
        cell2.textContent = game.botScore;

        const cell3 = row.insertCell(2);
        cell3.textContent = game.winner;

        const cell4 = row.insertCell(3);
        cell4.textContent = game.date;
    });

    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}
