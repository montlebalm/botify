# Data model

```json
{
  "teams": {
    "<team_id>": {
      "users": {
        "<user_id>": {
          "channels": {
            "<channel_id>": {
              "spotify_playlist_id": "<string>"
            }
          },
          "spotify_access_token": "<string>",
          "spotify_refresh_token": "<string>",
          "spotify_username": "<string>"
        }
      }
    }
  }
}
```
