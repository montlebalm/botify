var authUrl = require('../utils/auth_url');
var db = require('../db');

module.exports = function(bot, message) {
  var team_id = message.team_id;
  var bot_spotify_username = db.bot_spotify_username.get(team_id);
  // var bot_access_token = db.access_token.get(team_id, bot_spotify_username);

  // if (bot_access_token) {
  //   bot.replyPrivate(message, 'The bot is already authenticated with Spotify');
  //   return;
  // }

  var auth_url = authUrl(team_id, bot_spotify_username);
  bot.replyPrivate(message, 'First, you\'ll need to authenticate me with Spotify with this link. You\'ll only need to do this once.\n\n' + auth_url);
};
