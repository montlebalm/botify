var SpotifyWebApi = require('spotify-web-api-node');

var db = require('./db');

module.exports = {
  auth: auth,
  authCodeGrant: authCodeGrant,
  client: createClient(),
};

function createClient() {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.HOST + 'oauth_spotify',
  });
}

function auth(team_id, user_id) {
  var client = createClient();

  console.log('auth as team: "'+team_id+'" user: "'+user_id+'"');

  return new Promise(function(resolve, reject) {
    var access_token = db.access_token.get(team_id, user_id);
    var refresh_token = db.refresh_token.get(team_id, user_id);
    client.setAccessToken(access_token);
    client.setRefreshToken(refresh_token);

    client.refreshAccessToken().then(function(data) {
      console.log('refreshAccessToken success:', data);
      var access_token = data.body.access_token;
      var refresh_token = data.body.refresh_token;

      if (access_token) {
        client.setAccessToken(access_token);
        db.access_token.set(team_id, user_id, access_token);
      }

      if (refresh_token) {
        db.refresh_token.set(team_id, user_id, refresh_token);
        client.setRefreshToken(refresh_token);
      }

      resolve(client);
    }).catch(function(err) {
      console.log('refreshAccessToken error:', err);
      reject(err);
    });
  });
}

function authCodeGrant(code) {
  var client = createClient();

  return client.authorizationCodeGrant(code).then(function(data) {
    console.log('authorizationCodeGrant success:', data);
    var access_token = data.body.access_token;
    var refresh_token = data.body.refresh_token;
    db.access_token.set(team_id, user_id, access_token);
    db.refresh_token.set(team_id, user_id, refresh_token);
  }).catch(function(err) {
    console.log('authorizationCodeGrant error:', err);
  });
}
