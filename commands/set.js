const logger = require('../utils/logger.js');
const shopManager = require('../utils/shopmanager.js');
const xpManager = require('../utils/xpmanager.js');

module.exports = {
	name: 'set',
	description: 'Sets xp/level/coins for user',
	args: true,
	usage: '+set @user <xp/level/coins> value',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
	execute(message, args) {
        var answer = 'Huch? Du benutzt den Command falsch.';
        if(args.length == 3) {
            var userid = args[0].toString().replace('<@','').toString().replace('>','').replace('!','').toString();
            var type = args[1];
            var value = args[2];
            var user = xpManager.getUserEntry(userid);
            switch(type) {
                case 'xp':
                    answer = 'Set XP for <@' + userid + '>' + ' to ' + value;
                    user.xp = value;
                    break;
                case 'level':
                    answer = 'Set Level for <@' + userid + '>' + ' to ' + value;
                    user.level = value;
                    break;
                case 'coins':
                    answer = 'Set Coins for <@' + userid + '>' + ' to ' + value;
                    user.coins = value;
                    break;
            }
            xpManager.saveFile();
        }

        message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};