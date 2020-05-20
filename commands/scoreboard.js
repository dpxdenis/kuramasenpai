const logger = require('../utils/logger.js');
const xpmanager = require('../utils/xpmanager.js');

module.exports = {
	name: 'scoreboard',
	description: 'Shows scoreboard!',
	args: false,
	usage: '<cmd>',
	guildOnly: true,
	aliases: ['sc'],
	needsPerm: false,
	execute(message, args) {
		var answer = xpmanager.generateScoreboard();
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};