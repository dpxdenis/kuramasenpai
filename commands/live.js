const logger = require('../utils/logger.js');

module.exports = {
	name: 'live',
	description: 'Postet live ankuendigung! [Admin]',
	args: false,
	usage: '<cmd>',
	guildOnly: true,
	aliases: ['pong'],
    needsPerm: true,
    perm: 'admin',
	execute(message, args) {
		var answer = 'Ich bin live auf twitch schaut rein!';
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};