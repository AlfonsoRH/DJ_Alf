module.exports = {
    getSend: function(msg,text){
        console.log(text)
        msg.channel.send(text)
    }
}