const logger = require('../utils/logger.js');
const index = require('../index.js');
const commandManager = require('../utils/commandmanager.js');

module.exports = {
	name: 'eco',
	description: 'Shows the eco system from the server',
	args: false,
	usage: '+eco',
	guildOnly: false,
	needsPerm: true,
	perm: 'admin',
	execute(message, args) {
        var answer = 'Not ready';
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};
