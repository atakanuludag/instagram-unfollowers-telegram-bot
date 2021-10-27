const fs = require('fs');
require('dotenv').config();
const { getNotFollowingYou } = require('./src');

(async () => {
    const intagramRes = await getNotFollowingYou();
})();
