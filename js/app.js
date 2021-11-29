$(document).ready(function() {
    // player constructor
    function Player (name, type) {
        this.name = name;
        // we can set this to true thru constructor, flagging a player for cpu control
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
        this.choice = undefined;
    }
    // Player prototype methods
    Player.prototype.choose = function (move) {
        // moves are chosen with RNG for cpu players
        if (this.cpu) {
            this.choice = getRandomRPSGameChoice();
        } else {
            this.choice = move;
        }
        return this.choice;
    };

    // game round constructor
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
        this.number = null;
    }
    // Game prototype methods
    Game.prototype.runGame = function () {
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
    Game.prototype.stringifyResults = function() {
        // output a string describing the latest round's results
        let str = `${this.p1.name} picked ${this.p1.choice}. ${this.p2.name} picked ${this.p2.choice}.`;
        if (this.winner === 0) {
            str += ` Game ${this.result}.`;
        } else {
            str += ` ${this.winner} wins!`;
        }
        return str;
    }

    // game stringify for localstorage.
    // single string per game: gamenum,p1name,p1choice,p2name,p2choice,winner,result
    Game.prototype.stringifyGame = function () {
        return `${this.number},${this.p1.name},${this.p1.choice},${this.p2.name},${this.p2.choice},${this.winner},${this.result}`;
    }

    // setup stuff
    let games = [];
    let players = [];

    let DEBUG_MODE = {
        // when enabled, skips setup/personalization steps
        skipIntro: false,
        // if set to value greater than 0, plays value * games automatically
        autoPlay: 0,
        // console.log round results
        verboseRounds: false,
        // console.log round history array
        verboseHistory: false,
        // log player win rate (-1 off | 0 player1 | 1 player2 | 2 both)
        logWinrate: -1,
        // enable localstorage for history
        localStore: true,
    };

    // allow user localstorage usage if and only if they check the option
    let saveEnabled = true;

    // setup options functions
    $('#clear-savelocal').on('click', function (event) {
        // if user clicks, we clear localStorage
        localStorage.clear();
    });
    $('#check-savelocal').on('click', function (event) {
        // allow user to disable/enable saving game records
        $('#check-savelocal').prop('checked') ? saveEnabled = true : saveEnabled = false;
    });

    // this conditional is for two different game starts: debug mode opens game with a variety of options while
    // launching w/o debug mode allows the user to go through the full process of setup
    if (DEBUG_MODE.skipIntro) {
        (function(){ // this function is just for testing, skips game ready state
            // setup players, for now a user and a cpu
            players.push(new Player('debug mode', false), new Player('CPU', true));
            // personalize displays to reflect player names
            $('.p1-name').text(players[0].name);
            $('.p2-name').text(players[1].name);

            // debug mode autoplay
            if (DEBUG_MODE.autoPlay > 0) {
                players[0].cpu = true;
                for (let i = 0; i <= DEBUG_MODE.autoPlay; i++) {
                    players[0].choose();
                    players[1].choose();
                    gameManagement(players);
                }
                players[0].cpu = false;
            }

            // enable game buttons
            buttonsReady(players);
        })();
    } else {
        // non-debug mode game start here
        $('#name-submit').on('click', function (event) {
            // player 1 created and given submitted name
            let player = new Player($('#name-add').val(), false);
            // set up players array with player 1 and a CPU
            players.push(player, new Player('CPU', true));
            // personalize displays to reflect player names
            $('.p1-name').text(players[0].name);
            $('.p2-name').text(players[1].name);

            // make game ready, and enable game buttons
            buttonsReady(players);
        });
    }
    function pageSetup () {
        $('game-cont').show();
    }
    function buttonsReady(players) {
        // hide name entry area (for now)
        $('#name-cont').hide();
        // show game area
        $('#game-cont').show();
        // load (if any) games from localStorage
        if(localStorage.length > 0) rebuildGameHistory();
        // select the round's move options
        let options = {
            rock:   $('#move-rock'),
            paper:  $('#move-paper'),
            scissors: $('#move-scissors')
        };
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
    // take care of all the game processing after player choices have been made
    function gameManagement (players) {
        // evaluate a new round
        let round = playRound(players)
        // update player stats
        updatePlayerStats(players, round);
        // debug options for verbose logging of player win rates
        switch (DEBUG_MODE.logWinrate) {
            case 2:
                console.log(`${players[0].name}'s win rate: ${players[0].record.winrate()}`);
                console.log(`${players[1].name}'s win rate: ${players[1].record.winrate()}`);
                break;
            case 1:
                console.log(`${players[1].name}'s win rate: ${players[1].record.winrate()}`);
                break;
            case 0:
                console.log(`${players[0].name}'s win rate: ${players[0].record.winrate()}`);
                break;
        }

        // push results into the game history
        games.push(round);
        // assign round number to round object
        round.number = games.length;
        // save round to localstorage
        if (saveEnabled && DEBUG_MODE.localStore) {
            localStorage.setItem(`${round.number}`, round.stringifyGame());
        }
        // debug logging option
        if (DEBUG_MODE.verboseHistory) console.log(games);
        // modify page to display results
        roundOverHtmlManagement();
    }

    function playRound(players) {
        let round = new Game(players[0], players[1]);
        round.runGame();
        // debug logging option
        if (DEBUG_MODE.verboseRounds) console.log(round.stringifyResults());
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
        let round = games[games.length - 1];
        $('#game-tbody').prepend(addTableRow(round, round.number));
        // show this round's results
        $('#game-area').replaceWith(displayRoundResults(round, round.number));
    }

    // addTableRow builds a new table row element with the last round's details
    function addTableRow(round, roundNum) {
        // create content for populating a table for the round results
        // each played game gets a row like:
        // round     player1     player2        winner
        // 2         'rock'     'scissors'      player1
        // 1         'paper'    'scissors'      player2

        // layout:
        // <tr>
        //     <th scope="row">round number</th>
        //     <td>p1 move</td>
        //     <td>p2 move</td>
        //     <td>round winner</td>
        // </tr>
        const $roundNumber = $(document.createElement("th"))
            .attr('scope', 'row')
            .text(roundNum);
        const $p1Move = $(document.createElement('td'))
            .text(round.p1.choice);
        const $p2Move = $(document.createElement('td'))
            .text(round.p2.choice);
        const $results = $(document.createElement('td'))
            .css('color', changeColorByWinner(round))
            .text((round.winner !== 0) ? round.winner : round.result);

        return $(document.createElement('tr'))
            .append($roundNumber, $p1Move, $p2Move, $results);
    }
    function changeColorByWinner(round) {
        if (round.winner === 0) return 'darkslategrey';
        else if (round.winner === 'CPU') return 'red';
        else return 'green';
    }
    // create a div to replace the last round's game results with the new round's results
    function displayRoundResults(round, roundNum) {
        // layout:
        // <div id="game-area" class="m-3 row">
        //            <div class="col-4" id="game-p1-choice">
        //              <p>P1 move:</p>
        //              <p>*move*</p>
        //            </div>
        //             <div class="col-4" id="game-result">
        //               <p>Result:</p>
        //               <p>*result*</p>
        //             </div>
        //             <div class="col-4" id="game-p2-choice">
        //               <p>P2 move:</p>
        //               <p>*move*</p>
        //             </div>
        //  </div>

        // Player 1's move
        const $p1Choice = $(document.createElement('div'))
            .addClass('col-4')
            .attr('id', 'game-p1-choice')
            .append($(document.createElement('p')).text(`${round.p1.name}'s move:`))
            .append($(document.createElement('p')).text(round.p1.choice));

        // prepare a short string summarizing winner unless it was a draw
        let resultString = '';
        if (round.winner !== 0) resultString = `${round.winner} ${round.result}s!`
        else resultString = round.result;
        // Round results
        const $gameResult = $(document.createElement('div'))
            .addClass('col-4')
            .css('color', changeColorByWinner(round))
            .attr('id', 'game-result')
            .append($(document.createElement('p')).text(`Round #${roundNum} result:`))
            .append($(document.createElement('p')).text(resultString));

        // player 2's move
        const $p2Choice = $(document.createElement('div'))
            .addClass('col-4')
            .attr('id', 'game-p2-choice')
            .append($(document.createElement('p')).text(`${round.p2.name}'s move:`))
            .append($(document.createElement('p')).text(round.p2.choice));

        // return a #game-area div to replace the existing one
        return $(document.createElement('div'))
            .addClass('m-3 row')
            .attr('id', 'game-area')
            .append($p1Choice, $gameResult, $p2Choice);
    }

    // return a random valid rock paper scissors move
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

    function rebuildGameHistory() {
        // string per game: gamenum,p1name,p1choice,p2name,p2choice,winner,result
        //                  0       1      2        3      4        5      6
        for (let i = 0; i <= localStorage.length; i++) {
            // using the array index we access saved games in localStorage in ascending order
            let gameData = localStorage.getItem(`${i}`);
            if (typeof gameData === 'string') {
                // split the localStorage string value into an array
                gameData = gameData.split(',');
                // assemble a new game using the saved data to recreate players and choices
                let p1 = {name: gameData[1], choice: gameData[2]};
                let p2 = {name: gameData[3], choice: gameData[4]};
                // create new Game and feed it the saved data
                let oldGame = new Game(p1, p2);
                // post-constructor value modification to perfectly recreate Game object
                oldGame.winner = (gameData[5] !== '0') ? gameData[5] : gameData[6];
                oldGame.result = gameData[6];
                oldGame.number = gameData[0];
                // pop it back into this session's games array
                games.push(oldGame);
                // add corresponding table row for this old game data
                $('#game-tbody').prepend(addTableRow(oldGame, oldGame.number));
            }
        }
        // mostly unnecessary but better safe than sorry: sort games array by game number
        games.sort((a, b) => (a.number > b.number) ? 1 : -1);
    }
});