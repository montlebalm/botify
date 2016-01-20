var db = require('../db');
var playlistName = require('../utils/playlist_name');
var spotify = require('../spotify');

module.exports = function(bot, message) {
  var channel_id = message.channel.id;
  var team_id = bot.team_info.id;
  var playlist_id = db.playlist.get(team_id, channel_id);

  if (playlist_id) {
    console.log('channel_joined: playlist already exists');
    return;
  }

  var team_name = bot.team_info.name;
  var channel_name = message.channel.name;
  var playlist_name = playlistName(team_name, channel_name);
  var user_id = process.env.SPOTIFY_USERNAME;
  var playlist_options = { public: true };

  spotify.auth(team_id, user_id).createPlaylist(user_id, playlist_name, playlist_options).then(function(data) {
    console.log('Playlist created:', data.body);
    var playlist_id = data.body.id;
    db.playlist.set(team_id, channel_id, playlist_id);
    bot.replyPrivate(message, 'Created "'+playlist_name+'" playlist. It could take up to 3 minutes for it to appear in Spotify.');
  }).catch(function(err) {
    console.log('Playlist error:', err);
    bot.replyPrivate(message, 'Error: ' + err);
  });
};
