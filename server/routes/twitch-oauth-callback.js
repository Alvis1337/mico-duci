const express = require('express');
const qs = require('querystring');
const { TwitchDB } = require('../database/schemas');

const router = express.Router({
  caseSensitive: false,
});

module.exports = router;

router.get('/', (req, res) => {

  const reqData = qs.parse(req.url.split('?')[1]);

  const newTwitch = TwitchDB(reqData);

  console.log(reqData.code);

  newTwitch.save(reqData.code, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
  });

  res.redirect('/home');

});
