require('dotenv/config');
const mongoose = require('mongoose');
const express = require('express');
const errorMiddleware = require('./middleware/error-middleware');
const staticMiddleware = require('./middleware/static-middleware');
const path = require('path');

const messagesRoutes = require('./routes/messages');
const uploadsRoutes = require('./routes/uploads');
const sendRoutes = require('./routes/send');
const playlistRoutes = require('./routes/playlist');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' https://*.spotify.com https://www.google-analytics.com https://*.ingest.sentry.io/ https://stats.g.doubleclick.net"
  );
  next();
});

app.use('/api/messages', messagesRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/send', sendRoutes);
app.use('/api/playlist', playlistRoutes);

app.use(staticMiddleware);

app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
