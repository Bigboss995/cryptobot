const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ================================
// 🔐 TON TOKEN TELEGRAM
// ================================
const TOKEN = "8531990370:AAFjmiOk5Fr8KGOWPpXqkLU1Ghm032hKaiU";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// ================================
// 📌 Route test
// ================================
app.get("/", (req, res) => {
    res.send("Bot is running on Render!");
});

// ================================
// 📌 Webhook Telegram
// ================================
app.post("/webhook", async (req, res) => {
    const message = req.body.message;

    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text.toLowerCase();

        if (text.includes("bonjour")) {
            await sendMessage(chatId, "Salut ! Comment puis-je t’aider ? 😊");
        } else if (text.includes("info")) {
            await sendMessage(chatId, "Voici les infos du bot 📊");
        } else {
            await sendMessage(chatId, "Commande non reconnue ❌");
        }
    }

    res.sendStatus(200);
});

// ================================
// ✉️ FONCTION POUR ENVOYER UN MESSAGE
// ================================
async function sendMessage(chatId, text) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text,
    });
}

// ================================
// 🚀 START SERVER
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log("Bot server running on port " + PORT);

    // Set Telegram webhook automatically at startup
    try {
        await axios.get(
            `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
        );
        console.log("Webhook registered:", WEBHOOK_URL);
    } catch (error) {
        console.error("Webhook error:", error.response?.data || error.message);
    }
});
