const express = require('express');
const uploadsRouter = express.Router();
const uploadsController = require('../controllers/uploadsController');

uploadsRouter.post('/', uploadsController.uploadImage);

module.exports = uploadsRouter;
