var playlistName = require('../utils/playlist_name');
var spotify = require('../spotify');

module.exports = function(bot, message, args) {
  var team_id = message.team_id;
  var channel_id = message.channel_id;

  spotify.getPlaylist(team_id, channel_id).then(function(data) {
    bot.replyPrivate(message, {
      attachments: [{
        color: '#dddddd',
        text: data.body.uri,
      }],
      text: 'The playlist for this channel is called *' + data.body.name + '*',
    });
  });
};
