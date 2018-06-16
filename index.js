require('dotenv').config(); // For process.env to work

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

var bot = new Discord.Client ({disableEveryone: true});

var request = require('request');
var url = require('url');
var pg = require('pg');

var siteUrl = process.env.SITE_URL;

var NotifyChannel;


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setGame("Lewd the dragon loli");
  NotifyChannel = bot.channels.find("name", "general"); //MIGHT NEED TO BE CHANGED
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  // Hello command
  if(cmd === `${prefix}hello` || cmd === `${prefix}Hello`) return message.channel.send("Hiya!");

  // Bot Info command
  if(cmd === `${prefix}botinfo`){
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    return message.channel.send(botembed);
  }

  // Post Picture command
  if(cmd === `${prefix}post`){
    sendPicture ();
  }
});

function sendPicture () {
  request(siteUrl, function(err, res, body){
    if (!err && res.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      var imageURL = importedJSON.data.children[0].data.url;
      console.log("POSTING...")
      NotifyChannel.send(imageURL);
    }
    else {
      console.log("ERROR READING JSON");
      NotifyChannel.send("I\'m having problems!");
    }
  });
}

bot.login(process.env.DISCORD_TOKEN);

module.exports = () => {
  return {
    sendPicture: {
      handler: sendPicture.bind (null)
    }
  }
}
