require('dotenv').config();
const { instagramInit } = require('./src/instagram');
const { telegramInit } = require('./src/telegram');

(async () => {
    instagramInit();
    telegramInit();
})();