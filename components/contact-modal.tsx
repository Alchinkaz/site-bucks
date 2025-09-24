"use client"

import { Button } from "@/components/ui/button"
import { X, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { getContactsData } from "@/lib/contacts-data"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [contactsData, setContactsData] = useState<any>(null)

  const handlePhoneClick = () => {
    const phoneNumber = contactsData?.whatsappNumbers?.primary || "77773231715"
    window.open(`tel:+${phoneNumber}`, "_self")
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Здравствуйте! Я хотел бы получить информацию о проекте Orda Premium Burabay.")
    const whatsappNumber = contactsData?.whatsappNumbers?.primary || "77773231715"
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 300) // Время анимации
  }

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const contacts = getContactsData()
      setContactsData(contacts)
      setTimeout(() => {
        setIsVisible(true)
      }, 10)
    } else {
      setIsVisible(false)
      setTimeout(() => {
        setShouldRender(false)
      }, 300)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-gradient-to-b from-gray-100 to-white rounded-2xl shadow-2xl w-full max-w-md mx-auto relative overflow-hidden transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="px-8 py-10 text-center">
          {/* Logo in colored circle */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
            style={{ backgroundColor: "#355e36" }}
          >
            <img
              src="/placeholder.svg?height=32&width=80"
              alt="Orda Premium Burabay"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Связаться с нами</h2>
          <p className="text-gray-600 mb-8 font-inter">Выберите удобный способ связи</p>

          {/* Phone Number */}
          <div className="mb-10">
            <p className="text-2xl font-bold text-gray-900 mb-2 font-inter">
              {contactsData?.phone || "+7 (705) 333-30-82"}
            </p>
            <p className="text-gray-500 font-inter">Отдел продаж</p>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-4 mb-6">
            {/* Phone Call Button */}
            <Button
              onClick={handlePhoneClick}
              className="w-full h-14 bg-custom-green-600 hover:bg-custom-green-700 text-white font-semibold rounded-2xl transition-colors font-inter text-base shadow-lg"
            >
              <Phone className="w-5 h-5 mr-3" />
              Позвонить сейчас
            </Button>

            {/* WhatsApp Button */}
            <Button
              onClick={handleWhatsAppClick}
              className="w-full h-14 bg-custom-green-600 hover:bg-custom-green-700 text-white font-semibold rounded-2xl transition-colors font-inter text-base shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
              </svg>
              Написать в WhatsApp
            </Button>
          </div>

          {/* Response time */}
          <p className="text-gray-400 text-sm font-inter">Мы ответим в течение 5 минут</p>
        </div>
      </div>
    </div>
  )
}
