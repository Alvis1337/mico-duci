const express = require('express');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener, EventSubMiddleware, ReverseProxyAdapter, EventSubChannelPollBeginSubscription} = require('@twurple/eventsub');
const {TwitchDB} = require("../database/schemas");
const {requireAuth} = require("./middleware");


const router = express.Router({
    caseSensitive: false
});

const crypto = require('crypto')
const app = express();
const port = 8080;

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

app.use(express.raw({          // Need raw message body for signature verification
    type: 'application/json'
}))

// ./opt/twitch event trigger follow -F https://camphelp.ngrok.io/twitch/follower-listener -s s3crfsafsafase7

router.post('/', (req, res) => {
    console.log(req.body.event)
    return res.sendStatus(200)
})

module.exports = router;

router.post('/', (req, res) => {
    console.log('we got a post bois')
    console.log(req, res)
})

router.get('/', (req, res) => {

    const listenerNgrok = async () => {
        const clientId = '920gsvpx1wcygfiwjswpkiy7hbl3rp';
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
                hostName: 'camphelp.ngrok.io', // The host name the server is available from
            }),
            secret: Math.random(),
        });

        // const userId = '62135290';
        //
        // const middleware = new EventSubMiddleware({
        //     apiClient,
        //     hostName: 'camphelp.ngrok.io',
        //     pathPrefix: '/login/twitch',
        //     secret: Math.random()
        // });

        //
        // const onlineSubscription = await listener.subscribeToChannelFollowEvents('62135290', event => {
        //   return console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
        // });
        //
        // const pollSubscription = await listener.subscribeToChannelFollowEvents('62135290', event => {
        //   console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
        // });

        try {

                await listener.listen();
        } catch (e) {

            await listener.unlisten();
            console.log('stopped listening');
            console.log(e);
        }
    };
    listenerNgrok()
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

