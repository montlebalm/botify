var authUrl = require('../utils/auth_url');
var db = require('../db');

/**
 * Example message:
 *   token: 'DHkLXhF7UxcdMFjerN6ueYVX',
 *   team_id: 'T0GK7J14Y',
 *   team_domain: 'thetrack',
 *   channel_id: 'C0JRNUYQN',
 *   channel_name: 'music-80s-be-crazy',
 *   user_id: 'U0JK5L3F0',
 *   user_name: 'monty',
 *   command: '/botify',
 *   text: 'hi',
 *   response_url: 'https://hooks.slack.com/commands/T0GK7J14Y/18900631748/Bg5dBLpQwcISqMdu2mk19DRi',
 *   user: 'U0JK5L3F0',
 *   channel: 'C0JRNUYQN',
 *   type: 'slash_command'
 */
module.exports = function(bot, message) {
  var text = message.text.trim();

  if (!text) {
    bot.replyPrivate(message, 'I don\'t even... what?');
    return;
  }

  var command_args = text.split(/\s+/);
  var command = command_args.shift();
  var team_id = message.team_id;
  var user_id = message.user_id;
  var access_token = db.access_token.get(team_id, user_id);

  if (!access_token && command !== 'auth') {
    console.log('User', user_id, 'is not authenticated');
    var auth_url = authUrl(team_id, user_id);
    bot.replyPrivate(message, 'Almost ready! First you need to tell Spotify that it\'s ok for me to make playlists for you. Use this link:\n\n' + auth_url);
  } else {
    try {
      // Automatically match the command with a handler
      require('../commands/' + command)(bot, message, command_args);
    } catch (err) {
      console.log('No command:', err);
      bot.replyPrivate(message, 'Right like I\'m just going to "' + command + '" just because you said so');
    }
  }
}
