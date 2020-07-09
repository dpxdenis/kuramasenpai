var index = require('../index.js');

function log(msg){
    console.log(new Date().toLocaleString() + ' [LOG] ' + msg);
}

function info(msg){
    console.log(new Date().toLocaleString() + ' [INFO] ' + msg);
}

function warn(msg){
    console.log(new Date().toLocaleString() + ' [WARN] ' + msg);
}

function err(msg){
    console.log(new Date().toLocaleString() + ' [ERR] ' + msg);
}

function debug(msg){
    if(index.isDebug) {
        console.log(new Date().toLocaleString() + ' [DEBUG] ' + msg);
    }
}

function xplvlup(msg){
    console.log(new Date().toLocaleString() + ' [XP-LevelUP] ' + msg);
}

function xplvlupVoice(msg){
    console.log(new Date().toLocaleString() + ' [XP-LevelUP][VOICE] ' + msg);
}

function xp(msg){
    console.log(new Date().toLocaleString() + ' [XP] ' + msg);
}

function xpVoice(msg){
    console.log(new Date().toLocaleString() + ' [XP][VOICE] ' + msg);
}

function coins(msg){
    console.log(new Date().toLocaleString() + ' [COINS] ' + msg);
}

function coinsVoice(msg){
    console.log(new Date().toLocaleString() + ' [COINS][VOICE] ' + msg);
}

function update(msg){
    console.log(new Date().toLocaleString() + ' [UPDATE] ' + msg);
}

function shop(msg){
    console.log(new Date().toLocaleString() + ' [SHOP] ' + msg);
}

function command(user, cmd, answer){
    if(index.isCommandListening) {
        console.log(new Date().toLocaleString() + ' [CMD] ' + 'User: ' + user + ' || CMD: ' + cmd + ' || Answer: ' + answer);
    }
}

exports.log = log;
exports.info = info;
exports.warn = warn;
exports.err = err;
exports.debug = debug;
exports.command = command;
exports.xplvlup = xplvlup;
exports.xp = xp;
exports.coins = coins;
exports.xpVoice = xpVoice;
exports.coinsVoice = coinsVoice;
exports.xplvlupVoice = xplvlupVoice;
exports.update = update;
exports.shop = shop;