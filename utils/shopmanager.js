const fs = require('fs');
const index = require('../index.js');
const logger = require('./logger.js');
var shopFileRaw = fs.readFileSync('shop.json', {encoding: 'utf8', flag: 'a+'});
var shopFile = JSON.parse(shopFileRaw);
var shopUsersFileRaw = fs.readFileSync('shop_users.json', {encoding: 'utf8', flag: 'a+'});
var shopUsersFile = JSON.parse(shopUsersFileRaw);

function addItemToUser(userid, id) {
    var fetchedUsers = index.client.users.get(userid);
    if(fetchedUsers.bot) return;
    generateAccountIfEmpty(userid);
    var userItems = getItems(userid);
    for(var i = 0; i < userItems.length; i++) {

    }
    saveFile();
}

function checkCountdown(userid) {

}

function saveFile() {
    fs.writeFileSync('shop_users.json', JSON.stringify(shopUsersFile), 'utf8', function(err) {
        if(err) logger.err('shop_users file saving failed! ' + err);
    });
    fs.writeFileSync('shop.json', JSON.stringify(shopFile), 'utf8', function(err) {
        if(err) logger.err('shop file saving failed! ' + err);
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

function getShopItems() {
    return shopFile;
}

exports.getUserItems = getUserItems;
exports.getShopItems = getShopItems;