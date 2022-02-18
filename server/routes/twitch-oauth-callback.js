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

  console.log(reqData);

  TwitchDB.findByIdAndUpdate(reqData._id, {code: reqData.code}, (), (err, id) => {
  //  updating a user
  })

  TwitchDB.findById(reqData._id, (err, id) => {
    if (err) {
      console.log('did not found the user');
      newTwitch.save({ code: reqData.code, username: req.user.username, _id: id }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    } else {
      console.log('found the user');
      newTwitch.update({ code: reqData.code, username: req.user.username, _id: id }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    }
  });

  res.redirect('/home');

});
