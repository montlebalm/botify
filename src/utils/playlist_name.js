module.exports = function(team_name, channel_name) {
  var channel_name_clean = clean(channel_name);
  var team_name_clean = clean(team_name);

  return [team_name_clean, channel_name_clean].join('-');
};

function clean(text) {
  return text.toLowerCase()
    .replace(/-+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/\W/g, '');
}
