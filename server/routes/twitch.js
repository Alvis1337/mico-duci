const express = require('express');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener, EventSubMiddleware, ReverseProxyAdapter, EventSubChannelPollBeginSubscription} = require('@twurple/eventsub');
const {TwitchDB} = require("../database/schemas");
const {requireAuth} = require("./middleware");
const axios = require("axios");


const router = express.Router({
    caseSensitive: false
});

const newRedemption = (reward) => {
    axios.post('http://chris.vpn.alphatech-computing.com/api/blink-api/', {
            blink_pattern: reward
    })
        .then(response => {
            if (response.ok) {
            return response.json()
            } else {
                return Promise.reject(response)
            }
        })
        .then(response => {
            return console.log(response)
        })
        .catch(response => {
            return console.log(response)
        });
}

// ./opt/twitch event trigger follow -F https://twitch-api.uttensio.com/twitch/follower-listener -s s3crfsafsafase7

router.post('/', (req, res) => {

    const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
    const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
    const apiData = req.body
    if (apiData.subscription.type === 'channel.channel_points_custom_reward_redemption.add') {
        console.log('///////////////////')
        console.log('was channel reward')
        console.log(apiData.event.reward.id)
        switch(apiData.event.reward.id){
            case "e56867fa-e535-4003-a582-dcb1bcf3d1bd": {
                newRedemption('hydrate')
                break;
            }
            case "83b6f40a-f8d3-48e1-8dfe-84d29ab81610": {
                newRedemption('albert')
                break;
            }
            case "85e65ead-606a-45a8-b4fa-0e8d8fa41f7d": {
                newRedemption('wheel-spin')
                break;
            }
            case "532e76ab-a008-4272-8c0d-e49e29ab03da": {
                newRedemption('hero-request')
                break;
            }
            case "6241542d-97fb-494c-8b40-1d13f9c0f609": {
                newRedemption('mod-poll')
                break;
            }
            case "ac1d9828-68c8-4bfb-9747-30e4342a0267": {
                newRedemption('fireball')
                break;
            }
            case "0f9a7f4b-b0e1-4412-bbbf-397988f2c68c": {
                newRedemption('tarot-reading')
                break;
            }
            case "10d047fd-0cb4-4b88-8d06-35b56bba90fe": {
                newRedemption('lose-glasses-5')
                break;
            }
        }
        return
    } else {
        console.log('///////////////////')
        console.log('was not channel reward')
    }

    if (apiData.subscription.type === 'channel.follow') {
        newFollower()
    } else {
        console.log('///////////////////')
        console.log('was not a follower')
    }

    if (apiData.subscription.type === 'channel.subscribe') {
        console.log('///////////////////')
        console.log('was a new sub')
    } else {
        console.log('///////////////////')
        console.log('was not a new sub')
    }

    // Get JSON object from body, so you can process the message.
    if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
        console.log('was challenge')
        return res.status(200).send(req.body.challenge);
    }
    return res.sendStatus(200)
})

module.exports = router;

router.post('/', (req, res) => {
    console.log('we got a post bois')
    console.log(req, res)
})

router.get('/', (req, res) => {

    const listenerNgrok = async () => {
        const clientId = 'fpdbev7ktti34dhr9cwpbxa17tfqc6';
        const clientSecret = '747efw41jzp6qds5mslatgo2muyr0e';

        const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret, {
            currentScopes: EventSubChannelPollBeginSubscription
        });
        const apiClient = new ApiClient({authProvider});

        const listener = new EventSubListener({
            apiClient,
            logger: {
                minLevel: 'debug',
            },
            adapter: new ReverseProxyAdapter({
                hostName: 'twitch-api.uttensio.com', // The host name the server is available from
            }),
            secret: Math.random(),
        });

        try {

                await listener.listen();
        } catch (e) {

            await listener.unlisten();
            console.log('stopped listening');
            console.log(e);
        }
    };
    // listenerNgrok()
});

router.get('/get', requireAuth, (req, res) => {
    TwitchDB.find({username: req.user.username}, (err, user) => {
        if (err) {
            res.status(400).send({ message: 'Get code failed', err });
        } else {
            if (!user[0]) {
                res.status(400).send({message: 'This user has not done twitch oauth'})
            } else {
                res.send({ user });
            }
        }
    });
});

