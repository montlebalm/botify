var spotify = require('../spotify');

var SCOPES = [
  'playlist-modify-public',
  'playlist-read-collaborative',
  'streaming',
];

module.exports = function(team_id, user_id) {
  var state = [process.env.SPOTIFY_STATE, team_id, user_id].join(':');
  return spotify.client.createAuthorizeURL(SCOPES, state);
};
