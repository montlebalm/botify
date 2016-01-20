# Data model

```json
{
  teams: {
    <team_id>: {
      users: {
        <user_id>: {
          channels: {
            <channel_id>: {
              spotify_playlist_id: String,
            }
          },
          spotify_access_token: String,
          spotify_refresh_token: String,
          spotify_user_id: String,
        }
      }
    }
  }
}
```
