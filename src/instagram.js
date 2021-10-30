const { IgApiClient, IgLoginTwoFactorRequiredError } = require('instagram-private-api');
const Bluebird = require('bluebird');
const Inquirer = require('inquirer');

const ig = new IgApiClient();

const igUserName = process.env.IG_USERNAME;
const igPassword = process.env.IG_PASSWORD;
let pk = null;

ig.state.generateDevice(igUserName);


const login = async function() {
    return Bluebird.try(() => ig.account.login(igUserName, igPassword)).catch(
        IgLoginTwoFactorRequiredError,
        async err => {
            const { username, totp_two_factor_on, two_factor_identifier } = err.response.body.two_factor_info;
            // decide which method to use
            const verificationMethod = totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
            // At this point a code should have been sent
            // Get the code
            const { code } = await Inquirer.prompt([
                {
                    type: 'input',
                    name: 'code',
                    message: `Enter code received via ${verificationMethod === '1' ? 'SMS' : 'TOTP'}`,
                },
            ]);
            // Use the code to finish the login process
            return ig.account.twoFactorLogin({
                username,
                verificationCode: code,
                twoFactorIdentifier: two_factor_identifier,
                verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
                trustThisDevice: '1', // Can be omitted as '1' is used by default
            });
        },
    ).catch(e => console.error('An error occurred while processing two factor auth', e, e.stack));
}

const getAllItemsFromFeed = async function(feed) {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}

const userUnfollow = async function(unfollowUserPk) {
    try {
        await ig.friendship.destroy(unfollowUserPk);
        return true;
    }
    catch(err){
        return false;
    }
}

const getNotFollowingYou = async function() {

    const followersFeed = ig.feed.accountFollowers(pk);
    const followingFeed = ig.feed.accountFollowing(pk);

    const followers = await getAllItemsFromFeed(followersFeed);
    const following = await getAllItemsFromFeed(followingFeed);

    const followersUsername = new Set(followers.map(({ username }) => username));

    const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username));

    console.log('Followers Count: ', followers.length);
    console.log('Following Count: ', following.length);
    console.log('Not Following You Count: ', notFollowingYou.length);

    return {
        followers,
        following,
        notFollowingYou
    };
}

const instagramInit = async function() {
    const instagramLogin = await login();
    pk = instagramLogin.pk;
}

exports.instagramInit = instagramInit;
exports.getNotFollowingYou = getNotFollowingYou;
exports.userUnfollow = userUnfollow;