$(document).ready(function() {
    console.log('Would you like to play a game?');
    let games = [];
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
    for (let i = 0; i  <= 10; i++) {
        let player1 = {
            choice: getRandomRPSGameChoice(),
            name: 'Player 1',
        };

        let player2 = {
            choice: getRandomRPSGameChoice(),
            name: 'CPU',
        };
        let game = evalRPSGameResults(player1, player2)
        games.push(game);
    }

    for (let game of games) {
        console.log(game.results());
    }

    function evalRPSGameResults (player1, player2) {
        let game = {
            p1: player1,
            p2: player2,
            winner: null,
            result: null,
            results: function() {
                let str = `${this.p1.name} picked ${this.p1.choice}. ${this.p2.name} picked ${this.p2.choice}.`
                if (this.winner === 0) {
                    str += ` Game ${this.result}.`;
                } else {
                    str += ` ${this.winner} wins!`;
                }
                return str;
            }
        }
        switch (game.p1.choice) {
            case 'rock':
                switch (game.p2.choice) {
                    case 'rock':
                        game.winner = 0;
                        game.result = 'draw';
                        break;
                    case 'paper':
                        game.winner = game.p2.name;
                        game.result = 'win';
                        break;
                    case 'scissors':
                        game.winner = game.p1.name;
                        game.result = 'win';
                        break;
                }
                break;
            case 'paper':
                switch (game.p2.choice) {
                    case 'rock':
                        game.winner = game.p1.name;
                        game.result = 'win';
                        break;
                    case 'paper':
                        game.winner = 0;
                        game.result = 'draw';
                        break;
                    case 'scissors':
                        game.winner = game.p2.name;
                        game.result = 'win';
                        break;
                }
                break;
            case 'scissors':
                switch (game.p2.choice) {
                    case 'rock':
                        game.winner = game.p2.name;
                        game.result = 'win';
                        break;
                    case 'paper':
                        game.winner = game.p1.name;
                        game.result = 'win';
                        break;
                    case 'scissors':
                        game.winner = 0;
                        game.result = 'draw';
                        break;
                }
                break;
        }
        return game;
    }
});