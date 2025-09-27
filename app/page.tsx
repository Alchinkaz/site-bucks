"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Mail } from "lucide-react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import BookingForm from "@/components/booking-form"
import MapComponent from "@/components/map-component" // Import the new MapComponent
import { useState, useEffect } from "react"
import { getHomepageNews } from "@/lib/supabase-news"
import { getHomepageData, type HomepageData } from "@/lib/supabase-homepage"
import { getContactsData } from "@/lib/supabase-contacts"

export default function Home() {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageVisible, setIsImageVisible] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [contactsData, setContactsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const openBookingForm = () => {
    setIsBookingFormOpen(true)
  }

  const closeBookingForm = () => {
    setIsBookingFormOpen(false)
  }

  const getCurrentDate = () => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    return `${day}.${month}.${year}`
  }

  const fetchCurrentRates = async (forceUpdate = false) => {
    try {
      console.log("💰 Fetching currency rates, forceUpdate:", forceUpdate)
      const timestamp = Date.now()
      const url = `/api/currency-rates?t=${timestamp}${forceUpdate ? "&force=true" : ""}`
      console.log("💰 API URL:", url)
      
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      
      console.log("💰 Response status:", response.status, response.ok)
      
      if (response.ok) {
        const rates = await response.json()
        console.log("💰 Received fresh rates:", rates)

        if (homepageData) {
          const updatedData = {
            ...homepageData,
            currencyRates: rates.rates,
          }
          setHomepageData(updatedData)
          setLastUpdated(rates.lastUpdated)
          console.log("💰 Currency rates updated successfully in state")
        } else {
          console.log("💰 No homepageData available to update")
        }
      } else {
        console.error("💰 Failed to fetch currency rates, status:", response.status)
      }
    } catch (error) {
      console.error("❌ Ошибка при получении курсов валют:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log(" Loading initial homepage data")
        
        const [homepage, contacts] = await Promise.all([
          getHomepageData(),
          getContactsData()
        ])
        
        setHomepageData(homepage)
        setContactsData(contacts)
        
        fetchCurrentRates(true)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log(" Page became visible, updating currency rates")
        fetchCurrentRates(true)
      }
    }

    const handleFocus = () => {
      console.log(" Page focused, updating currency rates")
      fetchCurrentRates(true)
    }

    const refreshInterval = setInterval(
      () => {
        console.log(" Auto-refreshing currency rates")
        fetchCurrentRates(true)
      },
      5 * 60 * 1000,
    ) // 5 minutes

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      clearInterval(refreshInterval)
    }
  }, [])

  const [newsItems, setNewsItems] = useState<any[]>([])

  useEffect(() => {
    const loadNews = async () => {
      try {
        const news = await getHomepageNews()
        const items = news.slice(0, 3).map((article) => ({
          id: article.id,
          title: article.title,
          description: article.description,
          date: new Date(article.createdAt).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          image: article.image || "/placeholder.svg?height=200&width=400",
        }))
        setNewsItems(items)
      } catch (error) {
        console.error("Error loading news:", error)
      }
    }

    loadNews()
  }, [])

  const reviews = homepageData?.reviews || []

  useEffect(() => {
    if (reviews.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [reviews.length])

  useEffect(() => {
    if (!homepageData?.imageGallery || homepageData.imageGallery.length === 0) return

    const interval = setInterval(() => {
      setIsImageVisible(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % homepageData.imageGallery.length)
        setIsImageVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [homepageData?.imageGallery])

  if (loading || !homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col relative pt-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${homepageData.heroImage || "/money-bills-background.jpg"}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/95" />

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-32 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
              {/* Left side - Hero content */}
              <div className="flex-1 lg:max-w-2xl text-center lg:text-left">
                <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rubik leading-tight md:leading-tight lg:leading-tight mb-6 md:mb-8 tracking-tight text-white">
                  {homepageData.heroTitle}
                </h1>

                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-inter">
                  {homepageData.heroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
                  <a
                    href={homepageData.heroButtonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 xl:px-8 2xl:px-10 h-12 text-sm md:text-base font-semibold rounded-xl w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    {homepageData.heroButtonText}
                  </a>
                </div>
              </div>

              {/* Right side - Currency Exchange Widget */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div
                  className="rounded-2xl shadow-xl border overflow-hidden"
                  style={{ backgroundColor: "#0f0f10", borderColor: "#27282d" }}
                >
                  {/* Header */}
                  <div className="px-6 py-4" style={{ backgroundColor: "#27282d" }}>
                    <h3 className="text-white font-bold text-lg text-center">Курс валют на {getCurrentDate()}</h3>
                  </div>

                  {/* Table Header */}
                  <div
                    className="grid grid-cols-3 border-b"
                    style={{ backgroundColor: "#27282d", borderColor: "#27282d" }}
                  >
                    <div className="px-4 py-3 text-sm font-semibold text-gray-200">Валюта</div>
                    <div
                      className="px-4 py-3 text-sm font-semibold text-gray-200 text-center border-l"
                      style={{ borderColor: "#27282d" }}
                    >
                      Покупка
                    </div>
                    <div
                      className="px-4 py-3 text-sm font-semibold text-gray-200 text-center border-l"
                      style={{ borderColor: "#27282d" }}
                    >
                      Продажа
                    </div>
                  </div>

                  {/* Currency Rows */}
                  <div className="divide-y" style={{ borderColor: "#27282d" }}>
                    {homepageData.currencyRates.map((rate) => (
                      <div
                        key={rate.currency}
                        className="grid grid-cols-3 hover:bg-opacity-50 transition-colors"
                        style={{ backgroundColor: "#0f0f10" }}
                      >
                        <div className="px-4 py-4 font-semibold text-white">{rate.currency}</div>
                        <div className="px-4 py-4 text-center border-l" style={{ borderColor: "#27282d" }}>
                          <div className="font-semibold text-white">{rate.buyRate}</div>
                          {rate.buyChange !== 0 && (
                            <div
                              className={`text-xs font-medium ${rate.buyChange > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {rate.buyChange > 0 ? "+" : ""}
                              {rate.buyChange}
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-4 text-center border-l" style={{ borderColor: "#27282d" }}>
                          <div className="font-semibold text-white">{rate.sellRate}</div>
                          {rate.sellChange !== 0 && (
                            <div
                              className={`text-xs font-medium ${rate.sellChange > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {rate.sellChange > 0 ? "+" : ""}
                              {rate.sellChange}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 text-center" style={{ backgroundColor: "#27282d" }}>
                    <p className="text-xs text-gray-300">Обновлено: {lastUpdated || "загрузка..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-green-600 py-4 overflow-hidden">
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-smooth">
              {(homepageData.tickerTexts || []).map((text, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-white text-lg md:text-xl font-semibold font-inter px-3">{text}</span>
                  <div className="w-2 h-2 bg-white rounded-full mx-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section with company info and statistics */}
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }} aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid xl:grid-cols-2 gap-16 items-start">
            <div className="order-2 xl:order-1">
              <h2 className="text-4xl font-bold text-white mb-6 xl:mt-0">{homepageData.aboutText}</h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                {homepageData.aboutDescription.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="order-1 xl:order-2">
              <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={homepageData.aboutImage || "/placeholder.svg"}
                  alt="Офис обмена валют"
                  fill
                  className="object-cover rounded-lg"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="rounded-lg overflow-hidden border border-gray-700" style={{ backgroundColor: "#141415" }}>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="text-left relative">
                  <div className="px-4 py-6">
                    <h3 className="text-3xl font-semibold text-white mb-2">{homepageData.stat1Title}</h3>
                    <p className="text-gray-300">{homepageData.stat1Subtitle}</p>
                  </div>
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-600"></div>
                  <div className="md:hidden w-full h-px bg-gray-600"></div>
                </div>

                <div className="text-left relative">
                  <div className="px-4 py-6">
                    <h3 className="text-3xl font-semibold text-white mb-2">{homepageData.stat2Title}</h3>
                    <p className="text-gray-300">{homepageData.stat2Subtitle}</p>
                  </div>
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-600"></div>
                  <div className="md:hidden w-full h-px bg-gray-600"></div>
                </div>

                <div className="text-left relative">
                  <div className="px-4 py-6">
                    <h3 className="text-3xl font-semibold text-white mb-2">{homepageData.stat3Title}</h3>
                    <p className="text-gray-300">{homepageData.stat3Subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-2 bg-green-600"></div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-11" style={{ backgroundColor: "#0a0a0a" }} aria-labelledby="news-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 id="news-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                Последние новости
              </h2>
              <p className="text-gray-300 mt-2">Актуальная информация о курсах валют и наших услугах</p>
            </div>
            <a href="/news" className="hidden sm:flex">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-[#141415] hover:text-white bg-transparent px-8"
              >
                Все новости
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {newsItems.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-all duration-300 bg-[#141415] border-gray-800 h-full flex flex-col"
              >
                <CardHeader>
                  <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg leading-tight text-white">
                    <a href={`/news/${item.id}`} className="hover:text-green-400 transition-colors">
                      {item.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <CardDescription className="text-gray-300 leading-relaxed flex-grow mb-4 line-clamp-3">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-gray-400 mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    {item.date}
                  </div>
                  <a href={`/news/${item.id}`}>
                    <Button className="bg-green-600 text-white hover:bg-green-700 w-full">Читать статью</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="block sm:hidden text-center">
            <a href="/news">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-[#141415] hover:text-white bg-transparent px-8"
              >
                Все новости
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-11" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Photos Block */}
            <div className="lg:col-span-3">
              <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-video lg:h-[400px] lg:aspect-auto flex items-center justify-center relative">
                {homepageData.imageGallery && homepageData.imageGallery.length > 0 ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={homepageData.imageGallery[currentImageIndex]?.url || "/placeholder.svg?height=400&width=600"}
                      alt={homepageData.imageGallery[currentImageIndex]?.alt || "Офис обмена валют"}
                      fill
                      className="object-cover"
                      style={{ opacity: isImageVisible ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                    />
                  </div>
                ) : (
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Офис обмена валют"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Reviews Block */}
            <div id="reviews" className="lg:col-span-2">
              <div
                className="rounded-2xl p-6 h-[400px] flex flex-col justify-between"
                style={{ backgroundColor: "#141415" }}
              >
                {reviews.length > 0 ? (
                  <>
                    <div className="mb-10">
                      <p
                        className="text-lg text-white mb-4 leading-relaxed h-40"
                        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
                      >
                        {reviews[currentReview]?.text}
                      </p>
                    </div>

                    <div className="mt-10">
                      <p
                        className="font-semibold text-white"
                        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
                      >
                        {reviews[currentReview]?.name}
                      </p>
                      <div
                        className="flex items-center"
                        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
                      >
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${i < (reviews[currentReview]?.rating || 5) ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-gray-400">{reviews[currentReview]?.date}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-center">Отзывы не добавлены</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Часто задаваемые вопросы</h2>
            <p className="text-gray-300 text-lg">Ответы на популярные вопросы о обмене валют</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {homepageData.faqItems
              .sort((a, b) => a.order - b.order)
              .map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${index + 1}`}
                  className="border border-gray-700 rounded-lg px-6"
                  style={{ backgroundColor: "#141415" }}
                >
                  <AccordionTrigger className="text-white hover:text-green-400 text-left no-underline hover:no-underline focus:no-underline data-[state=open]:text-green-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-16 pb-16" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Contacts Block - narrower, order-2 на мобильных */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div
                className="rounded-3xl p-8 shadow-xl border border-gray-700 flex flex-col h-[360px]"
                style={{ backgroundColor: "#141415" }}
              >
                {/* Large Logo - moved to top left */}
                <div className="flex justify-start">
                  <div className="w-16 h-16 bg-gray-500 rounded" />
                </div>

                <div className="h-8"></div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <a
                        href={`tel:${homepageData?.contactsSection.phone.replace(/[^+\d]/g, "")}`}
                        className="text-lg font-semibold text-white hover:text-green-400 transition-colors"
                      >
                        {homepageData?.contactsSection.phone}
                      </a>
                      <span className="text-sm text-gray-400">Мобильный телефон</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <a
                        href={`mailto:${homepageData?.contactsSection.email}`}
                        className="text-lg font-semibold text-white hover:text-green-400 transition-colors"
                      >
                        {homepageData?.contactsSection.email}
                      </a>
                      <span className="text-sm text-gray-400">Основная почта</span>
                    </div>
                  </div>
                </div>

                <div className="h-8"></div>

                <a
                  href={homepageData?.contactsSection.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  {homepageData?.contactsSection.buttonText}
                </a>
              </div>
            </div>

            {/* Map Block - wider, order-1 на мобильных/планшетах, order-2 на десктопе */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <MapComponent mapIframe={homepageData?.contactsSection?.mapIframe} />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <BookingForm isOpen={isBookingFormOpen} onClose={closeBookingForm} />

      {/* Fixed WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://wa.me/${contactsData?.whatsappNumbers?.primary || "77773231715"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          style={{
            animation: "gentle-glow 3s ease-in-out infinite",
          }}
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.173-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785" />
          </svg>
        </a>
      </div>

      {/* Footer Section */}
      <footer className="py-4 mb-12 bg-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base text-gray-500">
            Разработка сайта -{" "}
            <a
              href="https://wa.me/77710798939"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-600 transition-colors duration-300"
            >
              Web Alchin
            </a>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gentle-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
          }
        }
        
        @keyframes marquee-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee-smooth {
          animation: marquee-smooth 60s linear infinite;
        }
      `}</style>
    </div>
  )
}
