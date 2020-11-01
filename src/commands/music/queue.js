const { Command } = require("../../commands");

module.exports = class skipCommand extends Command {
    constructor() {
        super({
          name: "playlist",
          aliases: [],
          category: "music",
          priority: 7,
          permLvl: 0,
        });
      }
    async execute(msg, args, discord, client) {
        const queue = client.queue;
        const serverQueue = queue.get(msg.guild.id);

        if(!serverQueue) return msg.channel.send('**🚧 ¡No hay canción que mostrar!, la playlist está vacia. 🚧**');
        let i;

        let list = serverQueue.songs.slice(1).map((m) => {
            if(i > 16) return // Lista solo 15 canciones
            i++;
            return `[${i}] - 🎵 ${m.title}  ` 
                
           }).join('\n');
        
        let hr = "---------------------------------------------";
        let time = Math.trunc(serverQueue.connection.dispatcher.streamTime / 1000);

        let playName = `${hr}\n🔊 Ahora: ${serverQueue.songs[0].title}\n🕐 Tiempo: ${time} segundos.\n ${hr}`;
        let countSong = `\n${hr}\n📒 Lista ${ serverQueue.songs.length }/15 canciones.`

        msg.channel.send('```xl\n[LISTA DE CANCIONES PARA: '+msg.guild.name.toUpperCase()+']\n'+playName+'\n\n'+ list +'\n'+countSong+'\n```')

    }
}