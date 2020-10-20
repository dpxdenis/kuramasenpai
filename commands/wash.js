const logger = require('../utils/logger.js');
var shopManager = require('../utils/shopmanager.js');
module.exports = {
	name: 'wash',
	description: 'Wasche jemanden fuer 100 Coins!',
	args: false,
	usage: '+wash',
	guildOnly: true,
	aliases: ['waschen','duschen'],
	needsPerm: false,
	execute(message, args) {
        var answer = '';
        var randomUser = message.guild.members.cache.random();
        if(shopManager.hasUserEnoughMoney(message.author.id, 100)) {
            shopManager.buy(message.author.id, 100);
            answer = 'Du hast <@' + randomUser.id + '> gewaschen! YEY ES RIEHT NACH SEIFE!';
        } else {
            answer = 'Du hast nicht genügend Coins um <@' + randomUser.id + '> zu waschen :o Er/Sie/Es wird für immer stinken.... :c';
        }

		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};