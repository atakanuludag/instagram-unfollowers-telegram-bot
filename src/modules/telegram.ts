import { Telegraf } from 'telegraf';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import { snooze } from '@utils';
import instagramModule from '@modules/instagram'
import INotFollowingYou from '@interfaces/INotFollowingYou'

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramPostWaitTime = parseInt(process.env.TELEGRAM_POST_WAIT_TIME);


const telegramInit = async (): Promise<Telegraf> => new Telegraf(telegramBotToken);

const telegramBotLaunch = async (bot: Telegraf): Promise<void> => {

    let data: INotFollowingYou = {
        followers: [],
        following: [],
        notFollowingYou: []
    };

    bot.action(/handleUnfollowButton_+/, async (ctx, next) => {
        let replyText = 'Takipten çıkarma işlemi başarılı ✔️👍';
        const pk = ctx.match.input.substring(21);
        console.log('User PK Code: ', pk);

        const unfollow = await instagramModule.userUnfollow(pk);
        if(unfollow) {
            const search = data.notFollowingYou.find(u => Number(u.pk) == Number(pk));
            if(search) {
                replyText = `<strong>${search.username} (${search.full_name})</strong> kullanıcısı başarıyla takipten çıkarıldı ✔️👍`;
            }
        } else {
            replyText = `Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.`;
        }

        return ctx.reply(replyText, { parse_mode: 'HTML' }).then(() => next());
    });

    bot.command('unfollowerslist', async (ctx) => {
        await ctx.reply(`--- <strong>BAŞLANGIÇ</strong> ---`, { parse_mode: 'HTML' });
        await ctx.reply(`<strong>✦✦✦ 📅 ${moment().format('DD MMMM YYYY — HH:mm')} ✦✦✦</strong>`, { parse_mode: 'HTML' });
        await ctx.reply(`Instagram servisinden veriler çekiliyor... 💾🤖`);

        data = await instagramModule.getNotFollowingYou();
        const { followers, following, notFollowingYou } = data;

        let counter = 0;
        for (let item of notFollowingYou) {
            if(counter > 0 && counter % 10 === 0) {
                await ctx.reply(`Yükleniyor... 🧲`);
                await snooze(telegramPostWaitTime);
            }
            await ctx.reply(`<strong>• Kullanıcı Adı: </strong>${item.username}\n<strong>• Adı & Soyadı: </strong>${item.full_name}`, 
            { 
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        // Inline buttons. 2 side-by-side
                        [ { text: 'Takipten Çık', callback_data: `handleUnfollowButton_${item.pk}` }, { text: 'Profil', url: `https://www.instagram.com/${item.username}` } ]
                    ]
                }
            });
            counter++;
        }

        ctx.reply(`Toplam <strong>${notFollowingYou.length}</strong> kişi sizi takip etmiyor ! 😥\n<strong>Takipçiler: </strong> ${followers.length} kişi\n<strong>Takip Ettikleriniz: </strong> ${following.length} kişi`, { parse_mode: 'HTML' });
        ctx.reply(`Bot işlemleri tamamlandı 👌`);
        await ctx.reply(`--- <strong>BİTİŞ</strong> ---`, { parse_mode: 'HTML' });
    })

    //Instagram 2FA
    bot.on('text', (ctx) => {
        
    });
}

const instagramTwoFactorVerification = async (bot: Telegraf, chatId: number | null, text: string): Promise<any> => {
    let textt = "";

    console.log("buraya girdi");
    await bot.on("text", async (ctx) => {
        textt = ctx.message.text;
        //ctx.replyWithInvoice
        console.log("11", ctx.message.text);
    });

    /*return new Promise( async (resolve, reject) => {
        await bot.telegram.sendMessage(chatId, text);
        bot.on("text", async (ctx) => {
            console.log(ctx.message.text);
            resolve(ctx.message.text)
        });
    });*/
}

const telegramModule = {
    telegramInit,
    telegramBotLaunch,
    instagramTwoFactorVerification
}

export default telegramModule;