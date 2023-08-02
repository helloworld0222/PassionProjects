const Bottle = require('../models/bottle');
const ClientError = require('../client-error.js');

exports.getBottleById = async (req, res, next) => {
  const bottleId = req.params.bottleId;
  if (!bottleId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ClientError(400, 'bottleId must be a MongoDB ObjectId');
  }
  try {
    const bottle = await Bottle.findById(bottleId);
    if (!bottle) {
      throw new ClientError(
        404,
        `cannot find bottle with bottleId ${bottleId}`
      );
    } else {
      res.json(bottle);
    }
  } catch (err) {
    next(err);
  }
};

exports.postBottle = async (req, res, next) => {
  const {
    messageTitle,
    senderName,
    recipientName,
    recipientEmail,
    playlistId,
    slides
  } = req.body;
  if (
    !messageTitle ||
    !senderName ||
    !recipientName ||
    !recipientEmail ||
    !playlistId ||
    !slides
  ) {
    throw new ClientError(400, 'all fields are required');
  }
  try {
    const newBottle = new Bottle({
      messageTitle,
      senderName,
      recipientName,
      recipientEmail,
      playlistId,
      slides
    });
    const bottle = await newBottle.save();
    res.status(201).json(bottle);
  } catch (err) {
    next(err);
  }
};
