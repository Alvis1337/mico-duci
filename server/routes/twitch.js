const express = require('express');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener, EventSubMiddleware, ReverseProxyAdapter, EventSubChannelPollBeginSubscription} = require('@twurple/eventsub');
const {TwitchDB} = require("../database/schemas");
const {requireAuth} = require("./middleware");


const router = express.Router({
    caseSensitive: false
});

// ./opt/twitch event trigger follow -F https://camphelp.ngrok.io/twitch/follower-listener -s s3crfsafsafase7

router.post('/', (req, res) => {
    console.log(req.body)

    const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
    const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';


    // Get JSON object from body, so you can process the message.
    if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
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

