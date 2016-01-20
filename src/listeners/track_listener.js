var db = require('../db');
var spotify = require('../spotify');
var spotifyTrackUri = require('../utils/spotify_track_uri');

/**
 * Listen for Spotify track links
 *
 * Message example:
 *   type: 'message',
 *   channel: 'C0JRNUYQN',
 *   user: 'U0JK5L3F0',
 *   text: '<https://open.spotify.com/track/2NMgVh5qaPprKTEzFe3501>',
 *   ts: '1453314795.000015',
 *   team: 'T0GK7J14Y',
 *   event: 'ambient',
 *   match: [
 *     'https://open.spotify.com/track/2NMgVh5qaPprKTEzFe3501',
 *     '2NMgVh5qaPprKTEzFe3501',
 *     index: 1,
 *     input: '<https://open.spotify.com/track/2NMgVh5qaPprKTEzFe3501>' ]
 */
module.exports = function(bot, message) {
  var team_id = message.team;
  var user_id = process.env.SPOTIFY_USERNAME;
  var channel_id = message.channel;

  var playlist_id = db.playlist.get(team_id, channel_id);
  if (!playlist_id) return;

  var track_id = message.match[1];
  var track_uri = spotifyTrackUri(track_id);

  spotify.auth(team_id, user_id).addTracksToPlaylist(user_id, playlist_id, [track_uri]).then(function(data) {
    bot.reply(message, 'Added the track!');
  }).catch(function(err) {
    console.log('Add track error:', err);
    bot.replyPrivate(message, 'Add track error: ' + err);
  });
};
