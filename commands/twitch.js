const logger = require('../utils/logger.js');

const twitch = {
    color: 0xff0000,
    title: 'Twitch',
    description: 'Live rages & unterhaltung pur? hier. \n https://twitch.tv/devdenis',
    thumbnail: {
        url:  'https://brand.twitch.tv/assets/images/black.png'
    },
};

module.exports = {
	name: 'twitch',
	description: 'Zeigt meinen Twitch link!',
	usage: '+twitch',
	aliases: ['ttv'],
	execute(message, args) {
		var answer = {embed: twitch};
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};