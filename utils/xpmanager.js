const fs = require('fs');
const index = require('../index.js');
const logger = require('./logger.js');
const shopManager = require('./shopmanager.js');
var xpFileRaw = fs.readFileSync('xp.json', {encoding: 'utf8', flag: 'a+'});
var xpFile = JSON.parse(xpFileRaw);
var onlineUsers = [];
var cooldown = [];

function giveXP(userid, type, value) {
    var wonxp = generateWonXP(userid, type, value);
    var woncoins = generateWonCoins(userid, type, value);
    var rank = 'NULL';
    var fetchedServer = index.client.guilds.cache.get(index.config.serverid);
    var fetchedUser = index.fetchUser(userid); 
    generateAccountIfEmpty(userid);
    var user = xpFile[userid];
    var nextLvL = getNextLvLUp(user);

    user.xp = parseInt(user.xp) + wonxp;
    user.coins = parseInt(user.coins) + woncoins;
    
    //LEVELUP
    if(nextLvL <= user.xp) {
        handleLevelUp(user);

        if(user.level == 10 || user.level == 30 || user.level == 50) {
            rank = handleRankUpdate(fetchedServer, userid, user.level);
        }

        var embed = generateMessage(rank, userid, fetchedUser, user);
        
        index.client.channels.cache.get(index.config.xpchannel).send('<@' + userid + '>');
        index.client.channels.cache.get(index.config.xpchannel).send({embed: embed});
        logger.xplvlup(fetchedUser.tag + ' levelup! Level: ' + user.level);
        index.client.channels.cache.get(index.config.xpchannel).send(generateScoreboard());
    }

    logger.xp(fetchedUser.tag + ' got ' + wonxp + ' xp! LvL:' + user.level + ' NextLvL: ' + ((user.level * index.config.xpvalue) - user.xp));
    logger.coins(fetchedUser.tag + ' got ' + woncoins + ' coins!');

    saveFile();
}

function generateWonXP(userid, type, value) {
    var wonxp = 0;
    var tempXP = 0;
    var minXpRate = 0;
    if(value != null && type == 'xpevent') {
        wonxp = parseInt(value);
        return wonxp;
    }

    switch(type) {
        case 'text':
            tempXP = randomValue(index.config.xprate_text);
            minXpRate = Math.round((parseInt(index.config.xprate_text) / 3));
            break;
        case 'voice':
            tempXP = randomValue(index.config.xprate_voice);
            minXpRate = Math.round((parseInt(index.config.xprate_voice) / 3));
            break;
        default:
            tempXP = randomValue(index.config.xprate_voice);
            minXpRate = Math.round((parseInt(index.config.xprate_voice) / 3));
            break;
    }
        
    if(tempXP < minXpRate) {
        wonxp = minXpRate;
    } else {
         wonxp = tempXP;
    }

    if (shopManager.hasUserBoost(userid) && shopManager.getUserBoostType(userid) == 'xp' ||
        shopManager.getUserBoostType(userid) == 'all') {
        logger.debug(index.fetchUser(userid).tag + ' XP BOOST')
        wonxp *= parseInt(shopManager.getUserBoostMultiplicator(userid));
    }
    return wonxp;
}

function generateWonCoins(userid, type, value) {
    var woncoins = 0;
    var tempCoin = 0;
    var minCoinRate = 0;
    if(value != null && type == 'coinevent') {
        woncoins = parseInt(value);
        return woncoins;
    }

    switch(type) {
        case 'text':
            tempCoin = randomValue(index.config.coinrate_text);
            minCoinRate = Math.round((parseInt(index.config.coinrate_text) / 3));
            break;
        case 'voice':
            tempCoin = randomValue(index.config.coinrate_voice);
            minCoinRate = Math.round((parseInt(index.config.coinrate_voice) / 3));
            break;
        default:
            tempCoin = randomValue(index.config.coinrate_voice);
            minCoinRate = Math.round((parseInt(index.config.coinrate_voice) / 3));
            break;
    }

    if(tempCoin < minCoinRate) {
        woncoins = minCoinRate;
    } else {
        woncoins = tempCoin;
    }

    if (shopManager.hasUserBoost(userid) && shopManager.getUserBoostType(userid) == 'coin' ||
        shopManager.getUserBoostType(userid) == 'all') {
            woncoins *= parseInt(shopManager.getUserBoostMultiplicator(userid));
    }
    return woncoins;
}

function handleLevelUp(user){
    user.xp = parseInt(user.xp) - parseInt(user.level * index.config.xpvalue);
    user.level++;
}

function handleRankUpdate(fetchedServer, userid ,level) {
    var rank;
    switch(level) {
        case 10:
            rank = fetchedServer.roles.cache.get(index.config.lvl10roleid);
            break;
        case 30:
            rank = fetchedServer.roles.cache.get(index.config.lvl30roleid);
            fetchedServer.members.cache.get(userid).roles.remove(index.config.lvl10roleid);
            break;
        case 50:
            rank = fetchedServer.roles.cache.get(index.config.lvl50roleid);
            fetchedServer.members.cache.get(userid).roles.remove(index.config.lvl10roleid);
            fetchedServer.members.cache.get(userid).roles.remove(index.config.lvl30roleid);
            break;
    }
    fetchedServer.members.cache.get(userid).roles.add(rank)
    return rank;
}

