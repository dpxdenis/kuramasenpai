const logger = require('../utils/logger.js');

module.exports = {
	name: 'youtube',
	description: 'Zeigt meinen YouTube link!',
	aliases: ['yt'],
	execute(message, args) {
		var answer = 'https://youtube.com/devdenis';
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};