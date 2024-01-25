const playBtn = document.querySelector('#play-btn');
const matchHistoryBtn = document.querySelector('#match-history-btn')
const game = document.querySelector('#game');
const userOptions = document.querySelectorAll('#user-options li');
const overlay = document.querySelector('#overlay')
const closeBtn = document.querySelector('#matchHistoryContainer table .fa-xmark')
const clearHistoryBtn = document.querySelector('#clear-history-btn')

playBtn.addEventListener('click', () => {
    if(game.classList.contains('active')) {
        reload();
    } else {
        game.classList.add('active');
    }
})

matchHistoryBtn.addEventListener('click', () => {
    displayMatchHistory();
    
    const matchHistory = document.querySelector('#matchHistoryContainer')

    matchHistory.classList.remove('hidden')
    overlay.classList.remove('hidden');
})

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the match history ?')) {
        clearMatchHistory();
    }
});

overlay.addEventListener('click', () => {
    const matchHistory = document.querySelector('#matchHistoryContainer')

    overlay.classList.add('hidden');
    matchHistory.classList.add('hidden');
})

let canClick = true;

userOptions.forEach((userOption) => {
    userOption.addEventListener('click', () => {
        if (!canClick) {
            return;
        }

        canClick = false;

        const botOption = getBotOption();
        const botOptionElement = document.getElementsByClassName(`bot-option ${botOption}`)

        showOption(userOption);
        showOption(botOptionElement[0]);

        setTimeout(() => {
            const userScoreElement = document.querySelector('.user-score');
            let userScore = parseInt(userScoreElement.innerHTML);
    
            const botScoreElement = document.querySelector('.bot-score');
            let botScore = parseInt(botScoreElement.innerHTML);
    
            if (userScore >= 2 || botScore >= 2) {
                canClick = true;
                return;
            }
    
            if (playRound(userOption.classList[2], botOption) == 'user') {
                userScore++
            } else if (playRound(userOption.classList[2], botOption) == 'bot') {
                botScore++
            }

            checkIfWin(userScore, botScore);
            
            userScoreElement.innerHTML = userScore.toString();
            botScoreElement.innerHTML = botScore.toString();

            canClick = true;

        }, 1000);
    });
});

function playRound(userOption, botOption) {
    let roundWinner = "";

    switch (userOption) {
        case 'rock':
            if(botOption == 'scissors') {
                // USER WIN
                // console.log(`You win ! ${userOption} VS ${botOption}`)
                roundWinner = "user";

            } else if (botOption == 'paper') {
                // LOOSE
                // console.log(`You loose.. ${userOption} VS ${botOption}`)
                roundWinner = "bot";

            } else {
                // DRAW
                // console.log(`It's a draw ! ${userOption} VS ${botOption}`)
                roundWinner = "draw";
            }
            break;

        case 'paper':
            if(botOption == 'rock') {
                // USER WIN
                // console.log(`You win ! ${userOption} VS ${botOption}`)
                roundWinner = "user";

            } else if (botOption == 'scissors') {
                // LOOSE
                // console.log(`You loose.. ${userOption} VS ${botOption}`)
                roundWinner = "bot";

            } else {
                // DRAW
                // console.log(`It's a draw ! ${userOption} VS ${botOption}`)
                roundWinner = "draw";

            }
            break;

        case 'scissors':
            if(botOption == 'paper') {
                // USER WIN
                // console.log(`You win ! ${userOption} VS ${botOption}`)
                roundWinner = "user";

            } else if (botOption == 'rock') {
                // LOOSE
                // console.log(`You loose.. ${userOption} VS ${botOption}`)
                roundWinner = "bot";

            } else {
                // DRAW
                // console.log(`It's a draw ! ${userOption} VS ${botOption}`)
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

    return option;
}

function showOption(option) {
    option.classList.add('selected');

    setTimeout(() => {
        option.classList.remove('selected');
    }, 1000);
}

function showWinnerOption(option) {
    option.classList.add('win');

    setTimeout(() => {
        option.classList.remove('win');
    }, 1000);
}

function checkIfWin(userScore, botScore) {
    if (userScore >= 2 || botScore >= 2) {
        let winner = '';

        if (userScore > botScore) {
            setTimeout(() => {
                showResult("You win ! :)");
            }, 1000)
            winner = 'user';
        } else {
            setTimeout(() => {
                showResult("You loose.. :(");
            }, 1000)
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

function clearMatchHistory() {
    window.localStorage.clear();
}

function showResult(text) {
    var modal = document.getElementById("myModal");
    var modalText = document.querySelector(".modal-content p")
    var modalImg = modal.querySelector('img')
    var span = document.getElementsByClassName("close")[0];

    if(text == "You win ! :)") {
        modalImg.src = "/win.jpg";
    } else {
        modalImg.src = "/loose.png";
    }

    modal.style.display = "flex";
    modalText.innerHTML = text;

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
