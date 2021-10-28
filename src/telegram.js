const { Telegraf } = require('telegraf');
const moment = require('moment');
require('moment/locale/tr');
moment.locale('tr');
const { getNotFollowingYou } = require('./instagram');
const { snooze } = require('./utils');

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
//const telegramChatId = process.env.TELEGRAM_CHAT_ID;

const bot = new Telegraf(telegramBotToken);

const telegramInit = async function() {

    bot.start((ctx) => {
        ctx.reply(`Merhaba 😋`);
    });

    bot.command('chatid', async (ctx) => {
        ctx.reply(`<strong>Chat ID:</strong> <i>${ctx.chat.id}</i> 👍`, { parse_mode: "HTML" });
    });
    
    /*bot.on("text", async (ctx) => {
        ctx.reply("Merhaba :)");
    });*/

    bot.action('handleUnfollowButton', (ctx, next) => {
        return ctx.reply('Coming soon... 👍').then(() => next());
    });

    bot.command('unfollowerslist', async (ctx) => {
        await ctx.reply(`--- BAŞLANGIÇ ---`);
        await ctx.reply(`<strong>✦✦✦ 📅 ${moment().format('DD MMMM YYYY — HH:mm')} ✦✦✦</strong>`, { parse_mode: 'HTML' });
        await ctx.reply(`Instagram servisinden veriler çekiliyor... 💾🤖`);

        const items = await getNotFollowingYou();

        let counter = 0;
        for (let item of items) {
            if(counter === 10) {
                await ctx.reply(`Yükleniyor... 🧲`);
                await snooze(5000);
            }
            await ctx.reply(`<strong>• Kullanıcı Adı: </strong>${item.username}\n<strong>• Adı & Soyadı: </strong>${item.full_name}`, 
            { 
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        // Inline buttons. 2 side-by-side
                        [ { text: "Takipten Çık", callback_data: "handleUnfollowButton" }, { text: "Profil", url: `https://www.instagram.com/${item.username}` } ]
                    ]
                }
            });
            counter++;
        }

        ctx.reply(`Toplam <strong>${items.length}</strong> kişi sizi takip etmiyor ! 😥`, { parse_mode: 'HTML' });
        ctx.reply(`Bot işlemleri tamamlandı 👌`);
        await ctx.reply(`--- BİTİŞ ---`);
    })
    
    bot.launch();
}

exports.telegramInit = telegramInit