var _ = require('lodash');
var fs = require('fs');

var db_path = './db.json';

module.exports = {
  access_token: {
    get: function(team_id, user_id) {
      if (user_id === process.env.SPOTIFY_USERNAME) {
        return get(team_id, 'bot_spotify_access_token');
      }

      return getUser(team_id, user_id, 'spotify_access_token');
    },
    set: function(team_id, user_id, value) {
      if (user_id === process.env.SPOTIFY_USERNAME) {
        set(team_id, 'bot_spotify_access_token', value);
        return;
      }

      setUser(team_id, user_id, 'spotify_access_token', value);
    },
  },
  refresh_token: {
    get: function(team_id, user_id) {
      if (user_id === process.env.SPOTIFY_USERNAME) {
        return get(team_id, 'bot_spotify_refresh_token');
      }

      return getUser(team_id, user_id, 'spotify_refresh_token');
    },
    set: function(team_id, user_id, value) {
      if (user_id === process.env.SPOTIFY_USERNAME) {
        set(team_id, 'bot_spotify_refresh_token', value);
        return;
      }

      setUser(team_id, user_id, 'spotify_refresh_token', value);
    },
  },
  playlist: {
    get: function(team_id, slack_channel_id) {
      return get(team_id, 'channels.'+slack_channel_id+'.spotify_playlist_id');
    },
    set: function(team_id, slack_channel_id, value) {
      set(team_id, 'channels.'+slack_channel_id+'.spotify_playlist_id', value);
    },
  },
  spotify_username: {
    get: function(team_id, user_id) {
      return getUser(team_id, user_id, 'spotify_username');
    },
    set: function(team_id, user_id, value) {
      setUser(team_id, user_id, 'spotify_username', value);
    },
  },
  spotify_auth_code: {
    get: function(team_id, user_id) {
      if (user_id === process.env.SPOTIFY_USERNAME) {
        return get(team_id, 'bot_spotify_auth_code');
      }

      return getUser(team_id, user_id, 'spotify_auth_code');
    },
    set: function(team_id, user_id, value) {
      if (user_id === process.env.SPOTIFY_USERNAME) {
        set(team_id, 'bot_spotify_auth_code', value);
        return;
      }

      setUser(team_id, user_id, 'spotify_auth_code', value);
    },
  },
};

function get(team_id, path) {
  var full_path = ['teams', team_id, path].join('.');
  console.log('get:', full_path);
  return _.get(read(), full_path);
}

function getUser(team_id, user_id, path) {
  return get(team_id, 'users.'+user_id+'.'+path);
}

function set(team_id, path, value) {
  var full_path = ['teams', team_id, path].join('.');
  console.log('set:', full_path, value);
  write(_.set(read(), full_path, value));
}

function setUser(team_id, user_id, path, value) {
  set(team_id, 'users.'+user_id+'.'+path, value);
}

function read() {
  return JSON.parse(fs.readFileSync(db_path));
}

function write(contents) {
  fs.writeFileSync(db_path, JSON.stringify(contents));
}
