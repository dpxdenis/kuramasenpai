const logger = require('../utils/logger.js');

module.exports = {
	name: 'ping',
	description: 'Pong! I luv thissss.',
	args: false,
	usage: 'Only ping lol.',
	guildOnly: true,
	aliases: ['pong'],
	needsPerm: false,
	execute(message, args) {
		var answer = 'Pong. ping. pong. i won. HAH ' + message.author;
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};