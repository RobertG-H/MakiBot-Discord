require('dotenv').config(); // For process.env to work

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client ({disableEveryone: true});

var request = require('request');
var url = require('url');
var pg = require('pg');

var siteUrl = process.env.SITE_URL;


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setGame("Lewd the dragon loli");
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

  // Post Picture commane
  if(cmd === `${prefix}post`){

    request(siteUrl, function(err, res, body){
      if (!err && res.statusCode == 200) {
        var importedJSON = JSON.parse(body);
        var imageURL = importedJSON.data.children[0].data.url;
        pool.connect(function(err, client){
          if(err){
            console.log(err);
            return message.channel.send("I\'m having problems!");
          }
          else{
            findURL(client, imageURL, importedJSON, params, 1);
          }
        });
      }
      else {
        console.log("ERROR READING JSON");
        return message.channel.send("I\'m having problems!");
      }
    });

  }
});

// Function to get URL

function findURL(client, imageURL, importedJSON, params, i){
  var queryString = 'SELECT * FROM urls WHERE url = \'' + imageURL + '\'';
  client.query(queryString, function(err, result){
    if(result.rows.length == 0){
      queryString = 'INSERT INTO urls (url) VALUES (\'' + imageURL + '\')';
      client.query(queryString);
      console.log("POSTING...")
      return message.channel.send(imageURL);
    }
    else{
      imageURL = importedJSON.data.children[i].data.url;
      i++;
      return findURL(client, imageURL, importedJSON, params, i);
    }
  });
}

bot.login(process.env.DISCORD_TOKEN);
