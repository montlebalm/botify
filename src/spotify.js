var SpotifyWebApi = require('spotify-web-api-node');

var db = require('./db');

module.exports = {
  auth: auth,
  authCodeGrant: authCodeGrant,
  client: createClient(),
};

function createClient(access_token, refresh_token) {
  if (access_token) {
    return new SpotifyWebApi({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  }

  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.HOST + 'oauth_spotify',
  });
}

function auth(team_id, user_id) {
  return new Promise(function(resolve, reject) {
    var access_token = db.access_token.get(team_id, user_id);
    var refresh_token = db.refresh_token.get(team_id, user_id);
    console.log('auth access_token for', user_id, 'is', access_token);
    var client = createClient(access_token, refresh_token);
    resolve(client);
  });
}

function authCodeGrant(team_id, user_id, code) {
  return createClient().authorizationCodeGrant(code).then(function(data) {
    console.log('authorizationCodeGrant success:', user_id, data);
    var access_token = data.body.access_token;
    var refresh_token = data.body.refresh_token;
    db.access_token.set(team_id, user_id, access_token);
    db.refresh_token.set(team_id, user_id, refresh_token);
  }).catch(function(err) {
    console.log('authorizationCodeGrant error:', err);
  });
}
