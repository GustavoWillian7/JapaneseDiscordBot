const { Client, GatewayIntentBits } = require('discord.js');
const connectDB = require('./db/conn');
const characterController = require('./controllers/characterController');

require('dotenv').config({ path: '.env' });
const TOKEN = process.env.bot_token;

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

connectDB();

client.once('ready', () => {
    console.log('Japanese study bot está pronto!');
});

client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '!hiragana') {
        await characterController.quiz(message, 'hiragana');
    } else if (command === '!katakana') {
        await characterController.quiz(message, 'katakana');
    }
});

client.login(TOKEN);
