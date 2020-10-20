const logger = require('../utils/logger.js');
const shopManager = require('../utils/shopmanager.js')
const xpManager = require('../utils/xpmanager.js')

var cherry = [0, 0, 0.50, 0.75, 1.25];
var lemon = [0, 0, 1, 2, 3];
var peach = [0, 0, 1.5, 2.5, 4];
var orange = [0, 0, 1.5, 3.25, 4];
var grape = [0, 0, 2, 3.25, 6];
var melon = [0, 0, 4, 6, 7];
var seven = [0, 0, 5, 7, 10];

var lanes = [
    [[0,0], [0,1], [0,2], [0,3], [0,4]],
    [[1,0], [1,1], [1,2], [1,3], [1,4]],
    [[2,0], [2,1], [2,2], [2,3], [2,4]],
    [[0,0], [1,1], [2,2], [1,3], [0,4]],
    [[2,0], [1,1], [0,2], [1,3], [2,4]],
    [[1,0], [0,1], [0,2], [0,3], [1,4]],
    [[1,0], [2,1], [2,2], [2,3], [1,4]],
    [[0,0], [0,1], [1,2], [2,3], [2,4]],
    [[2,0], [2,1], [1,2], [0,3], [0,4]],
    [[1,0], [2,1], [1,2], [0,3], [1,4]]
];

module.exports = {
	name: 'slot',
	description: 'Versuche ein Glück!',
	args: true,
	usage: '+slot <einsatz>',
	guildOnly: true,
	aliases: ['spin', '777', 'luckyfruits', 'kuramaslot', 'slots'],
    needsPerm: false,
	execute(message, args) {
        var answer = 'Slot';
        if(args.length == 1 && Number.isInteger(parseInt(args[0]))) {
            var coins = parseInt(args[0]);
            if(shopManager.hasUserEnoughMoney(message.author.id, coins)) {
                shopManager.buy(message.author.id, coins);
                machine(message, coins);
            } else {
                answer = 'Du besitzt nicht so viele Coins um sie einzusetzen!'
                message.channel.send(answer);
                logger.command(message.author.username, message.toString(), answer);
                return;
            }
        } else {
            answer = 'Falsche Verwendung des Commands! +slot <einsatz> / +slot <spins> <einsatz>'
            message.channel.send(answer);
            logger.command(message.author.username, message.toString(), answer);
        }
	},
};

function machine(message, coins){
    var reel = slot();
    var reelAsString = reelConvert(reel);
    var win = calcWin(reel, coins);
    var embed = {
        color: 0xff0000,
        title: message.author.tag,
        description: 'Versuche dein glück! Gewinne bis zum 200 FACHEN vom Einsatz! 20 Linien!',
        author: {
            name: 'KuramaSlot777',
            icon_url: 'http://devdenis.bplaced.net/sharingan.png'
        },
        timestamp: new Date(),
        fields:
        [
            {name: 'Symbole:', value: ':slot_machine: bis zu x'+seven[seven.length-1]+' Gewinn! pro Linie \n :melon: bis zu x'+melon[melon.length-1]+' Gewinn! pro Linie \n :grapes: bis zu x'+grape[grape.length-1]+' Gewinn! pro Linie \n :tangerine: bis zu x'+orange[orange.length-1]+' Gewinn! pro Linie \n :peach: bis zu x'+peach[peach.length-1]+' Gewinn! pro Linie \n :lemon: bis zu x'+lemon[lemon.length-1]+' Gewinn! pro Linie \n :cherries: bis zu x'+cherry[cherry.length-1]+' Gewinn! pro Linie'}
            
        ]
    };
    embed.fields.push({name: 'Slot: ', value: reelAsString});

    if(win == 0) {
        /*if((Math.floor(Math.random() * 3) + 1) == 2) {
            embed.fields.push({name: 'Cashback:', value: 'Durch Magie hast du deinen Einsatz zurückerhalten! \n Du hast nun ' + xpManager.getUserEntry(message.author.id).coins + ' Coins!'});
            log = 'Cashback'
            shopManager.addCoins(message.author.id, coins);
        } else {*/
            embed.fields.push({name: 'Lose:', value: 'Du hast leider nichts gewonnen... Versuche dein Glück erneut! \n Du hast nun ' + xpManager.getUserEntry(message.author.id).coins.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' Coins!'});
            log = 'No Win'
        //}
    } else {
        shopManager.addCoins(message.author.id, win);
        var winReel = reelConvert(winLane(reel));
        embed.fields.push({name:'WinLines:', value: winReel});
        embed.fields.push({name: 'Gewinn:', value: 'Du hast ' + win.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' Coins gewonnen! \n Du hast nun ' + xpManager.getUserEntry(message.author.id).coins.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' Coins!'});
        log = 'Win: ' + win;
    }
    message.channel.send({embed: embed});
    logger.command(message.author.username, message.toString(), log);
}

