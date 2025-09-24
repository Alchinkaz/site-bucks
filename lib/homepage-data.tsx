export interface Review {
  id: string
  name: string
  text: string
  rating: number
  date: string
}

export interface ImageGalleryItem {
  id: string
  url: string
  alt: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  order: number
}

export interface ContactsSection {
  phone: string
  email: string
  buttonText: string
  buttonLink: string
  mapIframe: string
}

export interface CurrencyRate {
  currency: string
  buyRate: number
  sellRate: number
  buyChange?: number
  sellChange?: number
}

export interface HomepageData {
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroButtonLink: string
  heroImage: string

  // About Company Section
  aboutImage: string
  aboutText: string
  aboutDescription: string

  // Statistics Section
  stat1Title: string
  stat1Subtitle: string
  stat2Title: string
  stat2Subtitle: string
  stat3Title: string
  stat3Subtitle: string

  // Reviews Section
  reviews: Review[]

  // Image Gallery Section
  imageGallery: ImageGalleryItem[]

  faqItems: FAQItem[]

  // Contacts Section
  contactsSection: ContactsSection

  // Currency Rates Section
  currencyRates: CurrencyRate[]

  tickerTexts?: string[]
}

// Default homepage data
const defaultHomepageData: HomepageData = {
  heroTitle: "Обмен ветхой валюты в Астане по выгодному курсу",
  heroSubtitle: "Принимаем доллары, евро, фунты, франки и другие валюты с дефектами, печатями и повреждениями.",
  heroButtonText: "Получить консультацию",
  heroButtonLink: "https://wa.me/77053333082",
  heroImage: "/money-bills-background.jpg",

  aboutImage: "/placeholder.svg?height=270&width=480",
  aboutText: "При вас оценим состояние купюр и обменяли их по лучшему курсу",
  aboutDescription:
    "Не каждый банк в Казахстане принимает поврежденные и ветхие банкноты. Мы специализируемся на обмене валют любого состояния: надорванные, выцветшие, с печатями, пятнами или другими повреждениями. Минимальная сумма обмена от 100$/€/£.",

  stat1Title: "5+ лет",
  stat1Subtitle: "Опыт работы на валютном рынке",
  stat2Title: "15+ валют",
  stat2Subtitle: "Принимаем к обмену",
  stat3Title: "1000+",
  stat3Subtitle: "Довольных клиентов",

  reviews: [
    {
      id: "1",
      name: "Алия Нурланова",
      text: "Обратилась с поврежденными долларами, которые не принимали в банках. Здесь быстро оценили и обменяли по хорошему курсу. Очень довольна сервисом!",
      rating: 5,
      date: "2 дня назад",
    },
    {
      id: "2",
      name: "Марат Касымов",
      text: "Отличное место для обмена ветхих банкнот. Профессиональный подход, честные курсы. Рекомендую всем, кто столкнулся с проблемой поврежденной валюты.",
      rating: 5,
      date: "1 неделю назад",
    },
    {
      id: "3",
      name: "Динара Абдуллаева",
      text: "Быстро и качественно обменяли евро с небольшими повреждениями. Курс оказался даже лучше, чем ожидала. Спасибо за профессионализм!",
      rating: 5,
      date: "3 дня назад",
    },
  ],

  imageGallery: [
    {
      id: "1",
      url: "/modern-office-interior.png",
      alt: "Офис обмена валют",
    },
    {
      id: "2",
      url: "/currency-exchange.png",
      alt: "Процесс обмена валют",
    },
    {
      id: "3",
      url: "/damaged-banknotes.jpg",
      alt: "Поврежденные банкноты",
    },
  ],

  faqItems: [
    {
      id: "1",
      question: "Какие валюты вы принимаете к обмену?",
      answer:
        "Мы принимаем доллары США, евро, британские фунты, швейцарские франки, японские йены, российские рубли и многие другие валюты. Также работаем с поврежденными и ветхими банкнотами.",
      order: 1,
    },
    {
      id: "2",
      question: "Принимаете ли вы поврежденные банкноты?",
      answer:
        "Да, мы специализируемся на обмене поврежденных банкнот. Принимаем купюры с надрывами, потертостями, печатями, пятнами и другими дефектами, которые не принимают в обычных банках.",
      order: 2,
    },
    {
      id: "3",
      question: "Какой курс обмена вы предлагаете?",
      answer:
        "Мы предлагаем конкурентные курсы, которые обновляются ежедневно в зависимости от рыночной ситуации. Курс может варьироваться в зависимости от состояния банкнот и суммы обмена.",
      order: 3,
    },
    {
      id: "4",
      question: "Нужны ли документы для обмена?",
      answer:
        "Для обмена валют на сумму свыше определенного лимита требуется предъявление документа, удостоверяющего личность. Для небольших сумм документы могут не потребоваться.",
      order: 4,
    },
    {
      id: "5",
      question: "Как долго происходит процедура обмена?",
      answer:
        "Обычно процедура обмена занимает от 5 до 15 минут, в зависимости от количества банкнот и необходимости их дополнительной проверки. Поврежденные купюры могут потребовать больше времени для оценки.",
      order: 5,
    },
    {
      id: "6",
      question: "Есть ли минимальная сумма для обмена?",
      answer:
        "Минимальной суммы для обмена нет. Мы готовы обменять как крупные суммы, так и отдельные банкноты. Однако для очень маленьких сумм курс может быть менее выгодным.",
      order: 6,
    },
  ],

  contactsSection: {
    phone: "+7 (777) 323-17-15",
    email: "shotkin.azat@gmail.com",
    buttonText: "Получить консультацию",
    buttonLink: "https://wa.me/77053333082",
    mapIframe: `<iframe
      src="https://yandex.kz/map-widget/v1/?from=mapframe&ll=76.952539%2C43.218606&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzE2ODMwMhIg0prQsNC30LDSm9GB0YLQsNC90LDQvdGC0YsiCg0r5JlCFdvyLEI%2C&source=mapframe&utm_source=mapframe&z=10"
      width="100%"
      height="100%"
      frameBorder="1"
      allowFullScreen={true}
      style={{ position: "relative", borderRadius: "1rem" }}
    />`,
  },

  currencyRates: [
    {
      currency: "USD",
      buyRate: 538.1,
      sellRate: 540.5,
      buyChange: -0.5,
      sellChange: 1,
    },
    {
      currency: "EUR",
      buyRate: 626.5,
      sellRate: 630.5,
      buyChange: 6.5,
      sellChange: -0.5,
    },
    {
      currency: "RUB",
      buyRate: 6.57,
      sellRate: 6.69,
      buyChange: 0,
      sellChange: 0.02,
    },
  ],

  tickerTexts: [
    "Выгодный курс обмена валют",
    "Принимаем поврежденные купюры",
    "Доллары, евро, фунты и другие валюты",
    "Быстрый и надежный обмен",
    "Работаем с ветхими банкнотами",
    "Лучшие условия в Астане",
  ],
}

const STORAGE_KEY = "homepage-data"

// In-memory storage for homepage data
let homepageData: HomepageData = { ...defaultHomepageData }

// Load data from localStorage on initialization
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      homepageData = { ...defaultHomepageData, ...JSON.parse(stored) }
    } catch (error) {
      console.error("Error loading homepage data from localStorage:", error)
    }
  }
}

export function getHomepageData(): HomepageData {
  // Always check localStorage for latest data
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        homepageData = { ...defaultHomepageData, ...JSON.parse(stored) }
      } catch (error) {
        console.error("Error loading homepage data from localStorage:", error)
      }
    }
  }
  return { ...homepageData }
}

export function updateHomepageData(data: Partial<HomepageData>): HomepageData {
  console.log("Updating homepage data:", data)
  homepageData = { ...homepageData, ...data }

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(homepageData))
    console.log("Data saved to localStorage")

    window.dispatchEvent(
      new CustomEvent("homepage-data-updated", {
        detail: { ...homepageData, timestamp: Date.now() },
      }),
    )
    console.log("Event dispatched to notify components")
  }

  return { ...homepageData }
}
