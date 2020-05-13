//Main Area
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandManager = require('./utils/commandmanager.js')
const configJS = require('./utils/config.js');
configJS.generateConfigFile(fs);
const file = fs.readFileSync('config.json', {encoding: 'utf8', flag: 'a+'});
const config = JSON.parse(file);
const logger = require('./utils/logger.js');
const isDebug = config.debug;
const isCommandListening = config.commandlistening;

//Var Area
const build = 'v0.0.4-beta-build_3';

//Exports
exports.config = config;
exports.isDebug = isDebug;
exports.isCommandListening = isCommandListening;
exports.client = client;

//Code Area
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('|K|u|r|a|m|a|S|e|n|p|a|i|');
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+');
if(config.token != undefined) {
    client.login(config.token);
    client.once('ready', () => {
        logger.debug('Debug is activated. All events will be printed!')
        commandManager.importCommands();
        console.log('KuramaSenpai Discord bot started at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "!");
        console.log('Version: ' + build);
        console.log('Commands: ' + commandManager.commandFiles.length);
        console.log('Created by DevDenis | TeamDarkPheonix. Copyright 2020')
        console.log('');
        console.log('Type help for help!');
        console.log(' ');


        client.user.setActivity('Made by DevDenis | TeamDarkPheonix', { type: 'STREAMING', url: 'http://twitch.tv/devdenis' });
        
    });
} else {
  console.log('Version: ' + build);
  console.log('Created by DevDenis | TeamDarkPheonix. Copyright 2019')
  console.log('');
  logger.debug('Starting setup! No configuration found!')
  configJS.setup(config, logger, fs);
}

//Command Handling
client.on('message', message => {
  //Prevent that bots can execute commands and KuramaSenpai ignoring message without the prefix.
  if(!message.content.startsWith(config.prefix) || message.author.bot) return checkMessage(message);

  //Do write tha reply faster then fast.
  const reply = function(answer) {
    message.channel.send(answer);
  }

  //Some consts.
  const user = message.author;
  const args = message.content.toLowerCase().slice(config.prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  //AntiExecuteNotFoundedCommandsWHYDONTUUSETHEHELP!!!
  if(!command) return logger.command('User: ' + user.username + ' || Command: ' + commandName + ' not found!');

  try {
      //Permissons auf lockerer Basis
      if(command.needsPerm) {
        if(command.perm.toLowerCase() == 'admin' && !(message.member.roles.has(config.adminroleid))) {
          message.delete(1000);
          return logger.command(user.username, commandName, 'No Permissions');
        } else if (command.perm.toLowerCase() == 'mod' && !(message.member.roles.has(config.modroleid))) {
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
})

//AntiShittyAdProtectorV999
function checkMessage(msg){
  if(msg.content.toLowerCase().includes('discord.gg')) {
    if (!msg.member.roles.has('224166766484520960') && !msg.member.roles.has('450337876006404097') && !msg.member.roles.has('244181814212558849')) {
      msg.delete(1000);
    }

  }
}

