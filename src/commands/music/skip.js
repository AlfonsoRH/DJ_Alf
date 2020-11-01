const { Command } = require("../../commands");

module.exports = class skipCommand extends Command {
  constructor() {
    super({
      name: "skip",
      aliases: [],
      category: "music",
      priority: 7,
      permLvl: 0,
    });
  }

  async execute(msg, args, discord, client) {
    const queue = client.queue;
    const serverQueue = queue.get(msg.guild.id);

    if (!msg.member.voice.channel)
      return msg.channel.send("No estas conectando en un canal de voz.");
    if (!serverQueue)
      return msg.channel.send('¡No hay canción que saltar!, la cola esta vacía');

    
    await serverQueue.connection.dispatcher.destroy();
    const embed = new discord.MessageEmbed()
     .setDescription(`Now playing: ${serverQueue.songs[1].title} `)
     .setColor('RANDOM')
    return msg.channel.send(embed);
  }
};
