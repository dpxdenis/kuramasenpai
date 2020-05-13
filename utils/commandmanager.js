const index = require('../index.js')
const fs = require('fs');
const logger = require('../utils/logger.js');
var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

function importCommands(){
    logger.debug('Loading all Commands...')
    for(const file of commandFiles) {
      const command = require(`../commands/${file}`);
      index.client.commands.set(command.name, command);
      logger.debug('Loaded Command: ' + command.name)
    }
    logger.debug('Loaded ' + commandFiles.length + ' Commands!');
}

//Reload all Commands
function reloadCommands(msg){
    //Removing all Commands first
    for(const file of commandFiles) {
      delete require.cache[require.resolve(`../commands/${file}`)]
    }
    //Adds new Commands to live!
    commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    try {
      for(const file of commandFiles) {
      const command = require(`../commands/${file}`);
      index.client.commands.set(command.name, command);
      logger.debug('Reloaded Command: ' + command.name)
      }
      logger.info('Reloaded ' + commandFiles.length + ' Commands!');
      msg.channel.send('Reloaded ' + commandFiles.length + ' Commands!');
    } catch (error) {
      logger.err(error);
      logger.err('Error while reloading all commands!')
    }
}

exports.commandFiles = commandFiles;
exports.importCommands = importCommands;
exports.reloadCommands = reloadCommands;