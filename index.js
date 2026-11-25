const { Telegraf } = require("telegraf");

const bot = new Telegraf(
  process.env.TELEGRAM_BOT_TOKEN ||
  process.env.BOT_TOKEN
);

bot.start(ctx => ctx.reply("🎁 Giftsells запущен!"));

bot.on("inline_query", async ctx => {
  try {
    const query = ctx.inlineQuery.query.trim();

    const match = query.match(
      /^(https?:\/\/t\.me\/nft\/[A-Za-z0-9_-]+)\s+(\d+(?:\.\d+)?)\s*(stars?|ton)?$/i
    );

    if (!match) {
      return ctx.answerInlineQuery([{
        type: "article",
        id: "help",
        title: "Создать NFT-предложение",
        description: "Введите ссылку на NFT и цену",
        input_message_content: {
          message_text:
            "🎁 Giftsells\n\nФормат: ссылка на NFT + цена\n\nПример:\nhttps://t.me/nft/ViceCream-274196 500"
        }
      }], { cache_time: 0 });
    }

    const nft = match[1].split("/").pop();
    const price = match[2];
    const currency = (match[3] || "stars").toUpperCase();

    await ctx.answerInlineQuery([{
      type: "article",
      id: "offer",
      title: `${nft} — ${price} ${currency}`,
      description: "Создать предложение",
      input_message_content: {
        message_text:
          `🎁 Предложение на подарок\n\n` +
          `NFT: ${nft}\n` +
          `Цена: ${price} ${currency}\n\n` +
          `Ссылка: ${match[1]}\n\n` +
          `Создано через Giftsells`
      },
      reply_markup: {
        inline_keyboard: [[
          { text: "Открыть NFT", url: match[1] }
        ]]
      }
    }], { cache_time: 0 });

  } catch (error) {
    console.error("Inline error:", error);
  }
});

bot.catch(err => console.error(err));

bot.launch();
console.log("Giftsells inline started");
