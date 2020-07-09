const logger = require('./logger.js');

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
    ask('Which prefix for the commands do u want?', config, 'prefix').then(() => 
    ask('Which XP multiplier do u want? nextlevel=level*multiplier', config, 'xpvalue').then(() => 
    ask('In which channel can i post the XP notifications? (ID)', config, 'xpchannel').then(() =>
    ask('Which ID has your Admin role?', config, 'adminroleid').then(() =>
    ask('Which ID has your Mod role?', config, 'modroleid').then(() => finish(config, logger , fs)))))));
}

function finish(config, logger, fs) {
  config.xprate_text = Math.round(config.xpvalue / 10);
  config.xprate_voice = Math.round(config.xpvalue / 3);
  config.coinrate_text = 10;
  config.coinrate_voice = 50;
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