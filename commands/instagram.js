const logger = require('../utils/logger.js');

const insta = {
    color: 0xff0000,
    title: 'Instagram',
    description: 'Slide in ma DM´s :^) \n https://www.instagram.com/devdenis',
    thumbnail: {
        url:  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/CIS-A2K_Instagram_Icon_%28Black%29.svg/1200px-CIS-A2K_Instagram_Icon_%28Black%29.svg.png'
    },
};

module.exports = {
	name: 'instagram',
	description: 'Zeigt meinen Instagram link!',
	aliases: ['insta'],
	execute(message, args) {
		var answer = {embed: insta};
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};