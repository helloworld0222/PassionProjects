const fetch = require('node-fetch');

exports.putPlaylist = (req, res, next) => {
  const { playlistId, token } = req.body;
  const init = {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    method: 'PUT'
  };
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, init)
    .then(result => result.text())
    .then(message => {
      res.status(200).json({ message: 'Playlist followed' });
    })
    .catch(err => next(err));
};
