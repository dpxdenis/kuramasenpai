const fs = require('fs');
const index = require('../index.js');
const logger = require('./logger.js')
var xpFileRaw = fs.readFileSync('xp.json', {encoding: 'utf8', flag: 'a+'});
var xpFile = JSON.parse(xpFileRaw);
var onlineUsers = [];

function giveXP(userid, type) {
    if(type == 'text') {
        var wonxp = Math.floor(Math.random() * 20) + 1;
        var woncoins = Math.floor(Math.random() * 4) + 1;

    } else {
        var wonxp = Math.floor(Math.random() * 50) + 1;
        var woncoins = Math.floor(Math.random() * 9) + 1;
    }
    var fetchedUser = index.client.users.get(userid); 
    if(fetchedUser.bot) return;
    if(!xpFile[userid]) {
        xpFile[userid] = {
            xp: 0,
            level: 1,
            coins: 50
        }
    }
    var user = xpFile[userid];
    var nextLvL = user.level * index.config.xpvalue;
    
    user.xp += wonxp;
    user.coins += woncoins;
    

    if(nextLvL <= user.xp) {
        user.level++;
        user.xp = 0;
        var currentXP = user.xp;
        var currentLvL = user.level;
        nextLvL = user.level * index.config.xpvalue;
        var difference = nextLvL - currentXP;
        var embed = {
            color: 0xff0000,
            title: fetchedUser.tag,
            author: {
                name: 'KuramaXP',
                icon_url: 'http://devdenis.bplaced.net/sharingan.png'
            },
            thumbnail: {
                url: fetchedUser.avatarURL
            },
            timestamp: new Date(),
            fields:
            [
                {name: 'LevelUp!', value: 'Du bischt in 1 neuz levelz!'},
                {name: 'Level: ', value: currentLvL},
                {name: 'Coins: ', value: user.coins},
                {name: 'Erforderliche XP bis zum nächsten Level', value: difference}
            ]
        };

        if(type == 'voice') {
            embed = {
                color: 0xff0000,
                title: fetchedUser.tag,
                author: {
                    name: 'KuramaXP',
                    icon_url: 'http://devdenis.bplaced.net/sharingan.png'
                },
                thumbnail: {
                    url: fetchedUser.avatarURL
                },
                timestamp: new Date(),
                fields:
                [
                    {name: 'LevelUp!', value: 'Du bischt in 1 neuz levelz! Durch chillen im VoiceChat!'},
                    {name: 'Level: ', value: currentLvL},
                    {name: 'Coins: ', value: user.coins},
                    {name: 'Erforderliche XP bis zum nächsten Level', value: difference}
                ]
            };
        }
        index.client.channels.get(index.config.xpchannel).send('<@' + userid + '>');
        index.client.channels.get(index.config.xpchannel).send({embed: embed});
        if(type == 'text') {
            logger.xplvlup(fetchedUser.tag + ' levelup! Level: ' + currentLvL);
        } else {
            logger.xplvlupVoice(fetchedUser.tag + ' levelup! Level: ' + currentLvL);
        }

        index.client.channels.get(index.config.xpchannel).send(generateScoreboard());
    }
    if(type == 'text') {
        logger.xp(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
        logger.coins(fetchedUser.tag + ' got ' + woncoins + ' coins!');
    } else {
        logger.xpVoice(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
        logger.coinsVoice(fetchedUser.tag + ' got ' + woncoins + ' coins!');
    }
    saveFile();
}

function saveFile() {
    fs.writeFileSync('xp.json', JSON.stringify(xpFile), 'utf8', function(err) {
        if(err) logger.err('XP file saving failed! ' + err);
    });
}

function countdownVoiceXP() {
    for (let i = 0; i < onlineUsers.length; i++) {
        if(i == 0 && onlineUsers.length > 0) {
            logger.xpVoice('Online users in voice: ' + onlineUsers.length)
        }
        giveXP(onlineUsers[i], 'voice');
    }
}

function startUpAddUsers(member, id) {
    onlineUsers.push(id);
    logger.debug('Added ' + member + ' to OnlineUsersXP!')
}

function generateScoreboard(){
    var scoreboard = [];
    var allUserIDs = Object.keys(xpFile);
    allUserIDs.forEach(function(key) {
        scoreboard.push(key + ':' + xpFile[key].level);
    });
    scoreboard.sort(function(a, b){return b.toString().split(':')[1]-a.toString().split(':')[1]});
    const embed = {
        color: 0xff0000,
        title: 'Scoreboard',
        author: {
            name: 'KuramaXP',
            icon_url: 'http://devdenis.bplaced.net/sharingan.png'
        },
        timestamp: new Date(),
        fields:
        [
        ]
    };
    for(var i = 0; i < scoreboard.length; i++) {
        var fetchedUser = index.client.users.get(scoreboard[i].toString().split(':')[0]);
        if(i+1 < scoreboard.length) {
            embed.fields.push({name: ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])},);
        } else {
            embed.fields.push({name: ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])});
        }
    }
    logger.debug('Sent scoreboard!');
    return {embed: embed};
}

exports.giveXP = giveXP;
exports.onlineUsers = onlineUsers;
exports.countdownVoiceXP = countdownVoiceXP;
exports.xpFile = xpFile;
exports.startUpAddUsers = startUpAddUsers;
exports.generateScoreboard = generateScoreboard;
