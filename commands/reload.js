const logger = require('../utils/logger.js');
const commandManager = require('../utils/commandmanager.js')
module.exports = {
	name: 'reload',
	description: 'Reloads all commands [ADMIN].',
	args: false,
	usage: '+reload',
	guildOnly: true,
	aliases: ['rl'],
	needsPerm: true,
	perm: 'admin',
	execute(message, args) {
        if(!message.author.username.toString() === 'devdenis') {
         return logger.warn(message.author.username + ' wanted to reload me :C');   
        }

		var answer = 'Reloading all Commands...';
		message.channel.send(answer);
        logger.command(message.author.username, message.toString(), answer);
        commandManager.reloadCommands(message);

	},
};