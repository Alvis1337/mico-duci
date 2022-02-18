const express = require('express');
const qs = require('querystring');
const { TwitchDB } = require('../database/schemas');

const router = express.Router({
  caseSensitive: false,
});

module.exports = router;

router.get('/', (req, res) => {

  const reqData = qs.parse(req.url.split('?')[1]);

  const newTwitch = TwitchDB({
    username: req.user.username,
    code: reqData.code,
  });

  newTwitch.save({ code: reqData.code, username: req.user.username }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });

  res.redirect('/home');

});
