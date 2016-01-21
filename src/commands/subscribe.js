var db = require('../db');
var spotify = require('../spotify');

module.exports = function(bot, message, args) {
  var team_id = message.team_id;
  var user_id = message.user_id;
  var channel_id = message.channel;
  var spotify_user = db.spotify_username.get(team_id, user_id);
  var playlist_id = db.playlist.get(team_id, channel_id);

  spotify.auth(team_id, user_id).then(function(client) {
    client.followPlaylist(spotify_user, playlist_id, { public: true }).then(function(data) {
      bot.replyPrivate(message, 'Ok!');
    }).catch(function(err) {
      console.log('Follow playlist error:', err);
      bot.replyPrivate(message, 'Error: ' + err);
    });
  });
};
