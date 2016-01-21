var db = require('../db');
var spotify = require('../spotify');

module.exports = function(bot, message, args) {
  var team_id = message.team_id;
  var user_id = message.user_id;
  var channel_id = message.channel;
  var playlist_id = db.playlist.get(team_id, channel_id);
  var bot_spotify_username = process.env.SPOTIFY_USERNAME;

  spotify.auth(team_id, user_id).then(function(client) {
    console.log('unfollowPlaylist:', bot_spotify_username, playlist_id);

    client.unfollowPlaylist(bot_spotify_username, playlist_id).then(function(data) {
      console.log('unfollowPlaylist success:', data);
      bot.replyPrivate(message, 'Unsubscribed!');
    }).catch(function(err) {
      console.log('unfollowPlaylist error:', err);
      bot.replyPrivate(message, 'Error: ' + err);
    });
  });
};
