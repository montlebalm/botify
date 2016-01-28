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

  spotify.authCodeGrant(team_id, user_id, code).then(function() {
    res.sendStatus(200);

    // TODO: DM user that installed the bot to tell them we're gtg
  }).catch(function(err) {
    res.sendStatus(500);
  });
};
