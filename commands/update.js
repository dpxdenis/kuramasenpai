const logger = require('../utils/logger.js');

module.exports = {
	name: 'update',
	description: 'Update me to the newest version!',
	args: false,
	usage: '+update',
	guildOnly: true,
	aliases: ['pong'],
	needsPerm: true,
	perm: 'admin',
	execute(message, args) {
        var answer = 'Pong. ping. pong. i won. HAH ' + message.author;
        
        message.channel.send('Searching for Update...');
        logger.update('Searching for Update...');
        



		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};