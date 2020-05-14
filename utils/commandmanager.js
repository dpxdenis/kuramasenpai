const index = require('../index.js')
const fs = require('fs');
const logger = require('../utils/logger.js');
var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const xpmanager = require('./xpmanager.js');

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

function handle(message) {
  //Do write tha reply faster then fast.
  const reply = function(answer) {
    message.channel.send(answer);
  }

  //Some consts.
  const user = message.author;
  const args = message.content.toLowerCase().slice(index.config.prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();
  const command = index.client.commands.get(commandName) || index.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  //AntiExecuteNotFoundedCommandsWHYDONTUUSETHEHELP!!!
  if(!command) return logger.command('User: ' + user.username + ' || Command: ' + commandName + ' not found!');

  try {
      //Permissons auf lockerer Basis
      if(command.needsPerm) {
        if(command.perm.toLowerCase() == 'admin' && !(message.member.roles.has(index.config.adminroleid))) {
          message.delete(1000);
          return logger.command(user.username, commandName, 'No Permissions');
        } else if (command.perm.toLowerCase() == 'mod' && !(message.member.roles.has(index.config.modroleid || message.member.roles.has(index.config.adminroleid)))) {
          message.delete(1000);
          return logger.command(user.username, commandName, 'No Permissions');
        }
      }

      //ForgottenArgsProtect
      if(command.args && !args.length) {
        var answer = 'Notwendige Argumente fehlen! So gehts richtig: ' + command.usage;
        logger.command(user.username, commandName, answer);
        return reply(answer)
      }

      //DontDoDieseInThaDMs!
      if(command.guildOnly && message.channel.type !== 'text') {
        var answer = 'Dieser Command funktioniert nicht in den DMs!';
        logger.command(user.username, commandName, answer);
        return reply(answer)
      }

      command.execute(message, args);

  } catch (error) {
    logger.err(error);
    logger.debug(error.stack);
    logger.err('User: ' + user.username + ' || Command: ' + commandName + ' || Error while executing this command.')
  }
}

//AntiShittyAdProtectorV999
function checkMessage(msg){
  if(msg.author.bot) return;
  if(msg.content.toLowerCase().includes('discord.gg')) {
    if (!msg.member.roles.has('224166766484520960') && !msg.member.roles.has('450337876006404097') && !msg.member.roles.has('244181814212558849')) {
      return msg.delete(1000);
    }

  }
  xpmanager.giveXP(msg.author.id, 'text');
}

exports.commandFiles = commandFiles;
exports.importCommands = importCommands;
exports.reloadCommands = reloadCommands;
exports.handle = handle;
exports.checkMessage = checkMessage;