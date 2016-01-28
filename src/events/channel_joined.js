var playlistName = require('../utils/playlist_name');
var spotify = require('../spotify');

module.exports = function(bot, message) {
  console.log('EVENT: CHANNEL_JOINED');

  var team_id = bot.team_info.id;
  var channel_id = message.channel.id;
  var team_name = bot.team_info.name;
  var channel_name = message.channel.name;
  var playlist_name = playlistName(team_name, channel_name);

  spotify.createPlaylist(team_id, channel_id, playlist_name).then(function(data) {
    var actual_playlist_name = data.body.name;

    var text;
    if (data.body.already_exists) {
      text = 'Happy to be here. It looks like we already have a playlist for this channel called *' + actual_playlist_name + '*';
    } else {
      text = 'Thanks for inviting me! I created a playlist called *' + actual_playlist_name + '* for this channel';
    }

    bot.say({
      attachments: [{
        color: '#1ed761',
        text: data.body.uri,
      }],
      channel: channel_id,
      text: text,
    });
  });
};
