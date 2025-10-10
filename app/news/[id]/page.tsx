"use client"

import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { getNewsWithDetails } from "@/lib/supabase-news"
import { getContactsData } from "@/lib/supabase-contacts"
import { useEffect, useState } from "react"
import LinkifiedText from "@/components/LinkifiedText"

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [news, setNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contactsData, setContactsData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [newsData, contacts] = await Promise.all([
          getNewsWithDetails(params.id),
          getContactsData()
        ])
        setNews(newsData)
        setContactsData(contacts)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="h-20"></div>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Загрузка...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="h-20"></div>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Новость не найдена</h1>
            <p className="text-gray-400">К сожалению, запрошенная новость не существует.</p>
            <Link
              href="/news"
              className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Вернуться к списку новостей
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="h-20"></div>

      <section className="py-16 bg-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{news.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {news.date}
              </div>
            </div>
          </div>

          {news.contentImage && (
            <div className="w-full mb-12">
              <Image
                src={news.contentImage || "/placeholder.svg"}
                alt={news.title}
                width={800}
                height={450}
                className="w-full h-auto rounded-lg aspect-video object-cover"
              />
            </div>
          )}

          <div className="space-y-12">
            {news.contentSections &&
              news.contentSections.map((section: any, index: number) => (
                <div key={index} className="prose prose-lg max-w-none">
                  {section.title && section.title !== "Подробности" && (
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-white mb-6">{section.title}</h2>
                    </div>
                  )}
                  {section.text && (
                    <LinkifiedText text={section.text} className="text-gray-300 leading-relaxed text-lg mb-8" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>

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
