const fs = require('fs');
const index = require('../index.js');
const logger = require('./logger.js');
const xpManager = require('./xpmanager.js')
var shopFileRaw = fs.readFileSync('shop.json', {encoding: 'utf8', flag: 'a+'});
var shopFile = JSON.parse(shopFileRaw);
var shopUsersFileRaw = fs.readFileSync('shop_users.json', {encoding: 'utf8', flag: 'a+'});
var shopUsersFile = JSON.parse(shopUsersFileRaw);
var usersInBoostFile = fs.readFileSync('boost_users.json', {encoding: 'utf8', flag: 'a+'});
var usersInBoost = JSON.parse(usersInBoostFile);

function addItemToUser(userid, item) {
    var fetchedUsers = index.fetchUser(userid);
    generateAccountIfEmpty(userid);
    var userItems = getUserItems(userid);
    userItems.push(item);
    if(item.type == 'xp' || item.type == 'coin' || item.type == 'all') {
        usersInBoost[userid] = {
            itemid: item.id,
            timeleft: item.duration
        };
    }
    saveFile();
}

function checkCountdown() {
    var raw = Object.keys(usersInBoost);
    var users = '';
    if(raw.length != 0) {
        raw.forEach(function(key) {
            if(usersInBoost[key] != null) {
                if(usersInBoost[key].timeleft <= 0) {
                    removeUserItem(key, usersInBoost[key].itemid);
                    usersInBoost[key] = null;
                } else {
                    usersInBoost[key].timeleft--;
                    var fetchedUsers = index.fetchUser(key);
                    users += fetchedUsers.tag + '(ID:' + usersInBoost[key].itemid + ' / TimeLeft: '+ usersInBoost[key].timeleft +' Min.),'
                }
            }
        });

        var u = (users.toString().split(',').length - 1);
        if(u != 0) {
            logger.debug('[SHOP] ' + u + ' Boosters active!')
            logger.debug('[SHOP] ' + users);
        }
        fs.writeFileSync('boost_users.json', JSON.stringify(usersInBoost), 'utf8', function(err) {
            if(err) logger.err('boost_users file saving failed! ' + err);
        });
    }
}

function saveFile() {
    fs.writeFileSync('shop_users.json', JSON.stringify(shopUsersFile), 'utf8', function(err) {
        if(err) logger.err('shop_users file saving failed! ' + err);
    });
    fs.writeFileSync('shop.json', JSON.stringify(shopFile), 'utf8', function(err) {
        if(err) logger.err('shop file saving failed! ' + err);
    });
    fs.writeFileSync('boost_users.json', JSON.stringify(usersInBoost), 'utf8', function(err) {
        if(err) logger.err('boost_users file saving failed! ' + err);
    });
}

function generateAccountIfEmpty(userid) {
    if(!shopUsersFile[userid]) {
        shopUsersFile[userid] = {
            items: []
        }
    }
}

function getUserItems(userid){
    generateAccountIfEmpty(userid);
    return shopUsersFile[userid].items;
}

function getUserItemsAsString(userid) {
    generateAccountIfEmpty(userid);
    var items = '';
    if(getUserItems(userid).length != 0) {
        for(var i = 0; i < getUserItems(userid).length; i++) {
            if(getUserItems(userid)[i].duration != null) {
                item = getUserItems(userid)[i];
                items = items + '- ' +item.name + ' (Rest: '+ getUserItemTimeLeft(userid) + ' Min.)' +'\n';
            } else {
                item = getUserItems(userid)[i];
                items = items + '- ' + item.name +'\n';
            }
        }
    } else {
        items = '-';
    }
    return items;
}

function removeUserItem(userid, itemid) {
    var items = getUserItems(userid);
    for(var i = 0; i < items.length; i++) {
        if(items[i].id == itemid) {
            var fetchedUsers = index.fetchUser(userid);
            logger.shop('User: ' + fetchedUsers.tag + ' || Removed Item: ' + items[i].name);
            items.splice(i,1);
        }
    }
    fs.writeFileSync('shop_users.json', JSON.stringify(shopUsersFile), 'utf8', function(err) {
        if(err) logger.err('shop_users file saving failed! ' + err);
    });
}

function getShopItems() {
    return shopFile;
}

function hasUserItem(userid, item) {
    var items = getUserItems(userid);
    if(items.length == 0) {
        return false;
    }

    for(var i = 0; i < items.length; i++) {
        if(items[i].id == item) {
            return true;
        }
    }
    return false;
}

function hasUserBoost(userid) {
    var items = getUserItems(userid);
    if(items.length == 0) {
        return false;
    }

    for(var i = 0; i < items.length; i++) {
        if(items[i].type == 'xp'  || items[i].type == 'coin' || items[i].type == 'all') {
            return true;
        }
    }
    return false;
}

function getUserBoostType(userid) {
    var items = getUserItems(userid);
    for(var i = 0; i < items.length; i++) {
        if(items[i].type == 'xp'  || items[i].type == 'coin' || items[i].type == 'all') {
            return items[i].type;
        }
    }
    return null;
}

function getUserBoostMultiplicator(userid) {
    var items = getUserItems(userid);
    for(var i = 0; i < items.length; i++) {
        if(items[i].type == 'xp'  || items[i].type == 'coin' || items[i].type == 'all') {
            return items[i].multiplier;
        }
    }
    return null;
}

function hasUserEnoughMoney(userid, itemcost) {
    if((parseInt(xpManager.getUserEntry(userid).coins) - parseInt(itemcost)) >= 0) {
        return true;
    } else {
        return false;
    }
}

function getUserItemTimeLeft(userid) {
    if(hasUserBoost(userid)) {
        if (usersInBoost[userid] != null) {
            return usersInBoost[userid].timeleft;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function isItemBooster(item) {
    if(item.type == 'xp' || item.type == 'coin' || item.type == 'all') {
        return true;
    } else {
        return false;
    }
}

function buy(userid, cost) {
    xpManager.getUserEntry(userid).coins -= parseInt(cost);
    xpManager.saveFile();
}

function addCoins(userid, coins) {
    xpManager.getUserEntry(userid).coins += parseInt(coins);
    xpManager.saveFile();
}

exports.getUserItems = getUserItems;
exports.getShopItems = getShopItems;
exports.addItemToUser = addItemToUser;
exports.hasUserItem = hasUserItem;
exports.hasUserBoost  = hasUserBoost;
exports.checkCountdown = checkCountdown;
exports.getUserBoostType = getUserBoostType;
exports.getUserBoostMultiplicator = getUserBoostMultiplicator;
exports.hasUserEnoughMoney = hasUserEnoughMoney;
exports.getUserItemsAsString = getUserItemsAsString;
exports.getUserItemTimeLeft = getUserItemTimeLeft;
exports.isItemBooster = isItemBooster;
exports.shopUsersFile = shopUsersFile;
exports.buy = buy;
exports.addCoins = addCoins;