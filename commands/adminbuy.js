const logger = require('../utils/logger.js');
const shopManager = require('../utils/shopmanager.js');
const xpManager = require('../utils/xpmanager.js');

const adminItems = [{"id":777,"name":"XP-Boost x10 (10 Minuten)","type":"xp","multiplier":10,"cost":1,"duration":10},
                    {"id":7777,"name":"Coin-Boost x50 (1 Stunde)","type":"coin","multiplier":50,"cost":1,"duration":60},
                    {"id":187,"name":"All-Boost x10 (10 Minuten)","type":"all","multiplier":10,"cost":1,"duration":10}]

module.exports = {
	name: 'adminbuy',
	description: 'Kauf dir dein Item yo!',
	args: true,
	usage: '+adminbuy <id>',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
	execute(message, args) {
        var answer = 'Huch? Du benutzt den Command falsch.';
        var userid = message.author.id;
        if(args.length == 1) {
            if(args[0] != 777 && args[0] != 7777 && args[0] != 187) {
                answer = 'Dieses Produkt gibt es nicht.'
            } else {
                var item = getAdminItem(args[0]);
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

function getAdminItem(id) {
    for(var i = 0; i < adminItems.length; i++) {
        if(adminItems[i].id == id) {
            return adminItems[i];
        }
    }
    return null;
}