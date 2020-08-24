const Discord = require('discord.js');
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');

const { prefix, token } = require('./config.json');
const bot = new Discord.Client();

var stats = {};
if (fs.existsSync('stats.json')) {
    stats = jsonfile.readFileSync('stats.json');
}

bot.on('ready', () => {
    console.log('The client is ready!')
})

bot.on('message', (message) => {
    if (message.author.bot)
        return;

    if (message.guild.id in stats === false) {
        stats[message.guild.id] = {};
    }
    
    const guildStats = stats[message.guild.id];
    if (message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }

    const userStats = guildStats[message.author.id];
    if (Date.now() - userStats.last_message > 60000) {
        userStats.xp += random.int(15, 25);
        userStats.last_message = Date.now();

        const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
        if (userStats.xp >= xpToNextLevel) {
            userStats.level++;
            

            userStats.xp = userStats.xp - xpToNextLevel;
            message.channel.send(message.author.username + ' has reached level ' + userStats.level);
        }

        jsonfile.writeFileSync('stats.json', stats);

        console.log(message.author.username + ' now has ' + userStats.xp)
    }

    if (message.content.startsWith(`${prefix}ping`)) {
        message.channel.send('Pong.');
    } else if (message.content.startsWith(`${prefix}level`)) {
        message.channel.send('You are level ' + userStats.level + ' and you have ' + userStats.xp + ' xp! XP needed for next level is '+ ((5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100)-userStats.xp) + '!');
    } else if (message.content === `${prefix}server`) {
	message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    } else if (message.content === `${prefix}verify`) {

        message.member.roles.add("700627348394868758");
        message.channel.send(`You have been verified.`);
    } 

})

bot.login(token);