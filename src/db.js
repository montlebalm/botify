var _ = require('lodash');
var fs = require('fs');

var db_path = './db.json';

var methods = {
  access_token: {
    get: function(team_id, user_id) {
      if (user_id === methods.bot_spotify_username.get(team_id)) {
        return get(team_id, 'bot_spotify_access_token');
      }

      return getUser(team_id, user_id, 'spotify_access_token');
    },
    set: function(team_id, user_id, value) {
      if (user_id === methods.bot_spotify_username.get(team_id)) {
        set(team_id, 'bot_spotify_access_token', value);
        return;
      }

      setUser(team_id, user_id, 'spotify_access_token', value);
    },
  },
  refresh_token: {
    get: function(team_id, user_id) {
      if (user_id === methods.bot_spotify_username.get(team_id)) {
        return get(team_id, 'bot_spotify_refresh_token');
      }

      return getUser(team_id, user_id, 'spotify_refresh_token');
    },
    set: function(team_id, user_id, value) {
      if (user_id === methods.bot_spotify_username.get(team_id)) {
        set(team_id, 'bot_spotify_refresh_token', value);
        return;
      }

      setUser(team_id, user_id, 'spotify_refresh_token', value);
    },
  },
  playlist_id: {
    get: function(team_id, slack_channel_id) {
      return get(team_id, 'channels.'+slack_channel_id+'.spotify_playlist_id');
    },
    set: function(team_id, slack_channel_id, value) {
      set(team_id, 'channels.'+slack_channel_id+'.spotify_playlist_id', value);
    },
  },
  bot_spotify_username: {
    get: function(team_id) {
      return get(team_id, 'bot_spotify_username');
    },
    set: function(team_id, value) {
      set(team_id, 'bot_spotify_username', value);
    },
  },
  created_by_slack_user_id: {
    get: function(team_id) {
      return get(team_id, 'created_by_slack_user_id');
    },
    set: function(team_id, value) {
      set(team_id, 'created_by_slack_user_id', value);
    },
  },
};

module.exports = methods;

function get(team_id, path) {
  var full_path = ['teams', team_id, path].join('.');
  return _.get(read(), full_path);
}

function getUser(team_id, user_id, path) {
  return get(team_id, 'users.'+user_id+'.'+path);
}

function set(team_id, path, value) {
  var full_path = ['teams', team_id, path].join('.');
  write(_.set(read(), full_path, value));
}

function setUser(team_id, user_id, path, value) {
  set(team_id, 'users.'+user_id+'.'+path, value);
}

function read() {
  try {
    return JSON.parse(fs.readFileSync(db_path));
  } catch (err) {
    console.log('Error reading db:', err);
  }
}

function write(contents) {
  try {
    fs.writeFileSync(db_path, JSON.stringify(contents));
  } catch (err) {
    console.log('Error writing db:', err);
  }
}
