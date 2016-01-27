var _bots = {};

module.exports = {
  has: function(bot) {
    return !_bots[bot.config.token];
  },
  track: function(bot) {
    _bots[bot.config.token] = bot;
  },
};
