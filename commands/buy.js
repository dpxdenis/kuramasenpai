const logger = require('../utils/logger.js');
const shopManager = require('../utils/shopmanager.js');
const xpManager = require('../utils/xpmanager.js');

module.exports = {
	name: 'buy',
	description: 'Kauf dir dein Item!',
	args: true,
	usage: '+buy <id>',
	guildOnly: true,
	needsPerm: false,
	execute(message, args) {
        var answer = 'Huch? Du benutzt den Command falsch.';
        var userid = message.author.id;
        if(args.length == 1) {
            if(args[0] > Object.keys(shopManager.getShopItems()).length) {
                answer = 'Dieses Produkt gibt es nicht.'
            } else {
                var item = shopManager.getShopItems()[args[0]];
                if(!shopManager.hasUserItem(userid,item.id)) {
                    if(shopManager.hasUserEnoughMoney(xpManager.getUserEntry(userid).coins, item.cost)) {
                        if(!shopManager.hasUserBoost(userid)) {
                            shopManager.addItemToUser(userid,item);
                            answer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins gekauft!'
                        } else {
                            answer = 'Du kannst maximal einen Booster gleichzeitig aktiviert haben!'
                        }
                    } else {
                        answer = 'Dir fehlt leider die Coins dazu...';
                    }
                } else {
                    answer = 'Du besitzt dieses Item bereits!'
                }
            }
        } else {
        }
        message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};