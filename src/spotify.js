var SpotifyWebApi = require('spotify-web-api-node');

var db = require('./db');

module.exports = {
  auth: function(team_id, user_id, code) {
    var client = createClient();

    return new Promise(function(resolve, reject) {
      var access_token = db.access_token.get(team_id, user_id);
      var refresh_token = db.refresh_token.get(team_id, user_id);
      client.setAccessToken(access_token);
      client.setRefreshToken(refresh_token);

      client.refreshAccessToken().then(function() {
        resolve(client);
      }).catch(function(err) {
        console.log('refreshAccessToken error:', err);
        reject(err);
      });
    });
  },
  client: createClient(),
};

function createClient() {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.HOST + 'oauth_spotify',
  });
}
