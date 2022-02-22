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

  const clientID = 'fpdbev7ktti34dhr9cwpbxa17tfqc6';

  const responseType = 'code';
  const clientId = 'fpdbev7ktti34dhr9cwpbxa17tfqc6';
  const redirectUri = 'https://camphelp.ngrok.io/auth-callback';
  const state = Math.random();

  return (
    <div className="home-page page">
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
