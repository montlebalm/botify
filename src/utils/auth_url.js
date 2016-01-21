var spotify = require('../spotify');

var SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-collaborative',
];

module.exports = function(team_id, user_id) {
  var state_prefix = process.env.SPOTIFY_STATE;
  var state = [state_prefix, team_id, user_id].join(':');
  return spotify.client.createAuthorizeURL(SCOPES, state);
};
