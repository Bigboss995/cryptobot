const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ================================
// 🔐 TOKEN TELEGRAM via Render
// ================================
const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const WEBHOOK_URL = "https://cryptobot-1-mpb2.onrender.com/webhook";

// ================================
// ✔ SETUP WEBHOOK
// ================================
app.get("/", (req, res) => {
    res.send("Bot is running!");
});

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
// ✉️ ENVOI MESSAGE
// ================================
async function sendMessage(chatId, text) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text,
    });
}

// ================================
// 🚀 START
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bot server running on port " + PORT));
