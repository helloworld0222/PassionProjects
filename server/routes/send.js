const express = require('express');
const sendRouter = express.Router();
const sendController = require('../controllers/sendController');

sendRouter.post('/', sendController.sendEmail);

module.exports = sendRouter;
