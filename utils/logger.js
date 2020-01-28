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

exports.log = log;
exports.info = info;
exports.warn = warn;
exports.err = err;
exports.debug = debug;