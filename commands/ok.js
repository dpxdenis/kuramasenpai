const logger = require('../utils/logger.js');

module.exports = {
	name: 'ok',
	description: 'ok cool',
	args: false,
	usage: '+ok',
	guildOnly: true,
	aliases: ['ko'],
	needsPerm: false,
	execute(message, args) {
		var answer = '<:okcool:410009050185596938>';
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};