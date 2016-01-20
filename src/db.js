var _ = require('lodash');
var fs = require('fs');

var db_path = './db.json';

module.exports = {
  access_token: {
    get: function(team_id, user_id) {
      return get(team_id, user_id, 'spotify_access_token');
    },
    set: function(team_id, user_id, value) {
      set(team_id, user_id, 'spotify_access_token', value);
    },
  },
  refresh_token: {
    get: function(team_id, user_id) {
      return get(team_id, user_id, 'spotify_refresh_token');
    },
    set: function(team_id, user_id, value) {
      set(team_id, user_id, 'spotify_refresh_token', value);
    },
  },
  playlist: {
    get: function(team_id, user_id, slack_channel_id) {
      return get(team_id, user_id, 'channels.'+slack_channel_id+'.spotify_playlist_id');
    },
    set: function(team_id, user_id, slack_channel_id, spotify_playlist_id) {
      set(team_id, user_id, 'channels.'+slack_channel_id+'.spotify_playlist_id', spotify_playlist_id);
    },
  },
  spotify_username: {
    get: function(team_id, user_id) {
      return get(team_id, user_id, 'spotify_username');
    },
    set: function(team_id, user_id, spotify_username) {
      set(team_id, user_id, 'spotify_username', spotify_username);
    },
  },
};

function get(team_id, user_id, path) {
  var full_path = ['teams', team_id, 'users', user_id, path].join('.');
  return _.get(read(), full_path);
}

function set(team_id, user_id, path, value) {
  var full_path = ['teams', team_id, 'users', user_id, path].join('.');
  console.log(full_path, value);
  write(_.set(read(), full_path, value));
}

function read() {
  return JSON.parse(fs.readFileSync(db_path));
}

function write(contents) {
  fs.writeFileSync(db_path, JSON.stringify(contents));
}