function generateMessage(rank,userid,fetchedUser,user) {
    var nextLvL = getNextLvLUp(user);
    var difference = parseInt(nextLvL - user.xp);
    var embed = {
        color: 0xff0000,
        title: fetchedUser.tag,
        author: {
            name: 'KuramaXP',
            icon_url: 'http://devdenis.bplaced.net/sharingan.png'
        },
        thumbnail: {
            url: fetchedUser.avatarURL()
        },
        timestamp: new Date(),
        fields:
        [
            {name: 'LevelUp!', value: 'Du bischt in 1 neuz levelz!'},
            {name: 'Level: ', value: user.level},
            {name: 'Coins: ', value: user.coins},
            {name: 'Erforderliche XP bis zum nächsten Level', value: difference},
            {name: 'Items:', value: shopManager.getUserItemsAsString(userid)}
        ]
    };

    if(rank != 'NULL') {
        embed.fields.push({name: 'Neuer Rang!', value: rank.name});
    }
    return embed;
}

function randomValue(value) {
    return Math.floor(Math.random() * Math.round(parseInt(value))) + 1;
}

function getNextLvLUp(user) {
    var nextLvL;
    if(user.level <= 10) {
        nextLvL = parseInt(user.level * index.config.xpvalue);
    } else if (user.level > 10 && user.level <= 30) {
        nextLvL = parseInt(20 * index.config.xpvalue);
    } else {
        nextLvL = parseInt(30 * index.config.xpvalue);
    }
    return nextLvL;
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
    var adminboard = [];
    var fetchedServer = index.client.guilds.cache.get(index.config.serverid);
    var allUserIDs = Object.keys(xpFile);
    allUserIDs.forEach(function(key) {
        if(fetchedServer.members.cache.get(key) != undefined && fetchedServer.members.cache.get(key).roles.cache.has(index.config.adminroleid)) {
            adminboard.push(key + ':' + xpFile[key].level);
        } else {
            scoreboard.push(key + ':' + xpFile[key].level);
        }
    });
    scoreboard.sort(function(a, b){return b.toString().split(':')[1]-a.toString().split(':')[1]});
    adminboard.sort(function(a, b){return b.toString().split(':')[1]-a.toString().split(':')[1]});
    const embed = {
        color: 0xff0000,
        title: 'Scoreboard Top 10',
        author: {
            name: 'KuramaXP',
            icon_url: 'http://devdenis.bplaced.net/sharingan.png'
        },
        thumbnail: {
            url:  index.fetchUser('536292484838457344').avatarURL()
        },
        timestamp: new Date(),
        fields:
        [
        ]
    };

    embed.fields.push({name: '--------------------', value: 'Admins:'},);
    if(adminboard.length < 10) {
        for(var i = 0; i < adminboard.length; i++) {
            var fetchedUser = index.fetchUser(adminboard[i].toString().split(':')[0]);
            if(i+1 < adminboard.length) {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + adminboard[i].toString().split(':')[1])},);
            } else {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + adminboard[i].toString().split(':')[1])});
            }
        }
    } else {
        for(var i = 0; i < 10; i++) {
            var fetchedUser = index.fetchUser(adminboard[i].toString().split(':')[0]);
            if(i+1 < 10) {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + adminboard[i].toString().split(':')[1])},);
            } else {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + adminboard[i].toString().split(':')[1])});
            }
        }
    }

    embed.fields.push({name: '--------------------', value: 'User:'},);
    if(scoreboard.length < 10) {
        for(var i = 0; i < scoreboard.length; i++) {
            var fetchedUser = index.fetchUser(scoreboard[i].toString().split(':')[0]);
            if(i+1 < scoreboard.length) {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])},);
            } else {
                embed.fields.push({name: 'Platz ' + ((i+1) + '.'), value: (fetchedUser.tag + ' || Level: ' + scoreboard[i].toString().split(':')[1])});
            }
        }
    } else {
        for(var i = 0; i < 10; i++) {
            var fetchedUser = index.fetchUser(scoreboard[i].toString().split(':')[0]);
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

function addAntiSpamCooldown(userid) {
    if(!cooldown[userid]) {
        cooldown[userid] = {
            left: parseInt(index.config.xptext_cooldown)
        }
    } else {
        cooldown[userid].left = parseInt(index.config.xptext_cooldown);
    }
}

function hasAntiSpamCooldown(userid) {
    if(!cooldown[userid]) {
        return false;
    } else if (cooldown[userid].left == null) {
        return false;
    } else {
        return true;
    }
}

function countdownCooldown() {
    var convert = Object.keys(cooldown);
    for (let i = 0; i < convert.length; i++) {
        if(cooldown[convert[i]].left == 0) {
            cooldown[convert[i]].left = null;
            logger.debug('' + index.fetchUser(convert[i]).tag + ' removed cooldown!')
        } else if (cooldown[convert[i]].left != null){
            cooldown[convert[i]].left--;
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
exports.hasAntiSpamCooldown = hasAntiSpamCooldown;
exports.countdownCooldown = countdownCooldown;
exports.addAntiSpamCooldown = addAntiSpamCooldown;
exports.getNextLvLUp = getNextLvLUp;