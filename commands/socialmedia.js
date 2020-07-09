const logger = require('../utils/logger.js');

const allEmbed = {
    color: 0xff0000,
    title: 'SocialMedia',
    description: 'Alle meine SocialMedia Links!',
    fields:
    [
        {name: 'YouTube:', value: 'https://www.youtube.com/devdenis \n Für die volle Ladung an Content!'},
        {name: 'Twitch:', value: 'https://twitch.tv/devdenis \n Live rages & unterhaltung pur? hier.'},
        {name: 'Instagram:', value: 'https://www.instagram.com/devdenis \n Slide in ma dm´s :^)'},
        {name: 'Twitter:', value: 'https://www.twitter.com/devdenisYT \n Diese gut für schreiben text.'}
    ],
    thumbnail: {
        url:  'https://yt3.ggpht.com/a-/AOh14GhlAVoPOY0nV1KykBmoYKhg7i9ZrODzCQ5yWROEPw=s100-c-k-c0xffffffff-no-rj-mo'
    },
    footer: {text: 'Folgt rein bjlaaaaad! Dann seit ihr 1 Semetschki!'}
};

module.exports = {
	name: 'socialmedia',
	description: 'Zeigt euch alle meine Links!',
	args: false,
	usage: '+socialmedia',
	guildOnly: false,
	aliases: ['social'],
	needsPerm: false,
	execute(message, args) {
        var answer = {embed: allEmbed};
        message.channel.send(answer);
        logger.command(message.author.username, message, answer);
	},
};