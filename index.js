//Main Area
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const file = fs.readFileSync('config.json');
const config = JSON.parse(file);
const logger = require('./utils/logger.js');
const isDebug = config.debug;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

//Var Area
const build = 'v0.0.2-alpha-05_02_2020';

//Exports
exports.config = config;
exports.isDebug = isDebug;


//Code Area
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('|K|u|r|a|m|a|S|e|n|p|a|i|');
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+');
if(config.token != "") {
    client.login(config.token);
    client.once('ready', () => {
        console.log('KuramaSenpai Discord bot started at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "!");
        console.log('Version: ' + build);
        //console.log('Commands: ' + Object.keys(commandManager.cmdlist).length);
        console.log('Created by DevDenis | TeamDarkPheonix. Copyright 2020')
        console.log('');
        console.log('Type help for help!');
        console.log(' ');
        if(isDebug) {
            console.log('Debug is activated. All events will be printed!');
        }
        client.user.setActivity('Made by DevDenis | TeamDarkPheonix', { type: 'STREAMING', url: 'http://twitch.tv/devdenis' });
        
    });
} else {
  console.log('Version: ' + build);
  console.log('Created by DevDenis | TeamDarkPheonix. Copyright 2019')
  console.log('');
  logger.debug('Starting setup! No configuration found!')
  setup();
}

function setup(){
    console.log('Welcome to the setup for KuramaSenpai!');
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
              readline.close()
              fs.writeFileSync('config.json', JSON.stringify(config));
              console.log('')
              console.log('Setup is completed please restart KuramaSenpai to get started!');
              logger.debug('Setup configuration: ' + JSON.stringify(config));
            })
          })
        })
      })






}

