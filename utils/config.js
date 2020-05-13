const readline = require('readline').createInterface({
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
    readline.question('Please enter your DiscordBot token!\n', (token) => {
        config.token = token;
        logger.debug('Token is: ' + token);
        readline.question('Which prefix for the commands do u want?\n', (answer) => {
          config.prefix = answer;
          logger.debug('Prefix is: ' + answer);
          readline.question('Which XP multiplier do u want? nextlevel=level*multiplier\n', (answer) => {
            config.xpvalue = answer;
            logger.debug('XP-Mulitplier: ' + answer);
            readline.question('In which channel can i post the XP notifications? (ID)\n', (answer) => {
              config.xpchannel = answer;
              logger.debug('ChannelID: ' + answer);
              readline.question('Which ID has your Admin role?\n', (answer) => {
                config.adminroleid = answer;
                logger.debug('AdminRoleID: ' + answer);
                readline.question('Which ID has your Mod role?\n', (answer) => {
                  config.modroleid = answer;
                  logger.debug('ModRoleID: ' + answer);
                  readline.close()
                  fs.writeFileSync('config.json', JSON.stringify(config));
                  console.log('')
                  console.log('Setup is completed please restart KuramaSenpai to get started!');
                  logger.debug('Setup configuration: ' + JSON.stringify(config));
                })
              })
            })
          })
        })
      })
}

/**
 * Generates the config file if its not exists.
 * @param {*} fs 
 */
function generateConfigFile(fs) {
    if(!fs.existsSync('config.json')) {
      fs.writeFileSync('config.json', '{}', 'utf8');
    }
  }

exports.setup = setup;
exports.generateConfigFile = generateConfigFile;