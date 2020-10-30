const Discord = require("discord.js");
const config = require("../config.json");
const { saludar, ctm } = require('./commands/commands');
const { youtube } = require('./helpers/helpers');
const client = new Discord.Client();
const prefix = "-";

client.on("message", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'hola':
            saludar(message);
            break;
        case 'ctm':
            ctm(message);
            break            

        default:
            break;
    }
});

youtube("barush");

client.login(config.BOT_TOKEN);
