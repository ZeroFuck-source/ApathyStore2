const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const TOKEN = "8454436921:AAFfR_y-mhzFmIwD3rSDQRdEOCUOK-kFutg";  // <--  токен Бота
const bot = new TelegramBot(TOKEN, { polling: true });

// ─────────────────────────────────────────────
// КНОПКИ (INLINE KEYBOARD)
// ─────────────────────────────────────────────
const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🛒 Магазин", callback_data: "shop" },
        { text: "📦 Мои заказы", callback_data: "orders" }
      ],
      [
        { text: "👤 Профиль", callback_data: "profile" },
        { text: "🆘 Поддержка", callback_data: "support" }
      ]
    ]
  }
};

// ─────────────────────────────────────────────
// /start
// ─────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 Привет, <b>${msg.from.first_name}</b>!  
Добро пожаловать в <b>ApathyStore Bot</b> 💜

Выбери действие ниже:`,
    { parse_mode: "HTML", ...mainMenu }
  );
});

// ─────────────────────────────────────────────
// ОБРАБОТКА КНОПОК
// ─────────────────────────────────────────────
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "shop") {
    bot.sendMessage(chatId, "🛒 Магазин ApathyStore:\nhttps://ApathyStore.site");
  }

  if (data === "orders") {
    bot.sendMessage(chatId, "📦 У вас пока нет заказов.\n(Скоро добавим!)");
  }

  if (data === "profile") {
    bot.sendMessage(
      chatId,
      `👤 <b>Ваш профиль:</b>\nИмя: ${query.from.first_name}\nID: ${query.from.id}`,
      { parse_mode: "HTML" }
    );
  }

  if (data === "support") {
    bot.sendMessage(chatId, "🆘 Поддержка: @AlwaysApathiec");
  }

  bot.answerCallbackQuery(query.id); // закрыть "загрузка"
});

// ─────────────────────────────────────────────
// НЕОБЯЗАТЕЛЬНЫЙ ВЕБХУК (если хочешь связать сайт)
// ─────────────────────────────────────────────
const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  const order = req.body;

  const text = `
🛒 *Новый заказ!*

👤 Пользователь: *${order.user?.name}*
💵 Сумма: *${order.totalRub} ₽*

📦 Товары:
${order.items.map(i => `• ${i.title} × ${i.qty}`).join("\n")}
`;

  bot.sendMessage(order.telegram_id || YOUR_ID, text, { parse_mode: "Markdown" });
  res.send({ ok: true });
});

app.listen(3000, () => console.log("BOT + Webhook running on :3000"));
