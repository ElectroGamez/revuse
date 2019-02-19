const talkedRecently = new Set();

const Discord = require("discord.js");

const Fs = require('fs');
const Hue = require('node-hue-api').HueApi;

const Light = require('./classes/light.js')
const Report = require('./classes/report.js');
const Group = require('./classes/group.js');

const botoptions = require("./credentials/bot.json");
const hueCredentials = require('./credentials/hue.json');

global.report = new Report(Fs)
const bot = new Discord.Client();
const api = new Hue(hueCredentials['host'], hueCredentials['username']);

let officeLightsId = [10, 11, 12, 13];
let officeLights = new Array();

officeLightsId.forEach(function(officeLightId) {
  officeLights.push(new Light(officeLightId, api));
});

function toggle() {
  officeLights.forEach(function(officeLight) {
    officeLight.toggleLight();
  });
}

function party() {
  officeLights.forEach(function(officeLight) {
    for (let i = 0; i < 9; i ++ ) {
      setTimeout(() => {
        officeLight.toggleLight();
      }, getRandomInteger(100, 1000));
    }
  });
}

bot.on("ready", async () => {
  report.log(`Bot is ready. ${bot.user.username}`);

  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    report.log(link);
  } catch(e) {
    report.log(e.stack);
  }
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if((message.channel.type) === "dm") return;

  if(!message.content.startsWith(botoptions.prefix)) return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];

  command = command.substring(1);

  switch (command.toLowerCase()) {
    case "info":
    message.channel.send(botoptions.info);
    break;

    case "notice":
    notice();
    break;

    case "toggle":
    if (talkedRecently.has(msg.author.id)) {
      msg.channel.send("Wait 1 minute before getting typing this again. - " + msg.author);
    } else {

      toggle();
      message.channel.send("Toggled the lights.");

      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, 60000);
    }
    break;

    case "set":
    if (isNaN(messageArray[1] && isNaN(messageArray[2]))) return message.channel.send("Please provide a number and off/on");
    if (!(messageArray[2] == "off" || messageArray[2] == "on")) return message.channel.send("Please provide a number and off/on");
    let state = messageArray[2] == "off" ? false : true;

    let stateObject = {
      on: state,
      bri: 240,
      ct: 500,
      alert: 'none',
      colormode: 'ct',
      mode: 'homeautomation',
      reachable: true
    }

    officeLights[messageArray[1] -1].setState(lampObject);
    break;

    default:
    message.channel.send(botoptions.default);
    break;

    //remove this later.
    case "test":
    officeLights[0].setState(false);
    break;
  }
})

bot.login(botoptions.token);
