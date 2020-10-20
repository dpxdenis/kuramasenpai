const logger = require('../utils/logger.js');
const index = require('../index.js');
const xpManager = require('../utils/xpmanager.js');
const shopManager = require('../utils/shopmanager.js')
module.exports = {
	name: 'dev',
	description: 'Test command',
	args: false,
	usage: '+dev',
	guildOnly: true,
    needsPerm: true,
    perm: 'admin',
	execute(message, args) {
        /*var fetchedServer = index.client.guilds.get(index.config.serverid);
        var role = fetchedServer.roles.get(index.config.lvl10roleid)
		fetchedServer.members.get('539485040711565323').addRole(role);*/
		/*var users = [];
		var fetchedServer = index.client.guilds.get(index.config.serverid)
		var allUserIDs = Object.keys(xpManager.xpFile);
		allUserIDs.forEach(function(key) {
			users.push(key + ':' + xpManager.xpFile[key].level);
		});

		for(var i = 0; i < users.length; i++) {
			var user = users[i].split(':')[0];
			var level = users[i].split(':')[1];
			var fetchedUser = index.client.users.get(user); 

			if(level >= 10 && level < 30) {
				fetchedServer.members.get(user).addRole(fetchedServer.roles.get(index.config.lvl10roleid))
				message.channel.send(fetchedUser.tag + ' got Rank: ' + fetchedServer.roles.get(index.config.lvl10roleid).name)
			} else if(level >= 30 && level < 50){
				fetchedServer.members.get(user).addRole(fetchedServer.roles.get(index.config.lvl30roleid))
				message.channel.send(fetchedUser.tag + ' got Rank: ' + fetchedServer.roles.get(index.config.lvl30roleid).name)
			} else if (level >= 50) {
				fetchedServer.members.get(user).addRole(fetchedServer.roles.get(index.config.lvl50roleid))
				message.channel.send(fetchedUser.tag + ' got Rank: ' + fetchedServer.roles.get(index.config.lvl50roleid).name)
			} else {

			}
		}*/

		var answer = 'aaa';
		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};