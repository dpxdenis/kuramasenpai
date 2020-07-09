const logger = require('../utils/logger.js');
const index = require('../index.js');
const shopManager = require('../utils/shopmanager.js')

const embed = {
    color: 0xff0000,
    title: 'Shop',
    description: 'Hier die aktuellen Angeböte bjlaaad!',
    fields:
    [
    ],
    thumbnail: {
        url:  index.client.users.get('536292484838457344').avatarURL
    },
    footer: {text: new Date()}
};

module.exports = {
	name: 'shop',
	description: 'Zeigt dir den aktuellen Shop an',
	args: false,
	usage: '+shop',
	guildOnly: true,
	needsPerm: false,
	execute(message, args) {
        var answer = {embed: embed};
        generateShop();
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};

function generateShop() {
    var items = [];
    var allItems = Object.keys(shopManager.getShopItems());
    allItems.forEach(function(key) {
        if(shopManager.getShopItems()[key].duration != null) {
            items.push(key + ':' + shopManager.getShopItems()[key].name + ':' + shopManager.getShopItems()[key].type
             + ':' + shopManager.getShopItems()[key].cost + ':' + shopManager.getShopItems()[key].duration);
        } else {
            items.push(key + ':' + shopManager.getShopItems()[key].name + ':' + shopManager.getShopItems()[key].type
            + ':' + shopManager.getShopItems()[key].cost);
        }
    });

    for(var i = 0; i < items.length; i++) {
        var split = items[i].toString().split(':');

        var n = '('+ split[0] + ')' + ' ' + split[1];
        var v = 'Kosten: ' + split[3] + ' Coins'
        embed.fields.push({name: n, value: v});
    }
    embed.fields.push({name: '-----------------', value: '-----------------'})
    embed.fields.push({name: 'Wie kaufst du ein?', value: '+buy <id>'})
    embed.fields.push({name: 'Wie siehst du welche Items du hast und wie lange sie noch halten?', value: '+stats'})
}