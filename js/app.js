$(document).ready(function() {
    function Player (name, type) {
        this.name = name;
        this.cpu = type;
        this.record = {
            wins: 0,
            lose: 0,
            draw: 0,
            winrate: function () {
                return this.wins / this.lose;
            }
        }
        this.choice = null;
        this.choose = function (move) {
            if (this.cpu) {
                this.choice = getRandomRPSGameChoice();
            } else {
                this.choice = move;
            }
        };
    }

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

        players.push(player1, player2);
        $('.name-display').text(players[0].name);

        // enable game buttons
        buttonsReady(players);
    })();
    function buttonsReady(players) {
        let options = {
            rock:   $('#move-rock'),
            paper:  $('#move-paper'),
            scissors: $('#move-scissors')
        }

        options.rock.on('click', function (event) {
            players[0].choose('rock');
            players[1].choose('rock');
            gameManagement(players);
        });
        options.paper.on('click', function (event){
            players[0].choose('paper');
            players[1].choose('paper');
        });
        options.scissors.on('click', function (event){
            players[0].choose('scissors');
            players[1].choose('scissors');

        });
    }
    function gameManagement (players) {
        let round = playRound(players)
        games.push(round);
        $('#game-tbody').prepend(addTableRow(round, games.length));
        console.log(games);
    }
    function playRound(players) {
        let newGame = new Game(players[0], players[1]);
        newGame.runGame();
        console.log(newGame.logResults());
        return newGame;
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
    function addTableRow(game, num) {
        // <tr>
        //     <th scope="row">game number</th>
        //     <td>p1 move</td>
        //     <td>p2 move</td>
        //     <td>game winner</td>
        // </tr>
        const gameNumber = $(document.createElement("th"))
            .attr('scope', 'row')
            .text(num);
        const p1Move = $(document.createElement('td'))
            .text(game.p1.choice);
        const p2Move = $(document.createElement('td'))
            .text(game.p2.choice);
        const results = $(document.createElement('td'))
            .text((game.winner !== 0) ? game.winner : game.result);

        return $(document.createElement('tr'))
            .append(gameNumber)
            .append(p1Move)
            .append(p2Move)
            .append(results);
    }
});