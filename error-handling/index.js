const statusMessages = require('../messages/errors.json');

const {
  messagesFor400s: {
    s401: { tokenExpiredError },
  },
} = statusMessages;

module.exports = app => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: 'This route does not exist' });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error

    // only render if the error ocurred before sending the response
    if (err) {
      console.log('RASSA', err);
      if (err?.inner?.name === 'TokenExpiredError') {
        res.status(402).json({ error: err.inner.name, message: tokenExpiredError });
      }

      res.status(400).json(err);
    }
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Internal server error. Check the server console',
      });
    }
  });
};
