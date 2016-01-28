# Botify

Botify is a Slack app that helps you create and update collaborative Spotify
playlists. It will automatically create a playlist for every channel the bot
(@botify) is invited to and will watch the conversation for Spotify song links.

## Commands

`/botify auth` - Authenticate the bot user with Spotify. You should only have to
run this once.

`/botify playlist` - Get a link to the playlist for the current channel.

## TODO

- [ ] Refactor flat file into persistent data store
- [ ] Add synchronous streaming
