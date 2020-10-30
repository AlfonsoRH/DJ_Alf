const { Command } = require('../../commands.js');
const util = require('../../util.js');

module.exports = class PingCommand extends Command{
    constructor() {
        super({
            name: 'ping',
            aliases: ['p'],
            category: 'test',
            priority: 9,
            permLvl: 0
        })
    }

    execute(msg){
        util.getSend(msg, 'Pong esta madre FUNCIONA A LA VERGA');
    }

}