function slot() {
    var reel = [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]];
    //reel = [[7,7,7,7,7],[1,2,3,4,5],[4,2,5,1,3]];
    var random = (Math.floor(Math.random() * 50) + 1);
    for(var i = 0; i < reel[0].length; i++) {
        for(j = 0; j < reel.length; j++) {
            if((Math.floor(Math.random() * 25) + 1) == 2) {
                reel[j][i] = 7;
            } else if (random == 25){
                reel[j][i] = (Math.floor(Math.random() * 3) + 4);
            } else {
                reel[j][i] = (Math.floor(Math.random() * 7) + 1);
            }
        }
    }

    //var lane = [];
    //Generate Slot
    /*for(var i = 0; i < 3; i++) {
        lane = [];
            for (var j = 0; j < 5; j++) {
                if((Math.floor(Math.random() * 5) + 1) == 3) {
                    lane.push(Math.floor(Math.random() * 3) + 5);
                } else {
                    lane.push(Math.floor(Math.random() * 4) + 1);
                }

                if(j == 4) {
                    reel.push(lane);
                }
            }
    }*/
    return reel;
}

function calcWin(reel, coins) {
    //Calculate Win
    var win = 0;
    var minStreak = 2;
    //LineWins NO REVERSE
    for(var i = 0; i < 10; i++) {
        var streak = laneCheck(i,reel,false);
        if(streak >= minStreak) {
            var icon = reel[lanes[i][0][0]][lanes[i][0][1]];
            //console.log(icon + ': lane=' + i + ' streak='+check);
            win += genCoins(icon,coins,streak)
            //console.log('COINS:' + genCoins(icon,coins,streak));
        }
    }

    //LineWins REVERSE
    for(var i = 0; i < 10; i++) {
        var streak = laneCheck(i,reel,true);
        if(streak >= minStreak) {
            var icon = reel[lanes[i][4][0]][lanes[i][4][1]];
            //console.log(icon + ': lane=' + i + ' streak='+check);
            win += genCoins(icon,coins,streak)
            //console.log('COINSREV:' + genCoins(icon,coins,streak));
        }
    }

    return win;
}

function winLane(reel) {
    var winReel = [['x','x','x','x','x'],['x','x','x','x','x'],['x','x','x','x','x']];
        for(var j = 0; j < 10; j++) {
            for(var i = 3; i >= 0; i--) {
                var pos1 = lanes[j][4][0];
                var pos2 = lanes[j][4][1];
                var pos3 = lanes[j][i][0];
                var pos4 = lanes[j][i][1];
                var pos5 = lanes[j][2][0];
                var pos6 = lanes[j][2][1];
                if(reel[pos1][pos2] == reel[pos3][pos4] && reel[pos1][pos2] == reel[pos5][pos6]) {
                    winReel[pos1][pos2] = reel[pos1][pos2]
                    winReel[pos3][pos4] = reel[pos1][pos2];
                } else {
                    break;
                }
            }
        }

        for(var j = 0; j < 10; j++) {
            for(var i = 1; i < 5; i++) {
                var pos1 = lanes[j][0][0];
                var pos2 = lanes[j][0][1];
                var pos3 = lanes[j][i][0];
                var pos4 = lanes[j][i][1];
                var pos5 = lanes[j][2][0];
                var pos6 = lanes[j][2][1];
                if(reel[pos1][pos2] == reel[pos3][pos4] && reel[pos1][pos2] == reel[pos5][pos6]) {
                    winReel[pos1][pos2] = reel[pos1][pos2];
                    winReel[pos3][pos4] = reel[pos1][pos2];
                } else {
                    break;
                }
            }
        }

    return winReel;
}

