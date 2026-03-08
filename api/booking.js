export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, date, time, comment } = req.body || {};

    const safeName = String(name || "").trim();
    const safePhone = String(phone || "").trim();
    const safeDate = String(date || "").trim();
    const safeTime = String(time || "").trim();
    // const safeComment = String(comment || "").trim();

    if (!safeName || !safePhone || !safeDate || !safeTime) {
      return res.status(400).json({ error: "Заполните обязательные поля" });
    }

    const message =
      `📌 Новая заявка на примерку\n\n` +
      `Имя: ${safeName}\n` +
      `Телефон: ${safePhone}\n` +
      `Дата: ${safeDate}\n` +
      `Время: ${safeTime}`;
    //   `Комментарий: ${safeComment || "—"}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram error:", telegramData);
      return res.status(500).json({ error: "Ошибка отправки в Telegram" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}