var db = require('../db');
var spotify = require('../spotify');

module.exports = function(bot, message, args) {
  var team_id = message.team_id;
  var user_id = message.user_id;
  var channel_id = message.channel;
  var channel_name = message.channel_name;
  var options = { public: true };

  var spotify_user = db.spotify_username.get(team_id, user_id);
  var existing_playlist_id = db.playlist.get(team_id, user_id, channel_id);

  if (existing_playlist_id) {
    bot.replyPrivate(message, 'You already have the playlist');
  } else {
    var spotifyClient = spotify.auth(team_id, user_id);
    spotifyClient.refreshAccessToken();

    spotifyClient.createPlaylist(spotify_user, channel_name, options).then(function(data) {
      var playlist_id = data.body.id;
      var playlist_name = data.body.name;

      db.playlist.set(team_id, user_id, channel_id, playlist_id);

      bot.replyPrivate(message, 'Created "'+playlist_name+'" playlist. It could take up to 3 minutes for it to appear in Spotify.');
    }).catch(function(err) {
      bot.replyPrivate(message, 'Error: ' + err);
    });
  }
};
