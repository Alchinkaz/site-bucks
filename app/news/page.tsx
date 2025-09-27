"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { getPublishedNews, formatNewsDate } from "@/lib/supabase-news"
import { useEffect, useState } from "react"
import { getContactsData } from "@/lib/supabase-contacts"

export default function NewsPage() {
  const [newsData, setNewsData] = useState<any[]>([])
  const [contactsData, setContactsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [publishedNews, contacts] = await Promise.all([
          getPublishedNews(),
          getContactsData()
        ])
        
        const formattedNews = publishedNews.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.description,
          date: formatNewsDate(article.createdAt),
          image: article.image || "/placeholder.svg?height=200&width=400",
        }))
        setNewsData(formattedNews)
        setContactsData(contacts)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#141415] text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Новости</h1>
            <p className="text-xl text-gray-300 leading-relaxed">Последние новости и обновления в сфере обмена валют</p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Загрузка новостей...</p>
            </div>
          ) : newsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Новости не найдены</p>
            </div>
          ) : (
            <>
              {/* Мобильная версия - сетка 1 колонка */}
              <div className="grid grid-cols-1 md:hidden gap-6">
                {newsData.map((item) => (
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
                        <Link href={`/news/${item.id}`} className="hover:text-green-400 transition-colors">
                          {item.title}
                        </Link>
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
                      <Link href={`/news/${item.id}`}>
                        <Button className="bg-green-600 text-white hover:bg-green-700 w-full">Читать статью</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Планшетная версия - сетка 2 колонки */}
              <div className="hidden md:grid xl:hidden grid-cols-2 gap-6">
                {newsData.map((item) => (
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
                        <Link href={`/news/${item.id}`} className="hover:text-green-400 transition-colors">
                          {item.title}
                        </Link>
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
                      <Link href={`/news/${item.id}`}>
                        <Button className="bg-green-600 text-white hover:bg-green-700 w-full">Читать статью</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Десктопная версия - сетка 3 колонки */}
              <div className="hidden xl:grid grid-cols-3 gap-6">
                {newsData.map((item) => (
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
                        <Link href={`/news/${item.id}`} className="hover:text-green-400 transition-colors">
                          {item.title}
                        </Link>
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
                      <Link href={`/news/${item.id}`}>
                        <Button className="bg-green-600 text-white hover:bg-green-700 w-full">Читать статью</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

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
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785" />
          </svg>
        </a>
      </div>

      {/* Footer */}
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
      `}</style>
    </div>
  )
}
