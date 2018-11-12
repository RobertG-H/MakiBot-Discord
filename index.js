// https://discordapp.com/oauth2/authorize?client_id=457012879594618882&scope=bot4
// https://discordapp.com/api/oauth2/authorize?client_id=457012879594618882&permissions=19472&scope=bot

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
var NotifyChannels = [];
//var servers = {};

// Scheduler stuff
var cron = require('node-cron');

// TODO add database support for non-duplicate links

// Bot setup
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("Lewding all dragon lolis");
});

bot.on("guildCreate", guild => {
  console.log(`Just joined: {guild.name}`);
  addPostChannel (guild, "general");
  NotifyChannel.send('Hiya! I am Makibot use the "~help" command for a list of things you can do with me.')
});

// Message commands (prefix: ~)
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let input = null;
  if (messageArray[1] != null)
    input = messageArray[1];
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

  // Help command
  if(cmd === `${prefix}help` || cmd === `${prefix}Help`) return message.channel.send(
    "Hiya! \n\nMy name is Makibot. I post lewd photos in a the anime-pics channel (make sure you have one) just for you at 8am and 8pm everyday ( ͡° ͜ʖ ͡°) \n\n(Sorry I don't have any commands right now)");

  // Creates and joins new posting channel
  // TODO Add database support to store the posting channel per guild
  /*if(cmd === `${prefix}createpostchannel`){
    if(input == null){
      console.log("No channel name");
      return message.channel.send ("Enter a channel name baka!~");
    }
     var server = message.guild;
     server.createChannel (input, "text");
     addPostChannel (server, input);
     return message.channel.send (`I just created a new channel: "${input.toString()}"  I will post there from now on.`);
  }
*/
  // Sets channel to post pics to
/*
  if(cmd === `${prefix}setpostchannel`){
    if(input == null){
      console.log("No channel name");
      return message.channel.send ("Enter a channel name baka!~");
    }
    var server = message.guild;
    addPostChannel(server, input);
    return message.channel.send (`I will post to "${input.toString()}" from now on.`);
  } */

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
      // Setting all posting channels
      NotifyChannels = [];
      bot.guilds.map((guild) => {
        guild.channels.map((channel) => {
          if (channel.type === 'text') {
            if(channel.name === 'anime-pics'){
              //console.log(`Guild: ${guild.id} and channel: ${channel.name}`);
              NotifyChannels.push(channel);
            }
          }
        });
      });
      //Loop through each channel and post
      NotifyChannels.forEach( NotifyChannel => {
        NotifyChannel.send(imageURL);
      });

    }
    else {
      console.log("ERROR READING JSON");
      NotifyChannel.send("I\'m having problems!");
    }
  });
}

/*
function addPostChannel (server, channelName) {
  console.log("Setting channel to post in to: ", channelName);
  NotifyChannel = server.channels.find("name", channelName);
} */

// Scheduler
cron.schedule('0 13,1 * * *', function(){
  sendPicture ();
});

bot.login(process.env.DISCORD_TOKEN);

// Self pinging
var express = require('express');
var app = express();
var http = require("http");
app.set('port', (process.env.PORT|| 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

setInterval(function() {
    http.get("http://maki-bot-discord.herokuapp.com");
}, 300000);
