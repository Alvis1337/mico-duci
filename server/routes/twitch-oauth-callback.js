const axios = require('axios');
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

    axios.post('https://id.twitch.tv/oauth2/token?'
        + 'client_id=fpdbev7ktti34dhr9cwpbxa17tfqc6'
        + '&'
        + 'client_secret=d3va2j8wk5ui61oj63ljksvta14vfn'
        + '&'
        + 'scope=channel:read:redemptions'
        + '&'
        + `code=${reqData.code}`
        + '&'
        + 'redirect_uri=https://camphelp.ngrok.io/auth-callback'
        + '&'
        + 'grant_type=authorization_code')
      .then(response => {
        TwitchDB.findOneAndUpdate({ username: req.user.username }, {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        }, { new: true }, (err, data) => {
          if (!data) {
            const newTwitch = TwitchDB({
              username: req.user.username,
              code: reqData.code,
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            });
            newTwitch.save({ username: req.user.username,
              code: reqData.code,
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            }, (err, data) => {
              if (!data) {
                return console.log('Something went wrong trying to create a new user with access token and stuffs');
              }
              if (err) {
                return console.log('error in the newtwitch with the access token', err);
              }
              return console.log('success');
            });
          }
          return console.log('success');
        });
      }).catch(e => console.log(e));

    return res.redirect('twitch');
  });
});
