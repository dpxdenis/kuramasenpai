const logger = require('../utils/logger.js');

module.exports = {
	name: 'socialmedia',
	description: 'Zeigt euch meine Links!',
	args: false,
	usage: '<cmd> <all/instagram/youtube/twitch/twitter/yt/insta>',
	guildOnly: false,
	aliases: ['social'],
	needsPerm: false,
	execute(message, args) {
        var answer = 'Das was du suchst exisitert nicht.';
        const social = args[0].toString().toLowerCase();
        if(args.length == 1) {
            switch(social) {
                case 'all':
                    answer = 'Here all';
                    break;
                case 'insta':
                case 'instagram':
                    answer = 'Here my instagram';
                    break;
                case 'yt':
                case 'youtube':
                    answer = 'Here my yt';
                    break;
                case 'twitch':
                    answer = 'Here my twitch';
                    break;
                case 'twitter':
                    answer = 'Here my twitter';
                    break;
            }
        }

        message.channel.send(answer);
        logger.command(message.author.username, message, answer);
	},
};