const fs = require('fs');
const util = require('./util');
const config = require('./config');
const {type} = require('os');

class Command {
    constructor(commandInfo) {
        this.name = commandInfo.name;
        this.args = commandInfo.args;
        this.category = commandInfo.category;
        this.aliases = commandInfo.aliases;
        this.permLvl = commandInfo.permLvl;
        this.priority = commandInfo.priority;
    }

    checkArgs(msg, msgArgs) {
        var valid = true
        console.log(`MENSAJE: ${msg}`);
        console.log(`ARGS: ${msgArgs}`);

        if (this.args != undefined) {
            if (msgArgs.length == 0 && this.args.find(x => !x.optional) != undefined) {
                util.getSend(msg, 'Requiere un argumento');
                return false;
            }
            let argsPos = 0
            for (let cmdArg of this.args) {

                if (cmdArg[argsPos] != undefined) {
                    if (!cmdArg.optional) {
                        util.getSend(msg, cmdArg.missingError);
                        break;
                    }
                } else {
                    //Verificar si es válido
                    if (!cmdArg.checkArg(msg, msgArgs[argsPos])) {
                        if (!cmdArg.optional || cmdArg.failOnInvalid) {
                            //enviar un mensaje de error
                            util.getSend(msg, cmdArg.invalidError);

                            valid = false;
                            break;
                        }
                    } else {
                        if (cmdArg.breakOnValid) {
                            break;
                        }
                        //Incremento para nuevo argumento de mensaje
                        argsPos++;
                    }
                }
            }
        }
        return valid;
    }

}

class Argument {
    constructor(argInfo) {
        this.optional = argInfo.optional;
        this.type = argInfo.type;
        this.interactiveMsg = argInfo.interactiveMsg;
        this.possibleValues = argInfo.possibleValues;

        // Cuando el comando require un argumento
        this.missingError = argInfo.missingError;

        //Argumento invalido
        this.invalidError = argInfo.invalidError;
    }

    checkArg(msg, msgArg) {
        let valid = true;
        switch (this.type) {
            case 'mention':
                let mention = msgArg.match(/<@!?(.*?[0-9])>/);
                if (mention == null || !msg.guild.members.has(mention[1])) {
                    valid = false;
                }
                break;



            case 'int':
                if (!Number(msgArg)) {
                    valid = false;
                }

                case 'channel':
                    let channel = msgArg.match(/<#(.*?)>/);
                    if (channel == null || !msg.guild.channels.has(channel[1])) {
                        valid = false;
                    }
                    break;

                default:
                    break;
        }

        return valid;
    }

}

class Category {
    constructor(categoryInfo) {
        this.name = categoryInfo.name;
        this.priority = categoryInfo.priority;
        this.commands = new Map();
    }

    addCommand(command) {
        this.commands.set(command.name, command);
    }
}

module.exports = {
    Command: Command,
    Argument: Argument,
    Category: Category,
    namesAliases: [],
    categories: new Map(),
    commands: new Map(),
    registerCategories: function (categories) {
        for (category of categories) {
            var category = new Category(category)
            this.categories.set(category.name, category)
        }

    },

    loadFile: function (path) {
        return require(path);
    },

    registerCommands: function () {
        var cmds = fs.readdirSync(`${__dirname}/commands/`);
        for (let module of cmds) {
            let files = fs.readdirSync(`${__dirname}/commands/${module}`);
            for (let file of files) {
                if (fs.statSync(`${__dirname}/commands/${module}/${file}`).isFile()) {
                    let keys = this.loadFile(`${__dirname}/commands/${module}/${file}`);

                    if (typeof keys != 'object') {
                        keys = {
                            keys
                        }
                    }

                    for (let key in keys) {
                        let command = new keys[key]();

                        if (!this.categories.has(module)) {
                            this.categories([module]);
                        }

                        this.commands.set(command.name, command);
                        this.namesAliases.push(command.name, ...command.aliases);

                        this.categories.get(module).addCommand(command);
                    }

                }
            }
        }
    },

    checkPerms: async function (msg, permLvl) {
        //Comprobar permisos de usuario

        for (let i = 0; i < config.root.length; i++) {
            if (msg.author.id === config.root[i]) {
                return true;
            }
        }


        let perms = msg.member.permissions;
        if (perms.has('ADMINISTRATOR')) {
            return true;
        }
        let userPermsLvl = 1;
        if (userPermsLvl >= permLvl) {
            return true;
        }
        util.getSend(msg, 'No tienes rango suficiente para usar este comando :(')
        return false;

    },

    getCmd: function (arg) {
        var command = this.commands.get(arg);

        if (!command) {
            this.commands.forEach(aCmd => {
                if (aCmd.aliases.includes(arg)) {
                    command = aCmd;
                    return;
                }
            });
        }
        return command;

    },
    checkValidCmd: async function (msg, args, prefix) {
        var command = this.getCmd(args[0]);

        if (msg.content.startsWith(prefix) && command != null) {
            let result = this.checkPerms(msg, command.permLvl);

            if (result) {
                return true;
            }

        }

        return false;

    },


    executeCmd: async function (msg, args, discord, client) {
        
        let cmd = this.getCmd(args[0]);
        if ( cmd.checkArgs(msg, args.slice(1))  ) {
            await cmd.execute(msg, args.slice(1), discord, client)
        }
    }

}