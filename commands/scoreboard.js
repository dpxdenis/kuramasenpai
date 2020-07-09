const logger = require('../utils/logger.js');
const xpmanager = require('../utils/xpmanager.js');

module.exports = {
	name: 'scoreboard',
	description: 'Zeigt dir das aktuelle Top 10 Scoreboard!',
	args: false,
	usage: '+scoreboard',
	guildOnly: true,
	aliases: ['sc'],
	needsPerm: false,
	execute(message, args) {
		var answer = xpmanager.generateScoreboard();
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};