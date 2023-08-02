const express = require('express');
const playlistRouter = express.Router();
const playlistController = require('../controllers/playlistController');

playlistRouter.put('/', playlistController.putPlaylist);

module.exports = playlistRouter;
