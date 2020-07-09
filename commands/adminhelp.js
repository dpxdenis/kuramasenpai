const logger = require('../utils/logger.js');
const index = require('../index.js');
const commandManager = require('../utils/commandmanager.js');

var embed = {
    color: 0xff0000,
    title: 'KuramaSenpai Hilfe',
    description: 'Alle commands hier!',
    fields:
    [
    ],
    thumbnail: {
        url:  index.client.users.get('536292484838457344').avatarURL
    },
    footer: {text: 'Commands Stand von ' + new Date()}
};

module.exports = {
	name: 'adminhelp',
	description: 'Gibt dir AdminHilfe!',
	args: false,
	usage: '+adminhelp',
	guildOnly: false,
	needsPerm: true,
	perm: 'admin',
	execute(message, args) {
        generateAdminHelp();
        var answer = {embed: embed};
		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};

function generateAdminHelp() {
    var cmds = []
    for(cmd of index.client.commands) {
        if(cmd[1].needsPerm) {
            cmds.push(cmd[1]);
        }
    }

    for(var i = 0; i < cmds.length; i++) {
        var cmd = cmds[i];
        var add;
        if(cmd.aliases != null) {
            add = {name: index.config.prefix + '' + cmd.name, value: 'Description: ' + cmd.description + '\n'
            + 'Aliases: ' + cmd.aliases + '\n' + 'Benutzung: ' + cmd.usage};
        } else {
            add = {name: index.config.prefix + '' + cmd.name, value: 'Description: ' + cmd.description + '\n'
            + 'Benutzung: ' + cmd.usage};
        }
        embed.fields.push(add)
    }
}
