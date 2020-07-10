const logger = require('../utils/logger.js');
const config = require('../utils/config.js')
module.exports = {
	name: 'updateshop',
	description: 'Updates the shop',
	args: false,
	usage: '+updateshop',
	guildOnly: true,
    needsPerm: true,
    perm:'admin',
	execute(message, args) {
        var answer = 'Updated shop!';
        config.updateShopFile();
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};