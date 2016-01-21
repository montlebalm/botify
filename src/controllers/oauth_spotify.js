var db = require('../db');
var spotify = require('../spotify');

module.exports = function(req, res) {
  var code = req.query.code;
  var state = req.query.state;
  var state_parts = state.split(':');
  var state_id = state_parts.shift();
  var team_id = state_parts[0];
  var user_id = state_parts[1];

  // Protect ya neck
  if (state_parts.length !== 2 || state_id != process.env.SPOTIFY_STATE) {
    res.sendStatus(403);
    return;
  }

  // Auth the code and get our tokens
  spotify.authCodeGrant(code).then(function(data) {
    spotify.auth(team_id, user_id).then(function() {
      res.sendStatus(200).send('Success!');
    });
  }).catch(function(err) {
    res.sendStatus(500);
  });
};
