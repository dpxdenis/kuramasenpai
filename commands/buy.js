const logger = require('../utils/logger.js');
const shopManager = require('../utils/shopmanager.js');
const xpManager = require('../utils/xpmanager.js');
const index = require('../index.js');

module.exports = {
	name: 'buy',
	description: 'Kauf dir dein Item!',
	args: true,
	usage: '+buy <id> / +buy @user <id> / +buy voice <id>',
	guildOnly: true,
	needsPerm: false,
	execute(message, args) {
        var answer = 'Huch? Du benutzt den Command falsch. +buy <id> / +buy @user <id> / +buy voice <id>';
        var userid = message.author.id;
        if(args.length == 1) {
            if(args[0] > (Object.keys(shopManager.getShopItems()).length - 1)) {
                answer = 'Dieses Produkt gibt es nicht.'
            } else {
                var item = shopManager.getShopItems()[args[0]];
                if(!shopManager.hasUserItem(userid,item.id)) {
                    if(shopManager.hasUserEnoughMoney(userid, item.cost)) {
                        if(shopManager.isItemBooster(item)) {
                            if(!shopManager.hasUserBoost(userid)) {
                                shopManager.buy(userid,item.cost);
                                shopManager.addItemToUser(userid,item);
                                answer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins gekauft!'
                            } else {
                                answer = 'Du kannst maximal einen Booster gleichzeitig aktiviert haben!'
                            }
                        } else {
                            shopManager.buy(userid,item.cost);
                            shopManager.addItemToUser(userid,item);
                            answer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins gekauft!'
                        }
                    } else {
                        answer = 'Dir fehlt leider die Coins dazu...';
                    }
                } else {
                    answer = 'Du besitzt dieses Item bereits!'
                }
            }
        } else if (args.length == 2){
            if(args[0].toString().toLowerCase() == 'voice') {
                if(xpManager.onlineUsers.length != 0) {
                    for(var i = 0; i < xpManager.onlineUsers.length; i++) {
                        var loopAnswer = '';
                        var forUser = xpManager.onlineUsers[i];
                        var item = shopManager.getShopItems()[args[1]];
                        if(!shopManager.hasUserItem(forUser,item.id)) {
                            if(shopManager.hasUserEnoughMoney(userid, item.cost)) {
                                if(shopManager.isItemBooster(item)) {
                                    if(!shopManager.hasUserBoost(forUser)) {
                                        shopManager.buy(userid,item.cost);
                                        shopManager.addItemToUser(forUser,item);
                                        loopAnswer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins an <@'+forUser+'> geschenkt!';
                                    } else {
                                        loopAnswer = '<@'+forUser+'> hat bereits einen Booster aktiv!'
                                    }
                                } else {
                                    shopManager.buy(userid,item.cost);
                                    shopManager.addItemToUser(forUser,item);
                                    loopAnswer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins an <@'+forUser+'> geschenkt!';
                                }
                            } else {
                                loopAnswer = 'Dir fehlt leider die Coins dazu...';
                            }
                        } else {
                            loopAnswer = '<@'+forUser+'> besitzt dieses Item bereits!'
                        }
                        message.channel.send(loopAnswer);
                        logger.command(message.author.username, message.toString(), loopAnswer);
                        answer = 'Alle im Voice haben ' + item.name + ' geschenkt bekommen!';
                    }
                } else {
                    answer = 'Keiner ist aktuell im voice online!'
                }
            } else if (args[0].toString().startsWith('<@')){
                var forUser = args[0].toString().replace('<@','').toString().replace('>','').replace('!','').toString();
                if(index.fetchUser(forUser) != undefined) {
                    if(args[1] > (Object.keys(shopManager.getShopItems()).length - 1)) {
                        answer = 'Dieses Produkt gibt es nicht.'
                    } else {
                        var item = shopManager.getShopItems()[args[1]];
                        if(!shopManager.hasUserItem(forUser,item.id)) {
                            if(shopManager.hasUserEnoughMoney(userid, item.cost)) {
                                if(shopManager.isItemBooster(item)) {
                                    if(!shopManager.hasUserBoost(forUser)) {
                                        shopManager.buy(userid,item.cost);
                                        shopManager.addItemToUser(forUser,item);
                                        answer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins an <@'+forUser+'> geschenkt!';
                                    } else {
                                        answer = '<@'+forUser+'> hat bereits einen Booster aktiv!'
                                    }
                                } else {
                                    shopManager.buy(userid,item.cost);
                                    shopManager.addItemToUser(forUser,item);
                                    answer = 'Du hast erfolgreich ' + item.name + ' für ' + item.cost + ' Coins an <@'+forUser+'> geschenkt!';
                                }
                            } else {
                                answer = 'Dir fehlt leider die Coins dazu...';
                            }
                        } else {
                            answer = '<@'+forUser+'> besitzt dieses Item bereits!';
                        }
                    }
                } else {
                    answer = 'Dieser Benutzer existiert nicht!';
                }
            }
        }
        message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};