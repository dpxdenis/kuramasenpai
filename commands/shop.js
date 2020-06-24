const logger = require('../utils/logger.js');
const index = require('../index.js');

const shop = {
    color: 0xff0000,
    title: 'Shop',
    description: 'Hier die aktuellen Angeböte bjlaaad!',
    fields:
    [
        {name: '(0) XP-Boost x2 (1 Stunde)', value: '- Coins'},
        {name: '(1) XP-Boost x2 (10 Stunden)', value: '- Coins'},
        {name: '(2) Coin-Boost x2 (1 Stunde)', value: '- Coins'},
        {name: '(3) Coin-Boost x2 (10 Stunden)', value: '- Coins'},
        {name: '(4) All-Boost x2 (1 Stunde)', value: '- Coins'},
        {name: '(5) All-Boost x2 (10 Stunden)', value: '- Coins'},
        {name: '(6)Richboooi rank', value: '1337777 Coins'},
        {name: 'Wie kaufst du ein?', value: 'Schreibe: +buy <id>'},
        {name: 'SHOP AKTUELL DEAKTIVIERT', value: 'Shop noch nicht verfuegbar!'}
    ],
    thumbnail: {
        url:  index.client.users.get('536292484838457344').avatarURL
    },
    footer: {text: 'Shopshopshopshop'}
};

module.exports = {
	name: 'shop',
	description: 'Pong! I luv thissss.',
	args: false,
	usage: 'Zeigt dir den aktuellen Shop an',
	guildOnly: true,
	needsPerm: false,
	execute(message, args) {
		var answer = {embed: shop};
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};