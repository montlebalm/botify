# Botify

Botify is a Slack app that helps you create and update collaborative Spotify
playlists. It will automatically create a playlist for every channel the bot
(@botify) is invited to and will watch the conversation for Spotify song links.

Users can follow the playlists on their own Spotify account by using the
`/botify subscribe` command.

## Commands

`/botify auth` - Authenticate the bot user with Spotify. You should only have to
run this once.

`/botify subscribe` - Follow the current channel's collaborative playlist on
Spotify.

## Running locally

First, you'll want to create a `.env` file in the project root to load
environmental variables. Here's an example:

```
HOST=https://botify.localtunnel.me/

SLACK_CLIENT_ID=<slack app id>
SLACK_CLIENT_SECRET=<slack app secret>

SPOTIFY_CLIENT_ID=<spotify app id>
SPOTIFY_CLIENT_SECRET=<spotify app secret>
SPOTIFY_STATE=botify-rules
SPOTIFY_USERNAME=<your team's spotify user>

MONGO_URI=mongodb://<user>:<password>@example.com:12345
```

Start localtunnel:

```
npm install -g localtunnel
lt --port 8080 --subdomain botify
```

Start server:

```
npm run dev
```

## Data model

```json
{
  "teams": {
    "<team_id>": {
      "bot_spotify_access_token": "<string>",
      "bot_spotify_refresh_token": "<string>",
      "channels": {
        "<channel_id>": {
          "spotify_playlist_id": "<string>"
        }
      },
      "users": {
        "<user_id>": {
          "spotify_access_token": "<string>",
          "spotify_refresh_token": "<string>",
          "spotify_username": "<string>"
        }
      }
    }
  }
}
```

## TODO

- [ ] Make sure users can follow playlists
- [ ] Refactor flat file into persistent data store
- [ ] Add synchronous streaming
