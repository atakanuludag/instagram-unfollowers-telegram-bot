import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import { telegramModule, instagramModule } from '@modules';

import { Markup, Telegraf  } from 'telegraf';

/*const { instagramInit } = require('./src/instagram');
const { telegramInit } = require('./src/telegram');
*/
(async () => {
    
    let instagramLogin = false;
    let chatId: number | null = null;
    const bot = await telegramModule.telegramInit();

    bot.start( async (ctx) => {
        if(!ctx.message) return;
        ctx.reply(`Merhaba 😋`);
        console.log("Bot started.");

        chatId = ctx.message.chat.id;

        /*bot.on('text', (ctx) => {
            console.log(ctx.message.text);
        });*/

        const message = await bot.telegram.sendMessage(chatId, 'message');
        const { message_id } = message;
        
        //ctx.reply("response", Markup.forceReply(message_id));
  

        

        //const code = await telegramModule.instagramTwoFactorVerification(bot, chatId, "KODU GİR");

        //instagramModule.instagramLogin(bot, chatId);

        /*bot.on('text', (ctx) => {
            console.log(ctx.message.text);
        });
       
        //const a = await ctx.reply("kodu girin");*/
        

        //console.log(a);
        //telegraf nodejs Force Reply
        //https://github.com/telegraf/telegraf/issues/705
        //telegramModule.telegramBotLaunch(bot);
        //instagramModule.instagramLogin(bot);

    });

    /*bot.on('message', async function (ctx, next) {
        await ctx.telegram.sendMessage(ctx.message.chat.id,
          "otomatik mesaj"
        )
    });*/   
    
    //bot.telegram.sendMessage

    bot.launch();
})();