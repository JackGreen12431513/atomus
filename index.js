const discord = require('discord.js');
require('dotenv').config();
var client = new discord.Client();
require('./AtomusTools/eventLoader.js')(client);
const fs = require('fs');
var cs = JSON.parse(fs.readFileSync('./Data/commandsSent.json', 'utf8'))
const config = JSON.parse(fs.readFileSync('./AtomusTools/AtomusConfig.json', 'utf8'))

const prefix = "---";

const admin = config.AtomusADMIN_Role;
const mod = config.AtomusMOD_Role;
const owner1 = config.AtomusOwnerID;
const owner2 = config.AtomusOwnerID2;

client.login(process.env.atomusTK);

client.on('message', message => {
    if(!message.content.startsWith(prefix)||message.author.equals(client.user)||message.author.bot) return;
    var args = message.content.substring(prefix.length).split(" ");

    if(!cs[client.user.id]) cs[client.user.id] = {
        commands: 0
    }
    cs[client.user.id].commands += 1;
    fs.writeFileSync('./Data/commandsSent.json', JSON.stringify(cs))

    switch(args[0].toLowerCase()) {

        case "help":
        if(args[1] == null) {
            var emb = new discord.RichEmbed()
            .setAuthor("Atomus Command", client.user.avatarURL)
            .addField("General:", "`stats, ginfo`", true)
            .addField("Moderation:", "``", true)
            message.channel.send(emb);
        }
        break;

        case "ginfo":
        var emb = new discord.RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("General:", `Members: \`${message.guild.members.size}\`\nRoles: \`${message.guild.roles.size}\``, true)
        message.channel.send(emb);
        break;

        case "stats":
        var emb = new discord.RichEmbed()
        .setAuthor("Atomus Command", client.user.avatarURL)
        .addField("General:", `Members: \`${client.users.size}\`\nGuilds: \`${client.guilds.size}\`\nTotal Commands: \`${cs[client.user.id].commands}\``, true)
        .addField("Statistics:", `Ping: \`${Math.floor(client.ping)}ms\`\nUptime: \`${millisToMinutesAndSeconds(client.uptime)}s\``, true)
        message.channel.send(emb);
        break;

        case "purge":
        var delQty = message.content.replace(prefix + "purge", "").replace(" ", "")
        if(message.member.roles.find("name", admin) || message.member.roles.find("name", mod)) {
            message.channel.bulkDelete(delQty)
            .then(() => {
                message.author.send(`**${delQty}** messages deleted in **${message.guild.name}**`).then(msg => {
                    msg.delete(3000);
                })
            })

        } else {
            message.channel.send(`Sorry, ${message.author}, you can not purge!`).then(msg => {
                msg.delete(3000);
            })
        }
        break;
    }
})

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
