const { Client, TextChannel, Constants, MessageEmbed } = require("discord.js");

const client = new Client({partials: Object.keys(Constants.PartialTypes)});

client.on("ready", () => console.log("start"));

client.on("message", (message) => {
    const id = message.channel.client.user.id;
    if (message.mentions.users.some(user => user.id === id)) {
        message.channel.send([
            "--- global-bookmarks help ---",
            "Make #bookmarks channel first, then you can bookmark and unbookmark any messages by emoji actions.",
            "* React any messages with :bookmark:! I will create bookmark to #bookmarks channel!",
            "* React my messages (include bookmarks) with :x:. I will delete those messages.",
        ].join("\n"));
    }
});

client.on("messageReactionAdd", async (messageReaction) => {
    const message = messageReaction.message;
    if (messageReaction.emoji.name === "🔖" && messageReaction.count === 1) {
        const channel = message.guild.channels.find(channel => channel.name === "bookmarks" && channel.type === "text");
        if (channel) {
            if (message.partial) await message.fetch();
            (/** @type {TextChannel} */(channel)).send(
                message.url,
                {
                    embed: new MessageEmbed({
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL(),
                        },
                        description: message.content,
                    }),
                },
            );
        } else {
            message.channel.send("#bookmarks channel not found!\nglobal-bookmarks make bookmarks on #bookmarks.\nPlease make #bookmarks channel.");
        }
    } else if (messageReaction.emoji.name === "❌" && message.author.id === message.channel.client.user.id) {
        message.delete();
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
