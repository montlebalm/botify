var SpotifyWebApi = require('spotify-web-api-node');

var db = require('./db');

var client = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.HOST + 'oauth_spotify',
});

module.exports = {
  auth: function(team_id, user_id) {
    var access_token = db.access_token.get(team_id, user_id);
    client.setAccessToken(access_token);

    var refresh_token = db.refresh_token.get(team_id, user_id);
    client.setRefreshToken(access_token);

    return client;
  },
  client: client,
};
