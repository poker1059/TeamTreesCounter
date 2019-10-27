const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const rp = require('request-promise');
const url = 'https://teamtrees.org/';
const $ = require('cheerio');

const bot = new Discord.Client({
    disableEveryone: true
});

bot.on("ready", async () => {
    console.log(`Bot now Online!`);
    setInterval(function () {
        rp(url)
            .then(function (html) {
                result = ($('.counter', html).data());
                var nResult = result.count.toLocaleString();
                bot.user.setActivity(`${nResult} Trees`, {
                    type: "Watching"
                });
            });
    }, 60000)
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;

    if (!message.content.startsWith(prefix)) return;

    //Determine command specified//
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();
    if (cmd === "") {
        return
    }

    if (cmd === "trees") {
        rp(url)
            .then(function (html) {
                result = ($('.counter', html).data());
                let embed = new Discord.RichEmbed()
                    .setTitle(`We Have Planted ${result.count.toLocaleString()} Trees!`)
                    .setThumbnail('https://cdn.discordapp.com/attachments/620829443543531525/637755266657419277/Mr-Beast-TeamTrees-300x300.png')
                    .addField('Plant a Tree for $1', 'https://teamtrees.org')
                    .setColor('#166925')

                message.channel.send(embed);

            }).catch(function (err) {
                //handle error
            });
    }
});

bot.login(botconfig.token);