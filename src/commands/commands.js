
const saludar = (message) => {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Hola! mandar este mensaje me tomó ${timeTaken}ms.`);
};

const ctm = (message) => {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`La tuya en vinagre :D`);
};


exports.saludar = saludar;
exports.ctm = ctm;