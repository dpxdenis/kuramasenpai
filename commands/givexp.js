const logger = require('../utils/logger.js');
const xpmananger = require('../utils/xpmanager.js')
const index = require('../index.js');

var embed = {
    color: 0xff0000,
    title: 'XP-Event',
    author: {
        name: 'KuramaXP',
        icon_url: 'http://devdenis.bplaced.net/sharingan.png'
    },
    thumbnail: {
        url:  index.fetchUser('536292484838457344').avatarURL()
    },
    timestamp: new Date(),
    fields:
    [
    ]
};

module.exports = {
	name: 'givexp',
	description: 'OHOOO FREE XP',
	args: true,
	usage: '+givexp <@user/voice> amount',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
    execute(message, args) {
        var answer = 'Huh? Keine Ahnung was du willst.';
        if(args.length == 2 && Number.isInteger(+args[1])) {
            if (args[0].toString().toLowerCase() == 'voice') {
                for(var i = 0; i < xpmananger.onlineUsers.length; i++) {
                    xpmananger.giveXP(xpmananger.onlineUsers[i], 'xpevent', args[1]);
                }
                answer = 'Alle im Voice channel haben ' + args[1] + ' xp geschenkt bekommen!';
            } else if (args[0].toString().toLowerCase().startsWith('<@')){
                answer = 'Du gönnst ' + args[0] + ' ' + args[1] + ' XP!';
                var id = args[0].toString().replace('<@','').toString().replace('>','').replace('!','').toString();
                xpmananger.giveXP(id, 'xpevent', args[1]);
            } else {
            }
        } else {
        }
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};