const fs = require('fs');
const Discord = require('discord.js');
const configJS = require('./utils/config.js');
configJS.generateConfigFile(fs);
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandManager = require('./utils/commandmanager.js')
const configFile = fs.readFileSync('config.json', {encoding: 'utf8', flag: 'a+'});
const config = JSON.parse(configFile);
const xpManager = require('./utils/xpmanager.js');
const shopManager = require('./utils/shopmanager.js')
const logger = require('./utils/logger.js');
const isDebug = config.debug;
const isCommandListening = config.commandlistening;
const build = 'v1.0-beta-build_1';

//Exports
exports.config = config;
exports.isDebug = isDebug;
exports.isCommandListening = isCommandListening;
exports.client = client;
exports.Discord = Discord;
exports.fs = fs;
exports.fetchUser = fetchUser;
exports.handleIfUserAccountDelete = handleIfUserAccountDelete;

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
    getAllVoiceUsers();
    var timer = setInterval(function() {
      xpManager.countdownVoiceXP();
    }, 1000 * 60 * 5);
    var shopTimer = setInterval(function() {
      shopManager.checkCountdown();
    }, 1000 * 60 * 1)
    var cooldownXP = setInterval(function() {
      xpManager.countdownCooldown();
    }, 1000);
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
  let newUserChannel;
  let oldUserChannel;
  if(newMember.channel != null) {
    newUserChannel = newMember.channel;
    oldUserChannel = oldMember.channel;  
  }

  var fetchedUser = fetchUser(newMember.id); 
  var onlineUsersList = []

  if(newMember.member.user.bot || oldMember.member.user.bot) return;

  if(oldUserChannel == null && newUserChannel != undefined) {
    //User joins
    xpManager.onlineUsers.push(newMember.id);
    logger.debug(fetchedUser.tag + ' joined Voice!');
    for (let i = 0; i < xpManager.onlineUsers.length; i++) {
      onlineUsersList.push(fetchUser(xpManager.onlineUsers[i]).tag);
    }
    logger.debug('Online: ' + xpManager.onlineUsers.length);
    logger.debug('Users: ' + onlineUsersList)
  } else if(newUserChannel === undefined) {
    //User leaves
    if(xpManager.onlineUsers.includes(newMember.id)) {
      xpManager.onlineUsers.splice(xpManager.onlineUsers.indexOf(newMember.id),1)
      logger.debug(fetchedUser.tag + ' lefted Voice!');
      for (let i = 0; i < xpManager.onlineUsers.length; i++) {
        onlineUsersList.push(fetchUser(xpManager.onlineUsers[i]).tag);
      }
      logger.debug('Online: ' + xpManager.onlineUsers.length);
      logger.debug('Users: ' + onlineUsersList)
    }
  }
});

function getAllVoiceUsers() {
  var voiceChannels = client.channels.cache.filter(c => c.type === 'voice')
  for(const [cID, c] of voiceChannels) {
    for(const [memberID, member] of c.members) {
      var fetchedUser = fetchUser(memberID); 
      if(!fetchedUser.bot) {
        xpManager.startUpAddUsers(fetchedUser.tag, memberID);
      }
    }
  }

}

function fetchUser(id) {
  if(client.users.cache.get(id) == undefined) {
    //handleIfUserAccountDelete(id);
    var sampleUser = {'id': id, 'bot': false, 'username:': 'UserDeleted', 'discriminator': '7777', 'tag': 'UserDeleted#7777', 'avatarURL': client.users.cache.get('536292484838457344').avatarURL}
    return sampleUser;
  } else {
    return client.users.cache.get(id);
  }
}

function handleIfUserAccountDelete(id){
  if(client.users.cache.get(id) == undefined) {
    if(!xpManager.xpFile[id]) {
      return;
    }
    xpManager.xpFile.delete(id);
    logger.debug('Deleted User ' + id + ' from all Files (Account deleted)!');
  }
}

//FIX FOR RANDOM CRASH
client.on('error', (err) => {
  logger.err(err.message);
});
