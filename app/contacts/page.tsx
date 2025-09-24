"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { type ContactsData, getContactsData, initializeContactsData } from "@/lib/contacts-data"

export default function ContactsPage() {
  const [contactsData, setContactsData] = useState<ContactsData>({
    phone: "+7 (777) 323-17-15",
    email: "info@baks.kz",
    address: "Республика Казахстан, 050000, г. Алматы, ул. Абая, 150/230",
    workingHours: {
      weekdays: "09:00 - 19:00",
      saturday: "10:00 - 16:00",
      sunday: "Выходной",
    },
    whatsappNumbers: {
      primary: "77773231715",
      secondary: "77773231715",
    },
    mapIframe: "",
    gisLink: "https://go.2gis.com/SQyMg",
    gisButtonText: "Смотреть в 2ГИС",
  })

  useEffect(() => {
    initializeContactsData()
    const data = getContactsData()
    setContactsData(data)
  }, [])

  const openWhatsApp = () => {
    window.open(`https://wa.me/${contactsData.whatsappNumbers.primary}`, "_blank")
  }

  const open2GIS = () => {
    window.open(contactsData.gisLink, "_blank")
  }

  const openEmail = () => {
    window.location.href = `mailto:${contactsData.email}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="text-white py-16 mt-16" style={{ backgroundColor: "#141415" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Контакты</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Свяжитесь с нами для обмена валют, консультации по курсам или оценки состояния купюр
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 lg:space-y-4">
              {/* Телефон */}
              <Card
                className="border border-slate-600 shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: "#141415" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Телефон</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <button
                    onClick={openWhatsApp}
                    className="text-green-400 hover:text-green-300 transition-colors cursor-pointer font-medium text-base mb-2 block"
                  >
                    {contactsData.phone}
                  </button>
                  <p className="text-slate-400 text-xs mb-3">Мобильный телефон</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={openWhatsApp} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                      <Phone className="mr-2 h-3 w-3" />
                      Позвонить
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card
                className="border border-slate-600 shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: "#141415" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Email</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <button
                    onClick={openEmail}
                    className="text-green-400 hover:text-green-300 transition-colors cursor-pointer font-medium text-base mb-2 block"
                  >
                    {contactsData.email}
                  </button>
                  <p className="text-slate-400 text-xs mb-3">Основная почта</p>
                  <Button
                    onClick={openEmail}
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-400 hover:bg-green-600/10 w-full bg-transparent"
                  >
                    <Mail className="mr-2 h-3 w-3" />
                    Написать
                  </Button>
                </CardContent>
              </Card>

              {/* Режим работы */}
              <Card
                className="border border-slate-600 shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: "#141415" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Режим работы</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-slate-600">
                      <span className="text-slate-300 font-medium text-sm">Пн - Пт:</span>
                      <span className="font-semibold text-white text-sm">{contactsData.workingHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-600">
                      <span className="text-slate-300 font-medium text-sm">Суббота:</span>
                      <span className="font-semibold text-white text-sm">{contactsData.workingHours.saturday}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-300 font-medium text-sm">Воскресенье:</span>
                      <span className="text-slate-400 text-sm">{contactsData.workingHours.sunday}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Адрес */}
              <Card
                className="border border-slate-600 shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: "#141415" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Адрес</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-slate-300 leading-relaxed mb-3 text-sm">
                    <p className="font-medium">{contactsData.address}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 hover:text-white w-full"
                    onClick={open2GIS}
                  >
                    {contactsData.gisButtonText}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-72 lg:self-start">
                <div
                  className="w-full rounded-lg overflow-hidden border border-slate-600 shadow-sm"
                  style={{ aspectRatio: "16/9" }}
                >
                  {contactsData.mapIframe ? (
                    <div
                      className="w-full h-full [&>*]:w-full [&>*]:h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                      dangerouslySetInnerHTML={{ __html: contactsData.mapIframe }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <p className="text-lg font-medium mb-2">Карта местоположения</p>
                        <p className="text-sm">г. Алматы, ул. Абая, 150/230</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://wa.me/${contactsData.whatsappNumbers.primary}`}
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
