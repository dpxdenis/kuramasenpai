const logger = require('../utils/logger.js');

const twitter = {
    color: 0xff0000,
    title: 'Twitter',
    description: 'Diese gut für schreiben text. \n https://www.twitter.com/devdenisYT',
    thumbnail: {
        url:  'https://upload.wikimedia.org/wikipedia/de/thumb/9/9f/Twitter_bird_logo_2012.svg/944px-Twitter_bird_logo_2012.svg.png'
    },
};

module.exports = {
	name: 'twitter',
	description: 'Zeigt meinen Twitter link!',
	usage: '+twitter',
	aliases: ['tw'],
	execute(message, args) {
		var answer = {embed: twitter};
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};