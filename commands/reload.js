const logger = require('../utils/logger.js');
const index = require('../index.js')
module.exports = {
	name: 'reload',
	description: 'Reloads all commands [ADMIN].',
	args: false,
	usage: '<cmd>',
	guildOnly: true,
	execute(message, args) {
        if(!message.author.username.toString() === 'devdenis') {
         return logger.warn(message.author.username + ' wanted to reload me :C');   
        }

		var answer = 'Reloading all Commands...';
		message.channel.send(answer);
        logger.command(message.author.username, message, answer);
        index.reloadCommands(message);

	},
};