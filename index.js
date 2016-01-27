require('dotenv').load();
var Botkit = require('botkit');
var BotkitStorage = require('botkit-storage-mongo');

var trackBot = require('./src/utils/track_bot');

// Create Botkit App
var controller = Botkit.slackbot({
  storage: BotkitStorage({
    mongoUri: process.env.MONGO_URI,
  }),
}).configureSlackApp({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  scopes: ['bot', 'commands', 'chat:write:bot', 'im:write', 'chat:write:user'],
});

// Create server
controller.setupWebserver(process.env.PORT || 8080, function(err, webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  // Slack OAuth endpoint
  controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });

  // Spotify OAuth endpoint
  webserver.get('/oauth_spotify', require('./src/controllers/oauth_spotify'));
});

// Persistent bot storage
controller.storage.teams.all(function(err, teams) {
  if (err) throw new Error(err);

  // Connect all teams with bots up to slack!
  teams.forEach(function(team) {
    if (team.bot) {
      var bot = controller.spawn(team).startRTM(function(err) {
        if (err) {
          console.log('Error connecting bot to Slack:', err);
        } else {
          trackBot.track(bot);
        }
      });
    }
  });
});

// Event listeners
controller.on('slash_command', require('./src/events/slash_command'));
controller.on('channel_joined', require('./src/events/channel_joined'));
controller.on('create_bot', require('./src/events/create_bot'));

// Listen for linked Spotify tracks
controller.hears('https://open.spotify.com/track/(\\w+)', ['ambient'], require('./src/listeners/track_listener'));
