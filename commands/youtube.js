const logger = require('../utils/logger.js');

const yt = {
    color: 0xff0000,
    title: 'YouTube',
    description: 'Für die volle Ladung an Content! \n https://www.youtube.com/devdenis',
    thumbnail: {
        url:  'https://upload.wikimedia.org/wikipedia/commons/4/4c/YouTube_icon.png'
    },
};

module.exports = {
	name: 'youtube',
	description: 'Zeigt meinen YouTube link!',
	usage: '+youtube',
	aliases: ['yt'],
	execute(message, args) {
		var answer = {embed: yt};
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};