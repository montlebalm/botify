var db = require('../db');
var spotify = require('../spotify');

module.exports = function(bot, message, args) {
  var team_id = message.team_id;
  var user_id = message.user_id;
  var username = args.join('');

  if (!username) {
    bot.replyPrivate(message, 'I don\'t know. Who are you?');
    return;
  }

  spotify.auth(team_id, user_id).then(function(client) {
    client.getUser(username).then(function(data) {
      console.log('getUser success:', data);
      bot.replyPrivate(message, 'You are "'+data.body.display_name+'" of course');
    }).catch(function(err) {
      console.log('getUser error:', err);
      bot.replyPrivate(message, 'Error: ' + err);
    });
  });
};
