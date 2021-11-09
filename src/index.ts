import dotenv from 'dotenv';
dotenv.config();

import { telegramModule, instagramModule } from '@modules';

/*const { instagramInit } = require('./src/instagram');
const { telegramInit } = require('./src/telegram');
*/
(async () => {
    
    const bot = await telegramModule.telegramInit();
    
    bot.telegram.sendMessage

    bot.on('message', async function (ctx, next) {
        await ctx.telegram.sendMessage(ctx.message.chat.id,
          "test"
        )


        bot.on("text", (ctx) => {
            const test = ctx.message.text;
            console.log("atiiii", test);
        });

    });

    
    //telegramModule.telegramBotLaunch(bot);


    //instagramModule.instagramLogin(bot);

    bot.launch();
})();