require('dotenv').config();
const { telegramInit } = require('./src/telegram');

(async () => {
    telegramInit();
})();