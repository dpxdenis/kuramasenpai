const logger = require('./logger.js');
const fsnew = require('fs');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

/**
 * Will start the KuramaSenpai Setup and create the config.
 */
function setup(config, logger, fs){
    console.log('Welcome to the setup for KuramaSenpai!');
    config.debug = false;
    config.commandlistening = true;

    ask('Please enter your DiscordBot token!', config, 'token').then(() => 
    ask('Please enter your ServerID!', config, 'serverid').then(() =>
    ask('Which prefix for the commands do u want?', config, 'prefix').then(() => 
    ask('Which XP multiplier do u want? nextlevel=level*multiplier', config, 'xpvalue').then(() => 
    ask('In which channel can i post the XP notifications? (ID)', config, 'xpchannel').then(() =>
    ask('Which ID has your LvL 10 role?', config, 'lvl10roleid').then(() =>
    ask('Which ID has your LvL 30 role?', config, 'lvl30roleid').then(() =>
    ask('Which ID has your LvL 50 role?', config, 'lvl50roleid').then(() =>
    ask('Which ID has your Admin role?', config, 'adminroleid').then(() =>
    ask('Which ID has your Friends role?', config, 'friendsroleid').then(() =>
    ask('Which ID has your Mod role?', config, 'modroleid').then(() => finish(config, logger , fs))))))))))));
}

function finish(config, logger, fs) {
  config.xprate_text = Math.round(config.xpvalue / 10);
  config.xprate_voice = Math.round(config.xpvalue / 3);
  config.coinrate_text = 10;
  config.coinrate_voice = 50;
  config.xptext_cooldown = 30;
  fs.writeFileSync('config.json', JSON.stringify(config));
  console.log('')
  console.log('Setup is completed please restart KuramaSenpai to get started!');
  logger.debug('Setup configuration: ' + JSON.stringify(config));
  rl.close();
}

/**
 * Generates the config files if its not exists.
 * @param {*} fs 
 */
function generateConfigFile(fs) {
    if(!fs.existsSync('config.json')) {
      fs.writeFileSync('config.json', '{}', 'utf8');
      logger.debug('Generated config file!');
    }
    if(!fs.existsSync('xp.json')) {
      fs.writeFileSync('xp.json', '{}', 'utf8');
      logger.debug('Generated xp file!');
    }
    if(!fs.existsSync('shop.json')) {
      fs.writeFileSync('shop.json', JSON.stringify(addItemsToShopAtSetup()), 'utf8');
      logger.debug('Generated shop file!');
    }
    if(!fs.existsSync('shop_users.json')) {
      fs.writeFileSync('shop_users.json', '{}', 'utf8');
      logger.debug('Generated shop_users file!');
    }
    if(!fs.existsSync('boost_users.json')) {
      fs.writeFileSync('boost_users.json', '{}', 'utf8');
      logger.debug('Generated boost_users file!');
    }
}

function addItemsToShopAtSetup() {
  var shopItem = {};
  shopItem[0] = {id:0,name:'XP-Boost x2 (10 Minuten)',type:'xp',multiplier:2,cost:1000,duration:10};
  shopItem[1] = {id:1,name:'XP-Boost x2 (30 Minuten)',type:'xp',multiplier:2,cost:2500,duration:30};
  shopItem[2] = {id:2,name:'XP-Boost x2 (1 Stunde)',type:'xp',multiplier:2,cost:5000,duration:60};
  shopItem[3] = {id:3,name:'XP-Boost x2 (2 Stunden)',type:'xp',multiplier:2,cost:10000,duration:120};
  shopItem[4] = {id:4,name:'XP-Boost x2 (5 Stunden)',type:'xp',multiplier:2,cost:22000,duration:300};
  shopItem[5] = {id:5,name:'Coin-Boost x2 (12 Stunden)',type:'coin',multiplier:2,cost:20000,duration:720};
  shopItem[6] = {id:6,name:'All-Boost x2 (1 Stunden)',type:'all',multiplier:2,cost:9000,duration:60};
  shopItem[7] = {id:7,name:'All-Boost x2 (2 Stunden)',type:'all',multiplier:2,cost:16000,duration:120};
  shopItem[8] = {id:8,name:'All-Boost x4 (1 Stunde)',type:'all',multiplier:4,cost:50000,duration:60};
  shopItem[9] = {id:9,name:'CoinSammler',type:'rank',cost:25000};
  shopItem[10] = {id:10,name:'Richboooi rank',type:'rank',cost:100000};
  return shopItem;
}

function updateShopFile() {
  fsnew.writeFileSync('shop.json', JSON.stringify(addItemsToShopAtSetup()), 'utf8');
  logger.debug('Updated shop file!');
}

async function ask(msg, config, configName) {
  var answer = await question(msg + '\n');
  config[configName] = answer;
  logger.debug(configName + ': ' + answer);
}

function question(q) {
  return new Promise(resolve => rl.question(q, answer => resolve(answer)))
}

exports.setup = setup;
exports.generateConfigFile = generateConfigFile;
exports.updateShopFile = updateShopFile;