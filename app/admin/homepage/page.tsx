"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Trash2, Edit, ArrowUp, ArrowDown, MapPin, Plus } from "lucide-react"
import {
  getHomepageData,
  updateHomepageData,
  type HomepageData,
  type Review,
  type ImageGalleryItem,
  type FAQItem,
} from "@/lib/supabase-homepage"

export default function HomepageAdminPage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [editingImage, setEditingImage] = useState<ImageGalleryItem | null>(null)
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [newReview, setNewReview] = useState<Partial<Review>>({})
  const [newImage, setNewImage] = useState<Partial<ImageGalleryItem>>({})
  const [newFaq, setNewFaq] = useState<Partial<FAQItem>>({})
  const [newTickerText, setNewTickerText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getHomepageData()
        setHomepageData(data)
      } catch (error) {
        console.error("Error loading homepage data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (field: keyof HomepageData, value: string) => {
    if (homepageData) {
      setHomepageData((prev) => prev ? ({
        ...prev,
        [field]: value,
      }) : null)
    }
  }

  const handleAddReview = () => {
    if (newReview.name && newReview.text && newReview.rating && homepageData) {
      const review: Review = {
        id: Date.now().toString(),
        name: newReview.name,
        text: newReview.text,
        rating: newReview.rating,
        date: newReview.date || "Сегодня",
      }
      setHomepageData((prev) => prev ? ({
        ...prev,
        reviews: [...prev.reviews, review],
      }) : null)
      setNewReview({})
    }
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
  }

  const handleUpdateReview = () => {
    if (editingReview) {
      setHomepageData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) => (r.id === editingReview.id ? editingReview : r)),
      }))
      setEditingReview(null)
    }
  }

  const handleDeleteReview = (id: string) => {
    setHomepageData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
    }))
  }

  const handleAddImage = () => {
    if (newImage.url && newImage.alt) {
      const image: ImageGalleryItem = {
        id: Date.now().toString(),
        url: newImage.url,
        alt: newImage.alt,
      }
      setHomepageData((prev) => ({
        ...prev,
        imageGallery: [...prev.imageGallery, image],
      }))
      setNewImage({})
    }
  }

  const handleEditImage = (image: ImageGalleryItem) => {
    setEditingImage(image)
  }

  const handleUpdateImage = () => {
    if (editingImage) {
      setHomepageData((prev) => ({
        ...prev,
        imageGallery: prev.imageGallery.map((img) => (img.id === editingImage.id ? editingImage : img)),
      }))
      setEditingImage(null)
    }
  }

  const handleDeleteImage = (id: string) => {
    setHomepageData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((img) => img.id !== id),
    }))
  }

  const handleAddFAQ = () => {
    if (newFaq.question && newFaq.answer) {
      const maxOrder = Math.max(...homepageData.faqItems.map((faq) => faq.order), 0)
      const faq: FAQItem = {
        id: Date.now().toString(),
        question: newFaq.question,
        answer: newFaq.answer,
        order: maxOrder + 1,
      }
      setHomepageData((prev) => ({
        ...prev,
        faqItems: [...prev.faqItems, faq],
      }))
      setNewFaq({})
    }
  }

  const handleEditFAQ = (faq: FAQItem) => {
    setEditingFAQ(faq)
  }

  const handleUpdateFAQ = () => {
    if (editingFAQ) {
      setHomepageData((prev) => ({
        ...prev,
        faqItems: prev.faqItems.map((f) => (f.id === editingFAQ.id ? editingFAQ : f)),
      }))
      setEditingFAQ(null)
    }
  }

  const handleDeleteFAQ = (id: string) => {
    setHomepageData((prev) => ({
      ...prev,
      faqItems: prev.faqItems.filter((f) => f.id !== id),
    }))
  }

  const handleMoveFAQUp = (id: string) => {
    const faqItems = [...homepageData.faqItems].sort((a, b) => a.order - b.order)
    const currentIndex = faqItems.findIndex((f) => f.id === id)
    if (currentIndex > 0) {
      const temp = faqItems[currentIndex].order
      faqItems[currentIndex].order = faqItems[currentIndex - 1].order
      faqItems[currentIndex - 1].order = temp

      setHomepageData((prev) => ({
        ...prev,
        faqItems: faqItems,
      }))
    }
  }

  const handleMoveFAQDown = (id: string) => {
    const faqItems = [...homepageData.faqItems].sort((a, b) => a.order - b.order)
    const currentIndex = faqItems.findIndex((f) => f.id === id)
    if (currentIndex < faqItems.length - 1) {
      const temp = faqItems[currentIndex].order
      faqItems[currentIndex].order = faqItems[currentIndex + 1].order
      faqItems[currentIndex + 1].order = temp

      setHomepageData((prev) => ({
        ...prev,
        faqItems: faqItems,
      }))
    }
  }

  const handleContactsChange = (field: keyof typeof homepageData.contactsSection, value: string) => {
    if (homepageData) {
      setHomepageData((prev) => prev ? ({
        ...prev,
        contactsSection: {
          ...prev.contactsSection,
          [field]: value,
        },
      }) : null)
    }
  }

  const handleSave = async () => {
    if (!homepageData) return
    
    setIsSaving(true)
    setSaveMessage("")

    try {
      await updateHomepageData(homepageData)
      setSaveMessage("Данные успешно сохранены!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Ошибка при сохранении данных")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage((prev) => ({
        ...prev,
        url: URL.createObjectURL(file),
      }))
    }
  }

  const handleAddTickerText = () => {
    if (newTickerText.trim()) {
      setHomepageData((prev) => ({
        ...prev,
        tickerTexts: [...(prev.tickerTexts || []), newTickerText.trim()],
      }))
      setNewTickerText("")
    }
  }

  const handleDeleteTickerText = (index: number) => {
    setHomepageData((prev) => ({
      ...prev,
      tickerTexts: (prev.tickerTexts || []).filter((_, i) => i !== index),
    }))
  }

  const handleUpdateTickerText = (index: number, newText: string) => {
    setHomepageData((prev) => ({
      ...prev,
      tickerTexts: (prev.tickerTexts || []).map((text, i) => (i === index ? newText : text)),
    }))
  }

  const addReview = () => {
    handleAddReview()
  }

  const addImage = () => {
    handleAddImage()
  }

  const addFaq = () => {
    handleAddFAQ()
  }

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
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление главной страницей</h1>
          <p className="text-gray-600 mt-2">Редактирование контента главной страницы сайта</p>
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

      {/* Hero Section */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Героическая секция</CardTitle>
          <CardDescription className="text-gray-400">
            Основной заголовок, подзаголовок и кнопка на главной странице
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle" className="text-white">
              Заголовок
            </Label>
            <Textarea
              id="heroTitle"
              value={homepageData.heroTitle}
              onChange={(e) => handleInputChange("heroTitle", e.target.value)}
              placeholder="Основной заголовок героической секции"
              rows={3}
              className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="heroSubtitle" className="text-white">
              Подзаголовок
            </Label>
            <Textarea
              id="heroSubtitle"
              value={homepageData.heroSubtitle}
              onChange={(e) => handleInputChange("heroSubtitle", e.target.value)}
              placeholder="Описание под заголовком"
              rows={2}
              className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heroButtonText" className="text-white">
                Текст кнопки
              </Label>
              <Input
                id="heroButtonText"
                value={homepageData.heroButtonText}
                onChange={(e) => handleInputChange("heroButtonText", e.target.value)}
                placeholder="Текст на кнопке"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="heroButtonLink" className="text-white">
                Ссылка кнопки
              </Label>
              <Input
                id="heroButtonLink"
                value={homepageData.heroButtonLink}
                onChange={(e) => handleInputChange("heroButtonLink", e.target.value)}
                placeholder="https://wa.me/77773231715"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="heroImage" className="text-white">
              Фоновое изображение (ссылка)
            </Label>
            <Input
              id="heroImage"
              value={homepageData.heroImage}
              onChange={(e) => handleInputChange("heroImage", e.target.value)}
              placeholder="/money-bills-background.jpg"
              className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
            <p className="text-sm text-gray-400 mt-1">URL изображения для фона героической секции</p>
          </div>
        </CardContent>
      </Card>

      {/* Ticker Management Section */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Управление бегущей строкой</CardTitle>
          <CardDescription className="text-gray-400">
            Редактирование текстов в бегущей строке после героической секции
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[#141415] p-6 rounded-lg border border-[#1a1a1a] mb-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Добавить новый текст</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Текст для бегущей строки"
                value={newTickerText}
                onChange={(e) => setNewTickerText(e.target.value)}
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400 flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleAddTickerText()}
              />
              <Button onClick={handleAddTickerText} style={{ backgroundColor: "#365f37" }} className="hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Существующие тексты</h3>
            {(homepageData.tickerTexts || []).length === 0 ? (
              <p className="text-gray-400 text-center py-8">Тексты для бегущей строки не добавлены</p>
            ) : (
              <div className="space-y-3">
                {(homepageData.tickerTexts || []).map((text, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-[#0a0a0a] border-[#1a1a1a]">
                    <div className="flex items-center gap-4">
                      <Input
                        value={text}
                        onChange={(e) => handleUpdateTickerText(index, e.target.value)}
                        className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400 flex-1"
                      />
                      <Button
                        onClick={() => handleDeleteTickerText(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About Company Section */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Секция о компании</CardTitle>
          <CardDescription className="text-gray-400">
            Изображение, заголовок и описание в секции о компании
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="aboutImage" className="text-white">
              Изображение (ссылка)
            </Label>
            <Input
              id="aboutImage"
              value={homepageData.aboutImage}
              onChange={(e) => handleInputChange("aboutImage", e.target.value)}
              placeholder="/placeholder.svg?height=270&width=480"
              className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="aboutText" className="text-white">
              Заголовок секции
            </Label>
            <Textarea
              id="aboutText"
              value={homepageData.aboutText}
              onChange={(e) => handleInputChange("aboutText", e.target.value)}
              placeholder="При вас оценим состояние купюр и обменяем их по лучшему курсу"
              rows={2}
              className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="aboutDescription" className="text-white">
              Описание компании
            </Label>
            <Textarea
              id="aboutDescription"
              value={homepageData.aboutDescription}
              onChange={(e) => handleInputChange("aboutDescription", e.target.value)}
              placeholder="Полное описание деятельности компании..."
              rows={4}
              className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Секция статистики</CardTitle>
          <CardDescription className="text-gray-400">Заголовки и подзаголовки в блоке статистики</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Статистика 1 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Первая статистика</h4>
              <div>
                <Label htmlFor="stat1Title" className="text-white">
                  Заголовок
                </Label>
                <Input
                  id="stat1Title"
                  value={homepageData.stat1Title}
                  onChange={(e) => handleInputChange("stat1Title", e.target.value)}
                  placeholder="5+ лет"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="stat1Subtitle" className="text-white">
                  Подзаголовок
                </Label>
                <Input
                  id="stat1Subtitle"
                  value={homepageData.stat1Subtitle}
                  onChange={(e) => handleInputChange("stat1Subtitle", e.target.value)}
                  placeholder="Опыт работы на валютном рынке"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Статистика 2 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Вторая статистика</h4>
              <div>
                <Label htmlFor="stat2Title" className="text-white">
                  Заголовок
                </Label>
                <Input
                  id="stat2Title"
                  value={homepageData.stat2Title}
                  onChange={(e) => handleInputChange("stat2Title", e.target.value)}
                  placeholder="15+ валют"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="stat2Subtitle" className="text-white">
                  Подзаголовок
                </Label>
                <Input
                  id="stat2Subtitle"
                  value={homepageData.stat2Subtitle}
                  onChange={(e) => handleInputChange("stat2Subtitle", e.target.value)}
                  placeholder="Принимаем к обмену"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Статистика 3 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Третья статистика</h4>
              <div>
                <Label htmlFor="stat3Title" className="text-white">
                  Заголовок
                </Label>
                <Input
                  id="stat3Title"
                  value={homepageData.stat3Title}
                  onChange={(e) => handleInputChange("stat3Title", e.target.value)}
                  placeholder="1000+"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="stat3Subtitle" className="text-white">
                  Подзаголовок
                </Label>
                <Input
                  id="stat3Subtitle"
                  value={homepageData.stat3Subtitle}
                  onChange={(e) => handleInputChange("stat3Subtitle", e.target.value)}
                  placeholder="Довольных клиентов"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Management */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Управление отзывами</CardTitle>
          <CardDescription className="text-gray-400">
            Добавление, редактирование и удаление отзывов клиентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[#141415] p-6 rounded-lg border border-[#1a1a1a] mb-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Добавить новый отзыв</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Имя Фамилия"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="2 дня назад"
                value={newReview.date}
                onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
              />
            </div>
            <Textarea
              placeholder="Текст отзыва клиента..."
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              rows={4}
              className="mb-4 bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
            />
            <div className="flex items-center gap-4 mb-4">
              <Label className="text-white">Рейтинг:</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-600"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={addReview} style={{ backgroundColor: "#365f37" }} className="hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Добавить отзыв
            </Button>
          </div>

          {homepageData.reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 bg-[#0a0a0a] border-[#1a1a1a]">
              {editingReview?.id === review.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Имя клиента</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md text-white"
                        style={{ backgroundColor: "#0a0a0a" }}
                        placeholder="Имя Фамилия"
                        value={editingReview.name}
                        onChange={(e) => setEditingReview((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Дата отзыва</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md text-white"
                        style={{ backgroundColor: "#0a0a0a" }}
                        placeholder="2 дня назад"
                        value={editingReview.date}
                        onChange={(e) => setEditingReview((prev) => (prev ? { ...prev, date: e.target.value } : null))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Текст отзыва</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md text-white h-24"
                      style={{ backgroundColor: "#0a0a0a" }}
                      placeholder="Текст отзыва клиента..."
                      value={editingReview.text}
                      onChange={(e) => setEditingReview((prev) => (prev ? { ...prev, text: e.target.value } : null))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Рейтинг (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-full px-3 py-2 rounded-md text-white"
                      style={{ backgroundColor: "#0a0a0a" }}
                      placeholder="5"
                      value={editingReview.rating}
                      onChange={(e) =>
                        setEditingReview((prev) => (prev ? { ...prev, rating: Number.parseInt(e.target.value) } : null))
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateReview} size="sm" className="bg-green-600 hover:bg-green-700">
                      Сохранить
                    </Button>
                    <Button onClick={() => setEditingReview(null)} variant="outline" size="sm">
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-semibold text-white">{review.name}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEditReview(review)} variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteReview(review.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-400">{review.text}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Image Gallery Management */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Управление галереей изображений</CardTitle>
          <CardDescription className="text-gray-400">
            Добавление, редактирование и удаление изображений в галерее
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[#141415] p-6 rounded-lg border border-[#1a1a1a] mb-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Добавить новое изображение</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageFile" className="text-white">
                  Файл изображения
                </Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                />
              </div>
              <div>
                <Label htmlFor="imageDescription" className="text-white">
                  Описание изображения
                </Label>
                <Input
                  id="imageDescription"
                  placeholder="Описание изображения"
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <Button onClick={addImage} style={{ backgroundColor: "#365f37" }} className="hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Добавить изображение
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Существующие изображения</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homepageData.imageGallery.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 bg-[#0a0a0a] border-[#1a1a1a]">
                  {editingImage?.id === image.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">URL изображения</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md text-white"
                          style={{ backgroundColor: "#0a0a0a" }}
                          placeholder="/modern-open-office.png"
                          value={editingImage.url}
                          onChange={(e) => setEditingImage((prev) => (prev ? { ...prev, url: e.target.value } : null))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Описание</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md text-white"
                          style={{ backgroundColor: "#0a0a0a" }}
                          placeholder="Описание изображения"
                          value={editingImage.alt}
                          onChange={(e) => setEditingImage((prev) => (prev ? { ...prev, alt: e.target.value } : null))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateImage} size="sm" className="bg-green-600 hover:bg-green-700">
                          Сохранить
                        </Button>
                        <Button onClick={() => setEditingImage(null)} variant="outline" size="sm">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="aspect-video mb-2 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{image.alt}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEditImage(image)} variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteImage(image.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Management */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Управление FAQ</CardTitle>
          <CardDescription className="text-gray-400">
            Добавление, редактирование и удаление часто задаваемых вопросов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-[#141415] p-6 rounded-lg border border-[#1a1a1a] mb-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Добавить новый вопрос</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="faqQuestion" className="text-white">
                  Вопрос
                </Label>
                <Input
                  id="faqQuestion"
                  placeholder="Часто задаваемый вопрос"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="faqAnswer" className="text-white">
                  Ответ
                </Label>
                <Textarea
                  id="faqAnswer"
                  placeholder="Подробный ответ на вопрос"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  rows={4}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
              <Button onClick={addFaq} style={{ backgroundColor: "#365f37" }} className="hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Добавить вопрос
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Существующие вопросы</h3>
            {homepageData.faqItems
              .sort((a, b) => a.order - b.order)
              .map((faq, index) => (
                <div key={faq.id} className="border rounded-lg p-4 bg-[#0a0a0a] border-[#1a1a1a]">
                  {editingFAQ?.id === faq.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Вопрос</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md text-white"
                          style={{ backgroundColor: "#0a0a0a" }}
                          placeholder="Часто задаваемый вопрос"
                          value={editingFAQ.question}
                          onChange={(e) =>
                            setEditingFAQ((prev) => (prev ? { ...prev, question: e.target.value } : null))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Ответ</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-md text-white h-24"
                          style={{ backgroundColor: "#0a0a0a" }}
                          placeholder="Подробный ответ на вопрос"
                          value={editingFAQ.answer}
                          onChange={(e) => setEditingFAQ((prev) => (prev ? { ...prev, answer: e.target.value } : null))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateFAQ} size="sm" className="bg-green-600 hover:bg-green-700">
                          Сохранить
                        </Button>
                        <Button onClick={() => setEditingFAQ(null)} variant="outline" size="sm">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                              #{index + 1}
                            </span>
                            <h5 className="font-semibold text-white">{faq.question}</h5>
                          </div>
                          <p className="text-gray-400 text-sm">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <div className="flex flex-col gap-1">
                            <Button
                              onClick={() => handleMoveFAQUp(faq.id)}
                              variant="outline"
                              size="sm"
                              disabled={index === 0}
                              className="p-1 h-8 w-8"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleMoveFAQDown(faq.id)}
                              variant="outline"
                              size="sm"
                              disabled={index === homepageData.faqItems.length - 1}
                              className="p-1 h-8 w-8"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button onClick={() => handleEditFAQ(faq)} variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteFAQ(faq.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Section */}
      <Card className="bg-[#141415] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Управление секцией контактов</CardTitle>
          <CardDescription className="text-gray-400">
            Редактирование контактной информации и карты на главной странице
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Контактная информация */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Контактная информация</h4>

              <div>
                <Label htmlFor="contactPhone" className="text-white">
                  Телефон
                </Label>
                <Input
                  id="contactPhone"
                  value={homepageData.contactsSection.phone}
                  onChange={(e) => handleContactsChange("phone", e.target.value)}
                  placeholder="+7 (777) 323-17-15"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-white">
                  Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={homepageData.contactsSection.email}
                  onChange={(e) => handleContactsChange("email", e.target.value)}
                  placeholder="shotkin.azat@gmail.com"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="contactButtonText" className="text-white">
                  Текст кнопки
                </Label>
                <Input
                  id="contactButtonText"
                  value={homepageData.contactsSection.buttonText}
                  onChange={(e) => handleContactsChange("buttonText", e.target.value)}
                  placeholder="Получить консультацию"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="contactButtonLink" className="text-white">
                  Ссылка кнопки
                </Label>
                <Input
                  id="contactButtonLink"
                  value={homepageData.contactsSection.buttonLink}
                  onChange={(e) => handleContactsChange("buttonLink", e.target.value)}
                  placeholder="https://wa.me/77773231715"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Карта */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                Карта
              </h4>

              <div>
                <Label htmlFor="contactMapIframe" className="text-white">
                  HTML код iframe карты
                </Label>
                <Textarea
                  id="contactMapIframe"
                  value={homepageData.contactsSection.mapIframe}
                  onChange={(e) => handleContactsChange("mapIframe", e.target.value)}
                  placeholder='<iframe src="..." width="100%" height="100%" frameBorder="0"></iframe>'
                  rows={8}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Вставьте полный HTML код iframe карты (Яндекс.Карты, Google Maps и т.д.)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
