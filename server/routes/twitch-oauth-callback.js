const express = require('express');
const qs = require('querystring');
const { TwitchDB } = require('../database/schemas');
const { requireAuth } = require('./middleware');

const router = express.Router();

module.exports = router;

router.get('/', requireAuth, (req, res) => {

  const reqData = qs.parse(req.url.split('?')[1]);

  TwitchDB.findOneAndUpdate({ username: req.user.username }, { code: reqData.code }, { new: true }, (err, data) => {
    if (!data) {
      const newTwitch = TwitchDB({
        username: req.user.username,
        code: reqData.code,
      });
      try {
        newTwitch.save({ code: reqData.code, username: req.user.username, _id: reqData.id }, (err) => {
          if (err) {
            return console.log('User was not created', err);
          }
        });
        return console.log('User was created', data);
      }
      catch (err) {
        return console.log('In the catch', err);
      }
    }
    console.log('User was found and token was updated');
    return res.redirect('twitch');
  });
});
