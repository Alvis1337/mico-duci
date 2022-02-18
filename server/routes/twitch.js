const express = require('express');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener, EventSubMiddleware, ReverseProxyAdapter} = require('@twurple/eventsub');
const {EventSubChannelPollBeginSubscription} = require("@twurple/eventsub/lib/subscriptions/EventSubChannelPollBeginSubscription");
const {TwitchDB} = require("../database/schemas");
const {requireAuth} = require("./middleware");


const router = express.Router({
    caseSensitive: false
});

const app = express()

module.exports = router;

router.get('/', (req, res) => {

    const listenerNgrok = async () => {
        const clientId = '920gsvpx1wcygfiwjswpkiy7hbl3rp';
        const clientSecret = 'e5kplo8ihwe5b0aotszy3l1zx47g84';

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

        const userId = '62135290';

        const middleware = new EventSubMiddleware({
            apiClient,
            hostName: 'camphelp.ngrok.io',
            pathPrefix: '/login/twitch',
            secret: Math.random()
        });


        // const onlineSubscription = await listener.subscribeToChannelFollowEvents('62135290', event => {
        //   console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
        // });
        //
        // const pollSubscription = await listener.subscribeToChannelFollowEvents('62135290', event => {
        //   console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
        // });

        try {
            await middleware.apply(app);
            app.listen(8000, '127.0.0.1', 1, async () => {
                await middleware.markAsReady();
                await listener.subscribeToChannelPollBeginEvents(userId)
                await listener.listen();
            });
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

