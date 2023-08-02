const express = require('express');
const messagesRouter = express.Router();
const messagesController = require('../controllers/messagesController');

messagesRouter.get('/:bottleId', messagesController.getBottleById);
messagesRouter.post('/', messagesController.postBottle);

module.exports = messagesRouter;
