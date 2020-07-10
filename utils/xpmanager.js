const fs = require('fs');
const index = require('../index.js');
const logger = require('./logger.js');
const shopManager = require('./shopmanager.js')
var xpFileRaw = fs.readFileSync('xp.json', {encoding: 'utf8', flag: 'a+'});
var xpFile = JSON.parse(xpFileRaw);
var onlineUsers = [];

function giveXP(userid, type, value) {
    var wonxp;
    var woncoins;
    var nonboostxp;
    var nonboostcoins;
    var boost = shopManager.hasUserBoost(userid);
    if(value != null) {
        if(type == 'xpevent') {
            wonxp = parseInt(value);
            woncoins = randomValue(index.config.coinrate_voice);
        } else {
            wonxp = randomValue(index.config.xprate_voice);
            woncoins = parseInt(value);
        }
    } else {
        if(type == 'text') {
            wonxp = randomValue(index.config.xprate_text);
            woncoins = randomValue(index.config.coinrate_text);
    
        } else {
            wonxp = randomValue(index.config.xprate_voice);
            woncoins = randomValue(index.config.coinrate_voice);
        }
    }

    if(boost) {
        switch(shopManager.getUserBoostType(userid)) {
            case 'xp':
                nonboostxp = wonxp;
                wonxp = wonxp * parseInt(shopManager.getUserBoostMultiplicator(userid));
                break;
            case 'coin':
                nonboostcoins = woncoins;
                woncoins = woncoins * parseInt(shopManager.getUserBoostMultiplicator(userid));
                break;
            case 'all':
                nonboostxp = wonxp;
                nonboostcoins = woncoins;
                wonxp = wonxp * parseInt(shopManager.getUserBoostMultiplicator(userid));
                woncoins = woncoins * parseInt(shopManager.getUserBoostMultiplicator(userid));
                break;
        }
    }

    var fetchedUser = index.client.users.get(userid); 
    if(fetchedUser.bot) return;
    generateAccountIfEmpty(userid);
    var user = xpFile[userid];
    var nextLvL = parseInt(user.level * index.config.xpvalue);
    
    user.xp = parseInt(user.xp) + wonxp;
    user.coins = parseInt(user.coins) + woncoins;
    

    if(nextLvL <= user.xp) {
        user.xp = parseInt(user.xp) - nextLvL;
        user.level++;
        var currentXP = parseInt(user.xp);
        var currentLvL = parseInt(user.level);
        nextLvL = parseInt(user.level * index.config.xpvalue);
        var difference = parseInt(nextLvL - currentXP);

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

        index.client.channels.get(index.config.xpchannel).send('<@' + userid + '>');
        index.client.channels.get(index.config.xpchannel).send({embed: embed});

        logger.xplvlup(fetchedUser.tag + ' levelup! Level: ' + currentLvL);

        index.client.channels.get(index.config.xpchannel).send(generateScoreboard());
    }
    if(type == 'text') {
        if(boost) {
            switch(shopManager.getUserBoostType(userid)) {
                case 'xp':
                    logger.xp('[BOOST] ' + fetchedUser.tag + ' got ' + wonxp + ' xp! (NonBoost:'+nonboostxp+') LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
                    logger.coins(fetchedUser.tag + ' got ' + woncoins + ' coins!');
                    break;
                case 'coin':
                    logger.xp(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
                    logger.coins('[BOOST] ' + fetchedUser.tag + ' got ' + woncoins + ' coins! (NonBoost:'+nonboostcoins+')');
                    break;
                case 'all':
                    logger.xp('[BOOST] ' + fetchedUser.tag + ' got ' + wonxp + ' xp! (NonBoost:'+nonboostxp+') LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
                    logger.coins('[BOOST] ' + fetchedUser.tag + ' got ' + woncoins + ' coins! (NonBoost:'+nonboostcoins+')');
                    break;
            }
        } else {
            logger.xp(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
            logger.coins(fetchedUser.tag + ' got ' + woncoins + ' coins!');
        }
    } else {
        if(boost) {
            switch(shopManager.getUserBoostType()) {
                case 'xp':
                    logger.xpVoice('[BOOST] ' + fetchedUser.tag + ' got ' + wonxp + ' xp! (NonBoost:'+nonboostxp+') LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
                    logger.coinsVoice(fetchedUser.tag + ' got ' + woncoins + ' coins!');
                    break;
                case 'coin':
                    logger.xpVoice(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
                    logger.coinsVoice('[BOOST] ' + fetchedUser.tag + ' got ' + woncoins + ' coins! (NonBoost:'+nonboostcoins+')');
                    break;
                case 'all':
                    logger.xpVoice('[BOOST] ' + fetchedUser.tag + ' got ' + wonxp + ' xp! (NonBoost:'+nonboostxp+') LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
                    logger.coinsVoice('[BOOST] ' + fetchedUser.tag + ' got ' + woncoins + ' coins! (NonBoost:'+nonboostcoins+')');
                    break;
            }
        } else {
            logger.xpVoice(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
            logger.coinsVoice(fetchedUser.tag + ' got ' + woncoins + ' coins!');
        }
    }
    saveFile();
}

function randomValue(value) {
    return Math.floor(Math.random() * Math.round(parseInt(value))) + 1;
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
        giveXP(onlineUsers[i], 'voice', null);
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
        title: 'Scoreboard Top 10',
        author: {
            name: 'KuramaXP',
            icon_url: 'http://devdenis.bplaced.net/sharingan.png'
        },
        thumbnail: {
            url:  index.client.users.get('536292484838457344').avatarURL
        },
        timestamp: new Date(),
        fields:
        [
        ]
    };
    if(scoreboard.length < 10) {
        for(var i = 0; i < scoreboard.length; i++) {
            var fetchedUser = index.client.users.get(scoreboard[i].toString().split(':')[0]);
            if(i+1 < scoreboard.length) {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])},);
            } else {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])});
            }
        }
    } else {
        for(var i = 0; i < 10; i++) {
            var fetchedUser = index.client.users.get(scoreboard[i].toString().split(':')[0]);
            if(i+1 < 10) {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])},);
            } else {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])});
            }
        }
    }
    logger.debug('Sent scoreboard!');
    return {embed: embed};
}

function getUserEntry(userid) {
    return xpFile[userid];
}

function generateAccountIfEmpty(userid) {
    if(!xpFile[userid]) {
        xpFile[userid] = {
            xp: 0,
            level: 1,
            coins: 50,
        }
    }
}

exports.giveXP = giveXP;
exports.onlineUsers = onlineUsers;
exports.countdownVoiceXP = countdownVoiceXP;
exports.xpFile = xpFile;
exports.startUpAddUsers = startUpAddUsers;
exports.generateScoreboard = generateScoreboard;
exports.getUserEntry = getUserEntry;
exports.generateAccountIfEmpty = generateAccountIfEmpty;
exports.saveFile = saveFile;
