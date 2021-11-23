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

    let cpu = new Player('CPU', true);

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
        let player = new Player('James', false);

        players.push(player, cpu);
        $('.name-display').text(player.name);

        // enable game buttons
        buttonsReady(player);
    })();
    function buttonsReady(player) {
        let options = {
            rock:   $('#move-rock'),
            paper:  $('#move-paper'),
            scissors: $('#move-scissors')
        }

        options.rock.on('click', function (event) {
            player.choose('rock');
            games.push(playRound(player, cpu));
            $('#game-tbody').prepend(addTableRow(games[games.length - 1], games.length));
            console.log(games);
        });
        options.paper.on('click', function (event){
            player.choose('paper');
            games.push(playRound(player, cpu));
            $('#game-tbody').prepend(addTableRow(games[games.length - 1], games.length));
            console.log(games);
        });
        options.scissors.on('click', function (event){
            player.choose('scissors');
            games.push(playRound(player, cpu));
            $('#game-tbody').prepend(addTableRow(games[games.length - 1], games.length));
            console.log(games);
        });
    }
    function playRound(player, cpu) {
        cpu.choose();
        let newGame = new Game(player, cpu);
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

    function buildGameHistory() {
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

    function testGames() {
        for (let i = 0; i <= 1000; i++) {
            let player1 = {
                choice: getRandomRPSGameChoice(),
                name: 'Player 1',
            };

            let player2 = {
                choice: getRandomRPSGameChoice(),
                name: 'CPU',
            };
            // games.push(createRPSGame(player1, player2));
            // testing stuff, data analysis experiment
            // let p1wins = 0;
            // let p2wins = 0;
            // let draws = 0;
            // for (let game of games) {
            //     console.log(game.results());
            //     if (game.winner === game.p1.name) p1wins++;
            //     if (game.winner === game.p2.name) p2wins++;
            //     if (game.winner === 0) draws++;
            // }
            // console.log('Player 1 wins:', p1wins);
            // console.log('CPU wins:', p2wins);
            // console.log('Draw games:', draws);
        }
    }


    // function createRPSGame (player1, player2) {
    //     let game = {
    //         p1: player1,
    //         p2: player2,
    //         winner: null,
    //         result: null,
    //         results: function() {
    //             let str = `${this.p1.name} picked ${this.p1.choice}. ${this.p2.name} picked ${this.p2.choice}.`
    //             if (this.winner === 0) {
    //                 str += ` Game ${this.result}.`;
    //             } else {
    //                 str += ` ${this.winner} wins!`;
    //             }
    //             return str;
    //         }
    //     }
    //
    // }

    function setPlayerName(player, name) {

    }
});