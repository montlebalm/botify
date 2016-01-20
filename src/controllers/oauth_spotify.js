var db = require('../db');
var spotify = require('../spotify');

module.exports = function(req, res) {
  var code = req.query.code;
  var state = req.query.state;
  var state_parts = state.split(':');
  var state_id = state_parts.shift();

  // Protect ya neck
  if (state_parts.length !== 2 || state_id != process.env.SPOTIFY_STATE) {
    res.sendStatus(403).send('Bad state');
    return;
  }

  var team_id = state_parts[0];
  var user_id = state_parts[1];

  spotify.client.authorizationCodeGrant(code).then(function(data) {
    db.access_token.set(team_id, user_id, data.body.access_token);
    db.refresh_token.set(team_id, user_id, data.body.refresh_token);

    spotify.auth(team_id, user_id).getMe().then(function(data) {
      var spotify_username = data.body.id;
      db.spotify_username.set(team_id, user_id, spotify_username);
      res.sendStatus(200).send('Success!');
    }).catch(function(err) {
      console.log('Spotify user error:', err);
      res.sendStatus(500).send('Spotify user error: ' + err);
    });
  }).catch(function(err) {
    console.log('err', err);
    res.sendStatus(500).send('Spotify OAuth Error: ' + err);
  });
};
