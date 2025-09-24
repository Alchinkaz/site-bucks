import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { inter, rubik, daysOne } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Bucks - Обмен ветхой валюты в Астане по выгодному курсу",
  description:
    "Обмен поврежденных и ветхих банкнот в Астане. Принимаем доллары, евро, фунты с дефектами, печатями и повреждениями. Выгодный курс, быстрый обмен валют.",
  keywords:
    "обмен валют Астана, ветхие банкноты, поврежденные доллары, обмен евро, курс валют, валютный обмен, damaged currency exchange, старые банкноты",
  generator: "Bucks",
  openGraph: {
    title: "Bucks - Обмен ветхой валюты в Астане",
    description: "Обмен поврежденных и ветхих банкнот в Астане. Принимаем доллары, евро, фунты с дефектами.",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${rubik.variable} ${daysOne.variable} py-0 mb-0 bg-foreground`}>
      <body className="font-sans bg-gray-900 text-white">{children}</body>
    </html>
  )
}
