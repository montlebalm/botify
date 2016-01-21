var playlistName = require('../utils/playlist_name');
var spotify = require('../spotify');

module.exports = function(bot, message) {
  var team_id = bot.team_info.id;
  var channel_id = message.channel.id;
  var team_name = bot.team_info.name;
  var channel_name = message.channel.name;
  var playlist_name = playlistName(team_name, channel_name);

  spotify.createPlaylist(team_id, channel_id, playlist_name).then(function(data) {
    bot.say({
      attachments: [{
        color: '#1ed761',
        text: data.body.uri,
      }],
      channel: channel_id,
      text: 'Thanks for inviting me! I created a playlist called *' + data.body.name + '* for this channel',
    });
  });
};
