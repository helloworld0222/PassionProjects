const sgMail = require('@sendgrid/mail');
const Bottle = require('../models/bottle');
const ClientError = require('../client-error.js');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (req, res, next) => {
  const { bottleId } = req.body;
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
      const { messageTitle, senderName, recipientName, recipientEmail } =
        bottle;
      const messageUrl = `${process.env.APP_ORIGIN}recipient`;
      const msg = {
        to: recipientEmail,
        from: 'messageforamatey@gmail.com',
        subject: messageTitle,
        html: `
        <p>Ahoy ${recipientName}, you have a message in a bottle from ${senderName}!</p>
        <p>Bottle ID: <strong>${bottleId}</strong>.</p>
        <a href=${messageUrl}>View your message!</a>
        `
      };
      sgMail
        .send(msg)
        .then(() => {
          res.status(200).json({ message: 'Email sent' });
        })
        .catch(err => next(err));
    }
  } catch (err) {
    next(err);
  }
};
