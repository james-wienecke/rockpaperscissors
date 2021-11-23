$(document).ready(function() {
    // player prototype
    function Player (name, type) {
        this.name = name;
        this.cpu = type;
        this.record = {
            wins: 0,
            lose: 0,
            draw: 0,
            winrate: function () {
                return this.wins / this.lose;
            },
            add: function (result) {
                switch(result) {
                    case 'win':
                        return this.wins++;
                    case 'lose':
                        return this.lose++;
                    case 'draw':
                        return this.draw++;
                }
            }
        }
        this.choice = null;
        this.choose = function (move) {
            if (this.cpu) {
                this.choice = getRandomRPSGameChoice();
            } else {
                this.choice = move;
            }
            return this.choice;
        };
    }

    // game round prototype
    function Game (player1, player2) {
        this.p1 = {
            name: player1.name,
            choice: player1.choice
        };
        this.p2 = {
            name: player2.name,
            choice: player2.choice
        };
        this.winner = null;
        this.result = null;
        this.logResults = function() {
            let str = `${this.p1.name} picked ${this.p1.choice}. ${this.p2.name} picked ${this.p2.choice}.`;
            if (this.winner === 0) {
                str += ` Game ${this.result}.`;
            } else {
                str += ` ${this.winner} wins!`;
            }
            return str;
        }
        this.runGame = function () {
           switch (this.p1.choice) {
               case 'rock':
                   switch (this.p2.choice) {
                       case 'rock':
                           this.winner = 0;
                           this.result = 'draw';
                           break;
                       case 'paper':
                           this.winner = this.p2.name;
                           this.result = 'win';
                           break;
                       case 'scissors':
                           this.winner = this.p1.name;
                           this.result = 'win';
                           break;
                   }
                   break;
               case 'paper':
                   switch (this.p2.choice) {
                       case 'rock':
                           this.winner = this.p1.name;
                           this.result = 'win';
                           break;
                       case 'paper':
                           this.winner = 0;
                           this.result = 'draw';
                           break;
                       case 'scissors':
                           this.winner = this.p2.name;
                           this.result = 'win';
                           break;
                   }
                   break;
               case 'scissors':
                   switch (this.p2.choice) {
                       case 'rock':
                           this.winner = this.p2.name;
                           this.result = 'win';
                           break;
                       case 'paper':
                           this.winner = this.p1.name;
                           this.result = 'win';
                           break;
                       case 'scissors':
                           this.winner = 0;
                           this.result = 'draw';
                           break;
                   }
                   break;
           }
        }
    }
    // setup stuff
    console.log('Would you like to play a game?');
    let games = [];
    let players = [];

    // $('#name-submit').on('click', function (event) {
    //     let player = new Player($('#name-add').val(), false);
    //
    //     players.push(player, cpu);
    //     $('.name-display').text(player.name);
    //
    //     // enable game buttons
    //     buttonsReady(player);
    //
    // });
    (function(){ // this function is just for testing, skips game ready state
        let player1 = new Player('James', false);
        let player2 = new Player('CPU', true);

        // setup players, for now a user and a cpu
        players.push(new Player('James', false), new Player('CPU', true));
        // personalize displays to reflect player names
        $('.p1-name').text(players[0].name);
        $('.p2-name').text(players[1].name);

        // enable game buttons
        buttonsReady(players);
    })();
    function buttonsReady(players) {
        // select the round's move options
        let options = {
            rock:   $('#move-rock'),
            paper:  $('#move-paper'),
            scissors: $('#move-scissors')
        }
        // listen for input
        options.rock.on('click', function (event) {
            players[0].choose('rock');
            players[1].choose('rock');
            gameManagement(players);
        });
        options.paper.on('click', function (event){
            players[0].choose('paper');
            players[1].choose('paper');
            gameManagement(players);
        });
        options.scissors.on('click', function (event){
            players[0].choose('scissors');
            players[1].choose('scissors');
            gameManagement(players);
        });
    }
    // take care of all the game processing after player choices have been taken
    function gameManagement (players) {
        // evaluate a new round
        let round = playRound(players)
        // update player stats
        updatePlayerStats(players, round);
        // push results into the game history
        games.push(round);
        // modify page to display results
        roundOverHtmlManagement();
    }

    function playRound(players) {
        let round = new Game(players[0], players[1]);
        round.runGame();
        console.log(round.logResults());
        return round;
    }

    function updatePlayerStats(players, round) {
        for (let player of players) {
            switch(round.winner) {
                case player.name:
                    player.record.add('win');
                    break;
                case 0:
                    player.record.add('draw');
                    break;
                default:
                    player.record.add('lose');
                    break;
            }
        }
    }

    function roundOverHtmlManagement () {
        // only show log of rounds if there are more than 1 round played
        if (games.length > 1) {
            let lastRound = games[games.length - 2];
            let lastRoundNum = games.length - 1
            // add a new table row detailing the last round, prepending it so it's latest first
            $('#game-tbody').prepend(addTableRow(lastRound, lastRoundNum));
        }
        let round = games[games.length - 1];
        let roundNum = games.length;
        // show this round's results
        $('#game-area').replaceWith(displayRoundResults(round, roundNum));


        // addTableRow builds a new table row element with the last round's details
        function addTableRow(round, roundNum) {
            // <tr>
            //     <th scope="row">round number</th>
            //     <td>p1 move</td>
            //     <td>p2 move</td>
            //     <td>round winner</td>
            // </tr>
            const roundNumber = $(document.createElement("th"))
                .attr('scope', 'row')
                .text(roundNum);
            const p1Move = $(document.createElement('td'))
                .text(round.p1.choice);
            const p2Move = $(document.createElement('td'))
                .text(round.p2.choice);
            const results = $(document.createElement('td'))
                .text((round.winner !== 0) ? round.winner : round.result);

            return $(document.createElement('tr'))
                .append(roundNumber)
                .append(p1Move)
                .append(p2Move)
                .append(results);
        }
        // create a div to replace the last round's game results with the new round's results
        function displayRoundResults(round) {
            // <div id="game-area" class="m-3 row">
            //            <div class="col-4" id="game-p1-choice"></div>
            //             <div class="col-4" id="game-result"></div>
            //             <div class="col-4" id="game-p2-choice"></div>
            //  </div>
            const p1Choice = $(document.createElement('div'))
                .addClass('col-4')
                .text(round.p1.choice)
                .attr('id', 'game-p1-choice');
            // prepare a short string summarizing winner unless it was a draw
            let resultString = '';
            if (round.winner !== 0) resultString = `${round.winner} ${round.result}s!`
            else resultString = round.result;

            const gameResult = $(document.createElement('div'))
                .addClass('col-4')
                .text(resultString)
                .attr('id', 'game-result');
            const p2Choice = $(document.createElement('div'))
                .addClass('col-4')
                .text(round.p2.choice)
                .attr('id', 'game-p2-choice');

            return $(document.createElement('div'))
                .addClass('m-3 row')
                .attr('id', 'game-area')
                .append(p1Choice, gameResult, p2Choice);

        }
    }
    function getRandomRPSGameChoice() {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                return 'rock';
            case 1:
                return 'paper';
            case 2:
                return 'scissors';
        }
    }
    function buildGameHistory(history) {
        // Todo: create system for saving and loading records from local storage
        // create a table-like object
        // each played game gets a row like:
        // round     player1     player2        winner
        // 2         'rock'     'scissors'      player1
        // 1         'paper'    'scissors'      player2

    }

});