function laneCheck(lane, reel, reverse) {
    var streak = 0;
    if(reverse) {
        for(var i = 3; i >= 0; i--) {
            var pos1 = lanes[lane][4][0];
            var pos2 = lanes[lane][4][1];
            var pos3 = lanes[lane][i][0];
            var pos4 = lanes[lane][i][1];
            if(reel[pos1][pos2] == reel[pos3][pos4]) {
                streak++;
            } else {
                break;
            }
        }
    } else {
        for(var i = 1; i < 5; i++) {
            var pos1 = lanes[lane][0][0];
            var pos2 = lanes[lane][0][1];
            var pos3 = lanes[lane][i][0];
            var pos4 = lanes[lane][i][1];
            if(reel[pos1][pos2] == reel[pos3][pos4]) {
                streak++;
                //console.log('HIT || lane=' + lane + ' symbol=' + reel[pos1][pos2] + ' streak=' + streak);
            } else {
                break;
            }
        }
    }
    return streak;
}

function genCoins(number, coins, streak){
    /*
    * 1 = Kirsche            
    * 2 = Orange             
    * 3 = Zitrone            
    * 4 = Pfirsisch
    * 5 = Melone             
    * 6 = Traube
    * 7 = 777                
    */
    switch(number) {
        case 1:
            //console.log(number + ' streak=' + cherry[streak])
            return Math.floor((cherry[streak] * coins));
        case 2:
            //console.log(number + ' streak=' + orange[streak])
            return Math.floor((orange[streak] * coins));
        case 3:
            //console.log(number + ' streak=' + lemon[streak])
            return Math.floor((lemon[streak] * coins));
        case 4:
            //console.log(number + ' streak=' + peach[streak])
            return Math.floor((peach[streak] * coins));
        case 5:
            //console.log(number + ' streak=' + melon[streak])
            return Math.floor((melon[streak] * coins));
        case 6:
            //console.log(number + ' streak=' + grape[streak])
            return Math.floor((grape[streak] * coins));
        case 7:
            //console.log(number + ' streak=' + seven[streak])
            return Math.floor((seven[streak] * coins));
    }
    return 0;
}

function reelConvert(reel) {
    var newReel = [];
    var newLane = [];
    var s = '';
    for(var i = 0; i < 3; i++) {
        newLane = [];
        for (var j = 0; j < 5; j++) {
            switch(reel[i][j]) {
                case 'x':
                    newLane.push(':x:');
                    break;
                case 1:
                    newLane.push(':cherries:');
                    break;
                case 2:
                    newLane.push(':tangerine:');
                    break;
                case 3:
                    newLane.push(':lemon:');
                    break;
                case 4:
                    newLane.push(':peach:');
                    break;
                case 5:
                    newLane.push(':melon:');
                    break;
                case 6:
                    newLane.push(':grapes:');
                    break;
                case 7:
                    newLane.push(':slot_machine:');
                    break;
            }
            if(j == 2) {
                newReel.push(newLane);
            }
        }
    }
    s = newReel[0][0] + ' ' + newReel[0][1] + ' ' + newReel[0][2] + ' ' + newReel[0][3] + ' ' + newReel[0][4] + '\n'
    + newReel[1][0] + ' ' + newReel[1][1] + ' ' + newReel[1][2] + ' ' + newReel[1][3] + ' ' + newReel[1][4] + '\n'
    + newReel[2][0] + ' ' + newReel[2][1] + ' ' + newReel[2][2] + ' ' + newReel[2][3] + ' ' + newReel[2][4];
    return s;
}
