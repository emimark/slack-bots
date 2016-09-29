//prior to starting, run
//
// npm init
// npm i --save slackbots

var Bot = require('slackbots');

var settings = {
  token:  'xoxb-85548971696-QskZVIVoXyVo4ojKxd1q2GOq', //Replace this with your token
  name: 'Tomas Shelby', //Replace this with the Bot's name
  id: 'thomas' //Replace this with the Bot's handle
};

var params = {
//  icon_emoji: ':unicorn_face:', //replace this with whatever icon you want the bot to post as
  link_names: 1 //Ensures formatting in messages posted by your bot is respected
};

var bot = new Bot(settings);
var self; //convenience handle on our own user

bot.on('open', function() {
  console.log('Connected');
  self = bot._getUserByHandle(settings.id);
});

bot.on('start', function() {
  console.log("Start");
});

bot.on('message', function(message)  {
  if (message.user === self.id) return; //avoid reacting to the messages from ourselves

  if (message.type === 'message' && Boolean(message.text)){ //this is a message sent in a channel, group or dm where our bot is present

    var user = bot._getUserById(message.user); //this is the user who wrote the message
    var text = message.text; //this is the message that the user sent.

    if (message.text.indexOf(self.id) > -1) { //Someone mentioned this bot user in some channel, group or dm
      bot.postMessage(message.channel, "Hello, " + user.name, params);
      console.log('Mention');
    } else if (message.channel[0] === 'D') { //Direct message
      console.log('Direct message');
    } else if (message.channel[0] === 'G') { //This is a group convo
      console.log('Group convo');
    } else if (message.channel[0] === 'C') { //This is a message to a public channel
      console.log('Channel convo');
    }
  }
});

//** Handy helper functions below **//

Bot.prototype._getChannelByName = function (channelName) {
  return this.channels.filter(function (item) {
    return item.name === channelName;
  })[0];
};

Bot.prototype._getChannelById = function (channelId) {
  return this.channels.filter(function (item) {
    return item.id === channelId;
  })[0];
};

Bot.prototype._getGroupByName = function (groupName) {
  return this.channels.filter(function (item) {
    return item.name === groupName;
  })[0];
};

Bot.prototype._getGroupById = function (groupId) {
  return this.channels.filter(function (item) {
    return item.id === groupId;
  })[0];
};

Bot.prototype._getUserById = function (userId) {
  return this.users.filter(function (item) {
    return item.id === userId;
  })[0];
};

Bot.prototype._getUserByHandle = function (userName) {
  return this.users.filter(function (item) {
    return item.name === userName;
  })[0];
};

//Extract the mention of a user (slack handle) in a block of text
String.prototype._extractUser = function () {
  var rx = /<@(.*)>/g;
  var arr = rx.exec(this);
  if (arr) {
    var userId = arr[0].replace(/[<@>]/gi, '');
    return bot._getUserById(userId).name;
  };
  return null;
};

//Extract the mention of a channel in a block of text
String.prototype._extractChannel = function () {
  var rx = /<#(.*)>/g;
  var arr = rx.exec(this);
  if (arr) {
    var userId = arr[0].replace(/[<#>]/gi, '');
    var channel = bot._getChannelById(userId);
    if (channel) {
      return channel.name;
    }
  };
  return null;
};
