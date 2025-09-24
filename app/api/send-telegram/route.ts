export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json()

    if (!name || !phone) {
      return Response.json({ error: "Имя и телефон обязательны" }, { status: 400 })
    }

    const botToken = "8193287485:AAHtkqVemG8h9dV2gR0_bmQTkWcceuXQiaE"
    const chatId = "-4845825244"

    const cleanPhone = phone.replace(/\s+/g, "")

    const message = `🏠 Новая заявка с сайта

👤 Имя: ${name}
📞 Телефон: ${cleanPhone}

📅 Дата: ${new Date().toLocaleString("ru-RU", {
      timeZone: "Asia/Almaty",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}`

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send telegram message")
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error sending telegram message:", error)
    return Response.json({ error: "Ошибка отправки сообщения" }, { status: 500 })
  }
}
