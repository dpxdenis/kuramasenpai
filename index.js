const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandManager = require('./utils/commandmanager.js')
const configJS = require('./utils/config.js');
configJS.generateConfigFile(fs);
const configFile = fs.readFileSync('config.json', {encoding: 'utf8', flag: 'a+'});
const config = JSON.parse(configFile);
const xpManager = require('./utils/xpmanager.js');
const logger = require('./utils/logger.js');
const isDebug = config.debug;
const isCommandListening = config.commandlistening;
const build = 'v0.0.6-beta-build_2';
//Exports
exports.config = config;
exports.isDebug = isDebug;
exports.isCommandListening = isCommandListening;
exports.client = client;
exports.Discord = Discord;

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
    var timer = setInterval(function() {
      xpManager.countdownVoiceXP();
  }, 1000 * 60 * 10);
  //Milliseconds * seconds * minutes
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
  if(!message.content.startsWith(config.prefix) || message.author.bot) return commandManager.checkMessage(message);
  commandManager.handle(message);
})

//XP for Voice!
client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  if(oldUserChannel === undefined && newUserChannel !== undefined) {
      //User joins
      xpManager.onlineUsers.push(newMember.id);
  } else if(newUserChannel === undefined) {
      //User leaves
      if(xpManager.onlineUsers.includes(newMember.id)) {
        xpManager.onlineUsers.splice(xpManager.onlineUsers.indexOf(newMember.id),1)
      }
  }
});
