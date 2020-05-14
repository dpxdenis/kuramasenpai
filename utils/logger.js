var date = new Date().toLocaleString();
var index = require('../index.js');

function log(msg){
    console.log(date + ' [LOG] ' + msg);
}

function info(msg){
    console.log(date + ' [INFO] ' + msg);
}

function warn(msg){
    console.log(date + ' [WARN] ' + msg);
}

function err(msg){
    console.log(date + ' [ERR] ' + msg);
}

function debug(msg){
    if(index.isDebug) {
        console.log(date + ' [DEBUG] ' + msg);
    }
}

function xplvlup(msg){
    console.log(date + ' [XP-LevelUP] ' + msg);
}

function xplvlupVoice(msg){
    console.log(date + ' [XP-LevelUP][VOICE] ' + msg);
}

function xp(msg){
    console.log(date + ' [XP] ' + msg);
}

function xpVoice(msg){
    console.log(date + ' [XP][VOICE] ' + msg);
}

function coins(msg){
    console.log(date + ' [COINS] ' + msg);
}

function coinsVoice(msg){
    console.log(date + ' [COINS][VOICE] ' + msg);
}

function command(user, cmd, answer){
    if(index.isCommandListening) {
        console.log(date + ' [CMD] ' + 'User: ' + user + ' || CMD: ' + cmd + ' || Answer: ' + answer);
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