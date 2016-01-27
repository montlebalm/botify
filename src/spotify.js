var SpotifyWebApi = require('spotify-web-api-node');

var db = require('./db');

module.exports = {
  auth: auth,
  authCodeGrant: authCodeGrant,
  client: createClient(),
  createPlaylist: function(team_id, channel_id, playlist_name) {
    return new Promise(function(resolve, reject) {
      var playlist_id = db.playlist_id.get(team_id, channel_id);

      // See if it has already been created
      if (playlist_id) {
        var existing_playlist_name = db.playlist_name.get(team_id, channel_id);
        var existing_playlist_uri = db.playlist_uri.get(team_id, channel_id);
        // TODO: would be better not to have to fake this so badly
        resolve({
          body: {
            already_exists: true,
            name: existing_playlist_name,
            uri: existing_playlist_uri,
          }
        });
        return;
      }

      var bot_spotify_username = process.env.SPOTIFY_USERNAME;

      auth(team_id, bot_spotify_username).then(function(client) {
        client.createPlaylist(bot_spotify_username, playlist_name, { public: true }).then(function(data) {
          console.log('createPlaylist success:', data.body);
          var playlist_id = data.body.id;
          db.playlist_id.set(team_id, channel_id, playlist_id);

          var playlist_name = data.body.name;
          db.playlist_name.set(team_id, channel_id, playlist_name);

          var playlist_uri = data.body.uri;
          db.playlist_uri.set(team_id, channel_id, playlist_uri);

          resolve(data);
        }).catch(function(err) {
          console.log('createPlaylist error:', err);
          reject(err);
        });
      });
    });
  },
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
