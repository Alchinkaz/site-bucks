export async function POST(request: Request) {
  try {
    const quizData = await request.json()

    if (!quizData.name || !quizData.phone) {
      return Response.json({ error: "Имя и телефон обязательны" }, { status: 400 })
    }

    const botToken = "8193287485:AAHtkqVemG8h9dV2gR0_bmQTkWcceuXQiaE"
    const chatId = "-4845825244"

    // Маппинг значений для читаемого вида
    const propertyTypeLabels: { [key: string]: string } = {
      apartment: "Квартира",
      house: "Частный дом",
      other: "Другое",
    }

    const areaLabels: { [key: string]: string } = {
      "20-50": "от 20 до 50 м²",
      "50-80": "от 50 до 80 м²",
      "80-150": "от 80 до 150 м²",
      "150+": "более 150 м²",
    }

    const timelineLabels: { [key: string]: string } = {
      soon: "В ближайшее время",
      month: "В течение 1 месяца",
      "3months": "В течение 1-3 месяцев",
      undefined: "Сроки пока не определены",
    }

    const cleanPhone = quizData.phone.replace(/\s+/g, "")

    const message = `📋 Новая заявка на смету с сайта

👤 Контактные данные:

• Имя: ${quizData.name}
• Телефон: ${cleanPhone}

🏠 Детали объекта:

• Тип недвижимости: ${propertyTypeLabels[quizData.propertyType] || quizData.propertyType}
• Площадь: ${areaLabels[quizData.area] || quizData.area}
• Количество комнат: ${quizData.rooms}
• Сроки начала: ${timelineLabels[quizData.timeline] || quizData.timeline}

📅 Дата заявки: ${new Date().toLocaleString("ru-RU", {
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
