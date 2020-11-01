const {
    Command
   } = require('../../commands')
   const config = require('../../config')
   const dotenv = require('dotenv');
   dotenv.config()
   const ytdl = require('ytdl-core');
   const YouTube = require('simple-youtube-api');
const util = require('../../util');
const { Message } = require('discord.js');
   const youtube = new YouTube(process.env.YOUTUBE_KEY);
   
   module.exports = class playCommand extends Command {
    constructor() {
     super({
      name: 'play',
      aliases: [],
      category: 'music',
      priority: 7,
      permLvl: 0
     })
    }
    async execute(msg, args, discord, client) {
     const queue = client.queue;
     let guild = msg.guild;
   
     const voiceChannel = msg.member.voice.channel;
   
     if(!voiceChannel) return msg.channel.send('Debes estar conectado a un canal de voz.');
     
     async function play(guild, song) {
      const serverQueue = await queue.get(guild.id);
   
      if(!song) {
       await serverQueue.voiceChannel.leave();
       await queue.delete(guild.id);
       return;
      }
   
      const stream = ytdl(song.url, {
       filter: 'audioonly',
       highWaterMark: 1 << 25
      })
      
      const dispatcher = await serverQueue.connection.play(stream)
       .on('finish', async () => {
        serverQueue.songs.shift();
   
        await play(guild, serverQueue.songs[0])
   
       })
       .on('error', (error) => console.log(error));
   
       dispatcher.setVolume(serverQueue.volume)

      


       const embed = new discord.MessageEmbed()
     .setDescription(`Now playing: ${song.title} `)
     .setColor('RANDOM')
   
     msg.channel.send(embed);
     

     
     
       
      
       
   
     }
     async function handleVideo(video, playlist) {
      const serverQueue = await queue.get(guild.id);
      const song = {
       title: video.title,
       id: video.id,
       url: `https://www.youtube.com/watch?v=${video.id}`
      }
   
      if (serverQueue) {
       // Que ya existe dispatcher Reproduciendo
       await serverQueue.songs.push(song)
       if(playlist) return;
   
      } else {
       // No existe
       const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel,
        connection: null,
        songs:[],
        playing: true,
        volume: 1
       }
   
       try {
        await queue.set(guild.id, queueConstruct)
        await queueConstruct.songs.push(song)
   
        const connection = await voiceChannel.join()
        queueConstruct.connection = connection;
   
        await play(guild, queueConstruct.songs[0])
       } catch (error) {
        msg.channel.send('Hubo un error de reproducción.')
       }
       
   
      }
   
     }
   
     if(!args[0]) return msg.channel.send('Debes agregar un enlace de youtube.')
     let video;
   
     
     if (ytdl.validateURL(args[0])) {
      video = await youtube.getVideo(args[0])
      
     } else {
      /**
       * Cuando el argumento es un 
       * string, se separa en una lista para
       * ejecutar la busqueda.
       * [0]wet [1]ass [2]pussy
       * wet ass pussy
       */
      let song = args.join(' ');
      
      // risitas altas
      try {
       let videos = await youtube.searchVideos(song, 1)
   
       if (!videos.length) return msg.channel.send('No se encontraron resultados de busqueda, pruebe enviando el enlace de Youtube');
       
   
       video = await youtube.getVideoByID(videos[0].id)
       

      } catch (error) {
       console.error(error)
       return msg.channel.send('Hubo un error en la busqueda de resultados.')
   
      }
      
      
     }
      
     handleVideo(video, false);
    }
   }