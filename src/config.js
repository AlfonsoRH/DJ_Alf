const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    prefix: '-',
    statusBOT: "Holis Bolis",
    BOT_TOKEN: process.env.BOT_TOKEN,
    root: [''],
    PORT: process.env.PORT,
    categories: [
        { name: 'test', priority: 5 }, 
        { name: 'general', priority: 8 }
    ],
    ranks: [
        { name: 'User', permLevel: 0 },
        { name: "Member", permLevel: 1 },
        { name: "Mod", permLevel: 2 },
        { name: "Admin", permLevel: 3 }
    ]
};