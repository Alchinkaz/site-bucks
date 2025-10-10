"use client"

import type React from "react"

interface LinkifiedTextProps {
  text: string
  className?: string
}

// Преобразует URL и email в кликабельные ссылки, сохраняя переводы строк
export function LinkifiedText({ text, className }: LinkifiedTextProps) {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?/gi
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

  const parts: React.ReactNode[] = []

  const pushWithLineBreaks = (str: string) => {
    const lines = str.split("\n")
    lines.forEach((line, i) => {
      parts.push(line)
      if (i < lines.length - 1) parts.push(<br key={`br-${parts.length}`} />)
    })
  }

  // Сначала обрабатываем URL
  let lastIndex = 0
  const urlMatches = [...text.matchAll(urlRegex)]
  urlMatches.forEach((match, idx) => {
    const matchText = match[0]
    const start = match.index ?? 0
    const end = start + matchText.length

    if (start > lastIndex) {
      pushWithLineBreaks(text.slice(lastIndex, start))
    }

    // Проверяем, не является ли это email (не линкуем как URL)
    if (emailRegex.test(matchText)) {
      // Откатываем lastIndex и обработаем в email-проходе
      // Но выводим как обычный текст, чтобы сохранить порядок
      pushWithLineBreaks(matchText)
    } else {
      const href = matchText.startsWith("http") ? matchText : `https://${matchText}`
      parts.push(
        <a
          key={`url-${idx}-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-green-400 hover:text-green-300 underline break-words"
        >
          {matchText}
        </a>
      )
    }

    lastIndex = end
  })

  if (lastIndex < text.length) {
    pushWithLineBreaks(text.slice(lastIndex))
  }

  // Второй проход: заменяем email в уже добавленных текстовых частях
  const finalParts: React.ReactNode[] = []
  parts.forEach((node, i) => {
    if (typeof node !== "string") {
      finalParts.push(node)
      return
    }
    let str = node as string
    let last = 0
    const matches = [...str.matchAll(emailRegex)]
    matches.forEach((m, j) => {
      const mText = m[0]
      const s = m.index ?? 0
      const e = s + mText.length
      if (s > last) finalParts.push(str.slice(last, s))
      finalParts.push(
        <a
          key={`email-${i}-${j}-${s}`}
          href={`mailto:${mText}`}
          className="text-green-400 hover:text-green-300 underline break-words"
        >
          {mText}
        </a>
      )
      last = e
    })
    if (last < str.length) finalParts.push(str.slice(last))
  })

  return <div className={className}>{finalParts}</div>
}

export default LinkifiedText


