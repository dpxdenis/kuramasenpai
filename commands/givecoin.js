const logger = require('../utils/logger.js');
const xpmananger = require('../utils/xpmanager.js')
const index = require('../index.js');

module.exports = {
	name: 'givecoin',
	description: 'OHOOO FREE COINS',
	args: true,
	usage: '+givecoin <@user/voice> amount',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
    execute(message, args) {
        var answer = 'Huh? Keine Ahnung was du willst.';
        if(args.length == 2 && Number.isInteger(+args[1])) {
            if (args[0].toString().toLowerCase() == 'voice') {
                for(var i = 0; i < xpmananger.onlineUsers.length; i++) {
                    xpmananger.giveXP(xpmananger.onlineUsers[i], 'coinevent', args[1]);
                }
                answer = 'Alle im Voice channel haben ' + args[1] + ' Coins geschenkt bekommen!';
            } else if (args[0].toString().toLowerCase().startsWith('<@')){
                answer = 'Du gönnst ' + args[0] + ' ' + args[1] + ' Coins!';
                var id = args[0].toString().replace('<@','').toString().replace('>','').replace('!','').toString();
                xpmananger.giveXP(id, 'coinevent', args[1]);
            } else {
            }
        } else {
        }
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};