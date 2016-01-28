var SpotifyWebApi = require('spotify-web-api-node');

var db = require('./db');

var methods = {
  auth: auth,
  authCodeGrant: authCodeGrant,
  client: createClient(),
  getPlaylist: function(team_id, playlist_id) {
    var bot_spotify_username = db.bot_spotify_username.get(team_id);

    auth(team_id, bot_spotify_username).then(function(client) {
      client.getPlaylist(bot_spotify_username, playlist_id).then(function(data) {
        console.log('getPlaylist success:', data);
        resolve(data);
      }).catch(function(err) {
        console.log('getPlaylist error:', err);
        reject(err);
      });
    });
  },
  addTracksToPlaylist: function(team_id, playlist_id, track_uris) {
    return new Promise(function(resolve, reject) {
      var bot_spotify_username = db.bot_spotify_username.get(team_id);

      auth(team_id, bot_spotify_username).then(function(client) {
        client.addTracksToPlaylist(bot_spotify_username, playlist_id, track_uris).then(function(data) {
          console.log('addTracksToPlaylist success:', data);
          resolve(data);
        }).catch(function(err) {
          console.log('addTracksToPlaylist error:', err);
          reject(err);
        });
      });
    });
  },
  createPlaylist: function(team_id, channel_id, playlist_name) {
    return new Promise(function(resolve, reject) {
      var playlist_id = db.playlist_id.get(team_id, channel_id);
      var bot_spotify_username = db.bot_spotify_username.get(team_id);

      // See if it has already been created
      if (playlist_id) {
        methods.getPlaylist(team_id, playlist_id).then(function(data) {
          var playlist_name = data.body.name;
          var playlist_uri = data.body.uri;

          resolve({
            body: {
              already_exists: true,
              name: playlist_name,
              uri: playlist_uri,
            }
          });
        });

        return;
      }

      auth(team_id, bot_spotify_username).then(function(client) {
        client.createPlaylist(bot_spotify_username, playlist_name, { public: true }).then(function(data) {
          console.log('createPlaylist success:', data.body);
          var playlist_id = data.body.id;
          db.playlist_id.set(team_id, channel_id, playlist_id);

          resolve(data);
        }).catch(function(err) {
          console.log('createPlaylist error:', err);
          reject(err);
        });
      });
    });
  },
};

module.exports = methods;

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
    var client = createClient(access_token, refresh_token);
    var bot_spotify_username = db.bot_spotify_username.get(team_id);

    // Test the auth
    // TODO: replace this with something that looks at expires
    client.getUser(bot_spotify_username).then(function() {
      resolve(client);
    }).catch(function(err) {
      console.log('getUser error:', err);

      var new_client = createClient();
      new_client.setRefreshToken(refresh_token);
      new_client.refreshAccessToken().then(function(data) {
        console.log('refreshAccessToken success:', data);

        var new_access_token = data.body.access_token;
        db.access_token.set(team_id, user_id, new_access_token);
        new_client.setAccessToken(new_access_token);
        resolve(new_client);
      }).catch(function(err) {
        console.log('refreshAccessToken error:', err);
        reject(err);
      });
    });
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
