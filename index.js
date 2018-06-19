require('dotenv').config(); // For process.env to work

// Discord bot stuff
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
var bot = new Discord.Client ({disableEveryone: true});

// Url and request stuff
var request = require('request');
var url = require('url');
var siteUrl = process.env.SITE_URL;

// Custom channel stuff
var NotifyChannel;

// Scheduler stuff
var cron = require('node-cron');

// TODO add database support for non-duplicate links

// Bot setup
bot.on("ready", async () => {
  //var server = guild;
  console.log(`${bot.user.username} is online!`);
  bot.user.setGame("Lewd the dragon loli");
  //server.createChannel("anime-pics", "text");
  NotifyChannel = bot.channels.find("name", "general"); //MIGHT NEED TO BE CHANGED
});

// Message commands (prefix: ~)
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

  if(cmd === `${prefix}help` || cmd === `${prefix}Help`) return message.channel.send(
    "Hiya! My name is Makibot. I post lewd photos just in the general channel for you at 8am and 8pm everyday ( ͡° ͜ʖ ͡°)");

  // Post Picture command
  if(cmd === `${prefix}post`){
    sendPicture ();
  }
});

// Send Picture function
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

// Scheduler
cron.schedule('20,21,22 * * * *', function(){
  console.log('running every minute 20');
  sendPicutre ();
});

bot.login(process.env.DISCORD_TOKEN);
