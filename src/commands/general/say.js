const commands = require('../../commands.js');
const util = require('../../util.js');

module.exports = class SayCommand extends commands.Command{
    constructor() {
        super({
            name: 'say',
            aliases: ['s','sy'],
            category: 'test',
            args:[
                new commands.Argument({
                    optional: false,
                    missingError: 'NECESITAS ENVIAR UN MENSAJE',
                    invalidError: 'El argumento es invalido'
                })
            ],
            priority: 9,
            permLvl: 0
        })
    }

    execute(msg, args){
        util.getSend(msg, args.join(' '));
    }

}