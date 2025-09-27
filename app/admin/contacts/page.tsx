"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { type ContactsData, getContactsData, saveContactsData } from "@/lib/supabase-contacts"

export default function AdminContactsPage() {
  const [contactsData, setContactsData] = useState<ContactsData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getContactsData()
        setContactsData(data)
      } catch (error) {
        console.error("Error loading contacts data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSave = async () => {
    if (!contactsData) return
    
    setIsSaving(true)
    setSaveMessage("")

    try {
      await saveContactsData(contactsData)
      setSaveMessage("Контактные данные успешно сохранены!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Ошибка при сохранении данных")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: string, value: string) => {
    if (contactsData) {
      setContactsData((prev) => prev ? ({
        ...prev,
        [field]: value,
      }) : null)
    }
  }

  const updateWorkingHours = (day: string, value: string) => {
    if (contactsData) {
      setContactsData((prev) => prev ? ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [day]: value,
        },
      }) : null)
    }
  }

  const updateWhatsApp = (type: "primary" | "secondary", value: string) => {
    if (contactsData) {
      setContactsData((prev) => prev ? ({
        ...prev,
        whatsappNumbers: {
          ...prev.whatsappNumbers,
          [type]: value,
        },
      }) : null)
    }
  }

  if (loading || !contactsData) {
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
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление контактами</h1>
          <p className="text-gray-600 mt-2">Редактирование контактной информации на сайте</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          style={{ backgroundColor: "#365e36" }}
          className="hover:opacity-90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${saveMessage.includes("успешно") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
        >
          {saveMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Основная информация */}
        <div className="space-y-6">
          {/* Телефон */}
          <Card className="bg-[#141415] border-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-white">Телефон</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-white">
                  Основной телефон
                </Label>
                <Input
                  id="phone"
                  value={contactsData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+7 (777) 323-17-15"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="bg-[#141415] border-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-white">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="email" className="text-white">
                  Электронная почта
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactsData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="info@baks.kz"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Адрес */}
          <Card className="bg-[#141415] border-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-white">Адрес</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-white">
                  Полный адрес
                </Label>
                <Textarea
                  id="address"
                  value={contactsData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Республика Казахстан, 050000, г. Алматы, ул. Абая, 150/230"
                  rows={3}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="gisLink" className="text-white">
                  Ссылка на 2ГИС
                </Label>
                <Input
                  id="gisLink"
                  value={contactsData.gisLink}
                  onChange={(e) => updateField("gisLink", e.target.value)}
                  placeholder="https://go.2gis.com/SQyMg"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="gisButtonText" className="text-white">
                  Текст кнопки 2ГИС
                </Label>
                <Input
                  id="gisButtonText"
                  value={contactsData.gisButtonText}
                  onChange={(e) => updateField("gisButtonText", e.target.value)}
                  placeholder="Смотреть в 2ГИС"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-6">
          {/* Режим работы */}
          <Card className="bg-[#141415] border-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-white">Режим работы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weekdays" className="text-white">
                  Понедельник - Пятница
                </Label>
                <Input
                  id="weekdays"
                  value={contactsData.workingHours.weekdays}
                  onChange={(e) => updateWorkingHours("weekdays", e.target.value)}
                  placeholder="09:00 - 19:00"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="saturday" className="text-white">
                  Суббота
                </Label>
                <Input
                  id="saturday"
                  value={contactsData.workingHours.saturday}
                  onChange={(e) => updateWorkingHours("saturday", e.target.value)}
                  placeholder="10:00 - 16:00"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="sunday" className="text-white">
                  Воскресенье
                </Label>
                <Input
                  id="sunday"
                  value={contactsData.workingHours.sunday}
                  onChange={(e) => updateWorkingHours("sunday", e.target.value)}
                  placeholder="Выходной"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="bg-[#141415] border-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-white">WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatsapp-primary" className="text-white">
                  Основной WhatsApp
                </Label>
                <Input
                  id="whatsapp-primary"
                  value={contactsData.whatsappNumbers.primary}
                  onChange={(e) => updateWhatsApp("primary", e.target.value)}
                  placeholder="77773231715"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-400 mt-1">Используется для плавающих WhatsApp кнопок на сайте</p>
              </div>
            </CardContent>
          </Card>

          {/* Карта */}
          <Card className="bg-[#141415] border-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-white">Карта (iframe)</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="mapIframe" className="text-white">
                  HTML код карты
                </Label>
                <Textarea
                  id="mapIframe"
                  value={contactsData.mapIframe}
                  onChange={(e) => updateField("mapIframe", e.target.value)}
                  placeholder='<iframe src="..." width="100%" height="600" frameborder="0"></iframe>'
                  rows={4}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Вставьте полный HTML код iframe карты (Google Maps, Яндекс.Карты и т.д.)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
