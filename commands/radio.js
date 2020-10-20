const logger = require('../utils/logger.js');

module.exports = {
	name: 'radio',
	description: 'Zeigt die die sunshine live 90er URL',
	args: false,
	usage: '+radio',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
	execute(message, args) {
		var answer = 'http://sunshinelive.hoerradar.de/sunshinelive-90er-mp3-hq';
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);
	},
};