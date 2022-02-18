import React from 'react';

export default function Twitch() {
  const startListener = async () => {
    fetch('http://localhost:3000/twitch/follower-listener', {
      METHOD: 'GET',
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    }).then(res => console.log(res))
      .catch(res => {
        res.json().then(res => {
          console.log(res);
        });
      });
  };

  const getSubscriptions = async () => {
    fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      Authorization: 'Bearer ptnsqreinod7mc0jphecm3tw7c6gf8',
      'Client-Id': '',
    }).then(res => res.json())
      .then(res => console.log(res));
  };

  const responseType = 'code';
  const clientId = '920gsvpx1wcygfiwjswpkiy7hbl3rp';
  const redirectUri = 'https://camphelp.ngrok.io/auth-callback';
  const state = Math.random();

  return (
    <div className="home-page page">
      <button
        type="button"
        onClick={event => {
          event.preventDefault();
          startListener().catch(e => { console.log(e); });
        }}
      >
        start listener
      </button>
      <button
        type="button"
        onClick={event => {
          event.preventDefault();
          getSubscriptions().catch(e => { console.log(e); });
        }}
      >
        get subscriptions
      </button>
      <button
        type="button"
      >
        <a href={`https://id.twitch.tv/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`}>
          login with twitch
        </a>
      </button>
    </div>
  );
}
