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
    </div>
  );
}
