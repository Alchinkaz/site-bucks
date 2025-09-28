import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { inter, rubik, daysOne } from "@/styles/fonts"

export const metadata: Metadata = {
  title: "Bucks - Обмен ветхой валюты в Астане по выгодному курсу",
  description:
    "Обмен поврежденных и ветхих банкнот в Астане. Принимаем доллары, евро, фунты с дефектами, печатями и повреждениями. Выгодный курс, быстрый обмен валют.",
  keywords:
    "обмен валют Астана, обмен валют в Астане, обмен валюты Астана, обмен валюты в Астане, обмен валют Казахстан, валютный обмен Астана, валютный обмен в Астане, пункт обмена валют Астана, обмен ветхой валюты, обмен поврежденной валюты, обмен старых банкнот, обмен рваных банкнот, обмен порванных купюр, обмен купюр со скотчем, обмен купюр с надписями, обмен купюр с печатями, банкноты с дефектами, поврежденные доллары, поврежденные евро, поврежденные фунты, damaged dollars, damaged euros, damaged pounds, обмен долларов, обмен евро, обмен фунтов, курс валют, курс валют на сегодня, курс валют Астана, курс доллара, курс доллара Астана, курс USD KZT, курс евро, курс EUR KZT, курс фунта, выгодный курс валют, лучший курс обмена, где обменять валюту, быстрый обмен валюты, срочный обмен валюты, безопасный обмен, проверка подлинности банкнот, обмен наличной валюты, обмен без комиссии*, обмен валют рядом, обмен валют центр Астаны, Esil Right Bank, Левый берег Астана, Нур-Султан обмен валют, Астана Нур-Султан, покупка валюты, продажа валюты,\nвалюта айырбастау Астана, валюта айырбастау Нұр-Сұлтан, валюта айырбастау пункті, Астанада валюта айырбастау, ескі банкноттарды айырбастау, жыртылған банкноттарды айырбастау, бүлінген долларлар, бүлінген еуро, валюта бағамы, бүгінгі валюта бағамы, доллар бағамы Астана, USD KZT бағамы, еуро бағамы, EUR KZT бағамы, тиімді айырбас, қауіпсіз айырбас, қолма-қол валюта айырбастау, комиссиясыз айырбас, тез айырбас, Астана сол жағалау айырбас, Есіл ауданы айырбас, ескі валютаны айырбастау, жарамсыз купюраларды айырбастау,\ncurrency exchange Astana, money exchange Astana, bureau de change Astana, currency exchange in Astana, exchange damaged banknotes, exchange old banknotes, exchange torn banknotes, damaged currency exchange, USD to KZT rate, EUR to KZT rate, dollar exchange rate Astana, euro exchange rate Astana, best exchange rate Astana, where to exchange currency in Astana, fast currency exchange, safe currency exchange, no commission exchange, cash currency exchange, verify banknotes authenticity, exchange near me Astana",
  generator: "Bucks",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/bucks-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/bucks-logo.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" }
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/bucks-logo.png", sizes: "180x180", type: "image/png" }
    ],
  },
  openGraph: {
    title: "Bucks - Обмен ветхой валюты в Астане",
    description: "Обмен поврежденных и ветхих банкнот в Астане. Принимаем доллары, евро, фунты с дефектами.",
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["kk_KZ", "en_US"],
    siteName: "Bucks",
    images: [
      {
        url: "/bucks-logo.png",
        width: 1200,
        height: 630,
        alt: "Bucks - обмен валют в Астане",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bucks - Обмен ветхой валюты в Астане",
    description:
      "Обмен поврежденных и ветхих банкнот: доллары, евро, фунты. Выгодный курс в Астане.",
    images: ["/bucks-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "KZ-AKM",
    "geo.placename": "Astana",
    "geo.position": "51.1605;71.4704",
    ICBM: "51.1605, 71.4704",
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
