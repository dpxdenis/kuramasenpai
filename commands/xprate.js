const logger = require('../utils/logger.js');
const index = require('../index.js')
const embed = {
    color: 0xff0000,
    title: 'XP-System Rates',
    description: 'Du sehen diese Rates hier!',
    fields:
    [
        {name: 'XP (Text)', value: Math.round((parseInt(index.config.xprate_text) / 3)) + ' - ' + index.config.xprate_text},
        {name: 'Coins (Text)', value: Math.round((parseInt(index.config.coinrate_text) / 3)) + ' - ' + index.config.coinrate_text},
        {name: 'XP (Voice)', value: Math.round((parseInt(index.config.xprate_voice) / 3)) + ' - ' + index.config.xprate_voice},
        {name: 'Coins (Voice)', value: Math.round((parseInt(index.config.coinrate_voice) / 3)) + ' - ' + index.config.coinrate_voice}
    ],
    thumbnail: {
        url:  index.fetchUser('536292484838457344').avatarURL()
    },
    footer: {text: 'XP-Rate Stand von ' + new Date()}
};

module.exports = {
	name: 'rates',
	description: 'Zeigt dir die aktuellen XP/Coins Rates an!',
	args: false,
	usage: '+rates',
	guildOnly: true,
	aliases: ['rate', 'xprate', 'coinrate'],
	needsPerm: false,
	execute(message, args) {
		var answer = {embed: embed};
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};