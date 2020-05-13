const logger = require('../utils/logger.js');

module.exports = {
	name: 'twitch',
	description: 'Zeigt meinen Twitch link!',
	aliases: ['tw'],
	execute(message, args) {
		var answer = 'https://twitch.tv/devdenis';
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};