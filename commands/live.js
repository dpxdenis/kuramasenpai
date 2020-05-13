const logger = require('../utils/logger.js');

const live = {
    color: 0xff0000,
    title: 'ICH BIN LIVE BJLAAAA',
	description: 'Komm diese sonst... äääh kein Semetschki! >:C',
	fields:
	[
		{name: 'LIVELIVELIVELIVE', value: 'https://twitch.tv/devdenis'}

	],
    thumbnail: {
        url:  'https://yt3.ggpht.com/a-/AOh14GhlAVoPOY0nV1KykBmoYKhg7i9ZrODzCQ5yWROEPw=s100-c-k-c0xffffffff-no-rj-mo'
    },
};

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
		message.channel.send('@everyone' + ' LIVE!!!!!');
		var answer = {embed: live};
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};