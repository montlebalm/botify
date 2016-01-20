# Running locally

Start localtunnel:

```
npm install -g localtunnel
lt --port 8080 --subdomain botify
```

Start server

```
node index.js
```

# Data model

```json
{
  "teams": {
    "<team_id>": {
      "bot_spotify_access_token": "<string>",
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
