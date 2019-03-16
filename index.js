const { Client, TextChannel, Constants } = require("discord.js");

const client = new Client({partials: Object.keys(Constants.PartialTypes)});

client.on("ready", () => console.log("start"));

client.on("message", (message) => {
    const id = message.channel.client.user.id;
    if (message.mentions.users.some(user => user.id === id)) {
        message.channel.send([
            "--- global-bookmarks help ---",
            "* React any messages with :bookmark:! I will create bookmark to #bookmarks channel!",
            "* React my messages (include bookmarks) with :X:. I will delete those messages.",
        ].join("\n"));
    }
});

client.on("messageReactionAdd", (messageReaction) => {
    if (messageReaction.emoji.name === "🔖" && messageReaction.count === 1) {
        const channel = messageReaction.message.guild.channels.find(channel => channel.name === "bookmarks" && channel.type === "text");
        (/** @type {TextChannel} */(channel)).send(messageReaction.message.url);
    } else if (messageReaction.emoji.name === "❌" && messageReaction.message.author.id === messageReaction.message.channel.client.user.id) {
        messageReaction.message.delete();
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
