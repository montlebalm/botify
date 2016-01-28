var authUrl = require('../utils/auth_url');
var db = require('../db');
var trackBot = require('../utils/track_bot');

module.exports = function(bot, config) {
  // Track the bot in our persistent storage
  if (!trackBot.has(bot)) {
    bot.startRTM(function(err) {
      if (err) {
        console.log('RTM error:', err);
        return;
      }

      trackBot.track(bot);

      var team_id = bot.team_info.id;
      db.created_by_slack_user_id.set(team_id, config.createdBy);

      bot.startPrivateConversation({ user: config.createdBy }, function(err, convo) {
        if (err) {
          console.log('startPrivateConversation error:', err);
          return;
        }

        convo.say('Hi! I just need a few things before we can get started.');

        convo.ask('Could you tell me the username of the Spotify account I should use for playlists?', [{
          pattern: '[\w-]+',
          callback: function(response, convo) {
            var username = response.text.trim();
            db.bot_spotify_username.set(team_id, username);

            var auth_url = authUrl(team_id, username);
            convo.say('Great! Now you\'ll just need to help me authenticate that user with Spotify');
            convo.say('Here\'s the authentication link: ' + auth_url);

            convo.next();
          },
        }, {
          default: true,
          callback: function(response, convo) {
            console.log('default', response);
            convo.say('Sorry, but I didn\'t catch that. Could you tell me again with just the username?');
            convo.repeat();
            convo.next();
          },
        }]);


      });
    });
  }
};
