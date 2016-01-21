var playlistName = require('../utils/playlist_name');
var spotify = require('../spotify');

module.exports = function(bot, message, args) {
  var team_id = message.team_id;
  var channel_id = message.channel_id;
  var team_name = bot.team_info.name;
  var channel_name = message.channel_name;
  var playlist_name = playlistName(team_name, channel_name);

  // TODO: check for existing playlist

  spotify.createPlaylist(team_id, channel_id, playlist_name).then(function(data) {
    bot.replyPrivate(message, {
      attachments: [{
        color: '#dddddd',
        text: data.body.uri,
      }],
      text: 'The playlist for this channel is called *' + data.body.name + '*',
    });
  });
};
