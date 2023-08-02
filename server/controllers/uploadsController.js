const uploadsMiddleware = require('../middleware/uploads-middleware');

exports.uploadImage = (req, res) => {
  uploadsMiddleware(req, res, function (err) {
    if (err) {
      // Handle error
      res.status(500).send(err);
    } else {
      // Handle success
      const url = req.file.location;
      res.status(201).json({ imageUrl: url });
    }
  });
};
