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
  var bot_spotify_username = process.env.SPOTIFY_USERNAME;

  spotify.auth(team_id, bot_spotify_username).then(function(client) {
    client.createPlaylist(bot_spotify_username, playlist_name, { public: true }).then(function(data) {
      console.log('createPlaylist success:', data.body);
      var playlist_id = data.body.id;
      db.playlist.set(team_id, channel_id, playlist_id);

      bot.say({
        channel: channel_id,
        text: [
          'Happy to be here! Here\'s the playlist I created for this channel:',
          '- Web: ' + data.body.external_urls.spotify,
          '- Spotify: ' + data.body.uri,
        ].join('\n'),
      });
    }).catch(function(err) {
      console.log('createPlaylist error:', err);
    });
  });
};
