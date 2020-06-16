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
        url:  index.client.users.get('536292484838457344').avatarURL
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
	usage: '<cmd> <user/all/voice> <amount>',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
    execute(message, args) {
        var answer = 'Pong. ping. pong. i won. HAH ';
        if(args.length == 2 && Number.isInteger(+args[1])) {
            if(args[0].toString().toLowerCase() == 'all'){
                answer = 'ALL';
            } else if (args[0].toString().toLowerCase() == 'voice') {
                for(var i = 0; i < xpmananger.onlineUsers.length; i++) {
                    xpmananger.giveXP(xpmananger.onlineUsers[i], 'voice', args[1]);
                }
                answer = 'Alle im Voice channel haben ' + args[1] + ' xp geschenkt bekommen!';
            } else {
                answer = 'NOT VOICE & NOT ALL';
            }
        } else {
            answer = 'args else < 2' + 'LENG: ' + args.length + ' IS:' + Number.isInteger(args[1]);
        }
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};