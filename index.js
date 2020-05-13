//Main Area
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const file = fs.readFileSync('config.json');
const config = JSON.parse(file);
const logger = require('./utils/logger.js');
const isDebug = config.debug;
const isCommandListening = config.commandlistening;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

//Var Area
const build = 'v0.0.4-beta-build_2';

//Exports
exports.config = config;
exports.isDebug = isDebug;
exports.isCommandListening = isCommandListening;

//Code Area
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('|K|u|r|a|m|a|S|e|n|p|a|i|');
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+');
if(config.token != "") {
    client.login(config.token);
    client.once('ready', () => {
        console.log('KuramaSenpai Discord bot started at ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "!");
        console.log('Version: ' + build);
        console.log('Commands: ' + commandFiles.length);
        console.log('Created by DevDenis | TeamDarkPheonix. Copyright 2020')
        console.log('');
        console.log('Type help for help!');
        console.log(' ');
        logger.debug('Debug is activated. All events will be printed!')

        importCommands();

        client.user.setActivity('Made by DevDenis | TeamDarkPheonix', { type: 'STREAMING', url: 'http://twitch.tv/devdenis' });
        
    });
} else {
  console.log('Version: ' + build);
  console.log('Created by DevDenis | TeamDarkPheonix. Copyright 2019')
  console.log('');
  logger.debug('Starting setup! No configuration found!')
  setup();
}

/**
 * Will start the KuramaSenpai Setup and create the config.
 */
function setup(){
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

//CommandSetup
function importCommands(){
    logger.debug('Loading all Commands...')
    for(const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
      logger.debug('Loaded Command: ' + command.name)
    }
    logger.debug('Loaded ' + commandFiles.length + ' Commands!');
}

//Reload all Commands
function reloadCommands(msg){
    //Removing all Commands first
    for(const file of commandFiles) {
      delete require.cache[require.resolve(`./commands/${file}`)]
    }
    //Adds new Commands to live!
    commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    try {
      for(const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
      logger.debug('Reloaded Command: ' + command.name)
      }
      logger.info('Reloaded ' + commandFiles.length + ' Commands!');
      msg.channel.send('Reloaded ' + commandFiles.length + ' Commands!');
    } catch (error) {
      logger.err(error);
      logger.err('Error while reloading all commands!')
    }
}

exports.reloadCommands = reloadCommands;

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

