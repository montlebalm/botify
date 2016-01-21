var authUrl = require('../utils/auth_url');
var db = require('../db');

module.exports = function(bot, message) {
  var team_id = message.team_id;
  var user_id = process.env.SPOTIFY_USERNAME;
  var bot_access_token = db.access_token.get(team_id, user_id);

  if (bot_access_token) {
    bot.replyPrivate(message, 'The bot is already authenticated with Spotify');
    return;
  }

  var auth_url = authUrl(team_id, user_id);
  bot.replyPrivate(message, 'First, you\'ll need to authenticate me with Spotify with this link:\n\n' + auth_url);
};
