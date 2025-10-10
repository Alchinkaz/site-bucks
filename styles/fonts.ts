import { Inter, Rubik, Days_One } from "next/font/google"

export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
})

export const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-rubik",
})

export const daysOne = Days_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-days-one",
})
