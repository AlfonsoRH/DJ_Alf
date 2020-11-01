const express = require('express');
const { BOT_TOKEN, PORT, prefix } = require('./config');
const fs = require('fs');
const app = express();

app.use(express.static('public'))
app.get('/', function(request, response) {
    return response.sendFile(__dirname, +'/views/index.html');
});

const listener = app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${ PORT }`)
});





//BOT
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const util = require('./util.js');
const commands = require('./commands.js');

client.queue = new Map();

client.on('ready',()=>{
    console.log('It\'s Britney Bitch! ');
    client.user.setActivity(config.statusBOT);
    commands.registerCategories(config.categories);
    commands.registerCommands();
});

client.on("message",async (message)=>{
    if(message.author.bot)return;
    let prefix = config.prefix;
    if(!(message.content[0] == prefix) ) return;
    let cmd = message.content.slice(prefix.length);

    if(cmd != undefined){
        cmd = cmd.split(' ');
    }
    let result = await commands.checkValidCmd(message, cmd, prefix);
    if(result){
        commands.executeCmd(message,cmd, Discord, client);
    }
    else util.getSend(message, 'El comando no existe'); 
})



client.login(BOT_TOKEN);