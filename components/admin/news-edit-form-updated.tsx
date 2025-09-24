"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { NewsArticle } from "@/lib/supabase-service"

interface NewsEditFormProps {
  article: NewsArticle
  onSave: (article: NewsArticle) => void
  onCancel: () => void
}

export function NewsEditForm({ article, onSave, onCancel }: NewsEditFormProps) {
  const router = useRouter()
  const [localData, setLocalData] = useState(() => {
    console.log("=== NewsEditForm: Initial article data ===")
    console.log("Article:", article)

    const initialData = {
      ...article,
      contentSections: article.contentSections || [{ title: "", text: "" }],
      // Убеждаемся, что все обязательные поля заполнены
      title: article.title || "",
      description: article.description || "",
      content: article.content || "",
      date:
        article.date ||
        new Date().toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      author: article.author || "Right Select Team",
      category: article.category || "",
      image: article.image || "",
      heroImage: article.heroImage || "",
      contentImage: article.contentImage || "",
      images: article.images || [],
      published: article.published || false,
      show_on_homepage: article.show_on_homepage || false,
    }

    console.log("Initial localData:", initialData)
    return initialData
  })

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("admin_token")
        const userData = localStorage.getItem("current_user")

        if (!token || token !== "authenticated" || !userData) {
          router.push("/admin/login")
          return
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/admin/login")
        return
      }
    }

    checkAuth()
  }, [router])

  const updateLocalData = (field: string, value: any) => {
    console.log(`=== NewsEditForm: Updating field ${field} ===`)
    console.log("Old value:", localData[field])
    console.log("New value:", value)

    setLocalData((prev) => {
      const newData = { ...prev, [field]: value }
      console.log("Updated localData:", newData)
      return newData
    })
  }

  const validateData = () => {
    console.log("=== NewsEditForm: Validating data ===")
    console.log("Current localData:", localData)

    const errors = []

    if (!localData.title?.trim()) {
      errors.push("Заголовок обязателен")
    }

    if (!localData.description?.trim()) {
      errors.push("Описание обязательно")
    }

    if (!localData.date?.trim()) {
      errors.push("Дата обязательна")
    }

    // Проверяем, что хотя бы одна секция контента заполнена
    const hasValidContent = localData.contentSections.some((section) => section.title?.trim() || section.text?.trim())

    if (!hasValidContent) {
      errors.push("Необходимо заполнить хотя бы одну секцию контента")
    }

    console.log("Validation errors:", errors)
    return errors
  }

  const handleSave = () => {
    console.log("=== NewsEditForm: Saving article ===")
    console.log("Article data to save:", localData)

    // Валидация данных
    const errors = validateData()
    if (errors.length > 0) {
      alert("Ошибки валидации:\n" + errors.join("\n"))
      return
    }

    // Очищаем пустые секции контента
    const cleanedData = {
      ...localData,
      contentSections: localData.contentSections.filter((section) => section.title?.trim() || section.text?.trim()),
      // Убеждаемся, что content заполнен на основе contentSections
      content:
        localData.contentSections
          .filter((section) => section.title?.trim() || section.text?.trim())
          .map((section) => `${section.title}\n\n${section.text}`)
          .join("\n\n---\n\n") ||
        localData.content ||
        "",
    }

    console.log("Cleaned data for save:", cleanedData)
    onSave(cleanedData)
  }

  const addContentSection = () => {
    const newSections = [...localData.contentSections, { title: "", text: "" }]
    updateLocalData("contentSections", newSections)
  }

  const removeContentSection = (index: number) => {
    if (localData.contentSections.length > 1) {
      const newSections = localData.contentSections.filter((_, i) => i !== index)
      updateLocalData("contentSections", newSections)
    }
  }

  const updateContentSection = (index: number, field: "title" | "text", value: string) => {
    const newSections = [...localData.contentSections]
    newSections[index] = { ...newSections[index], [field]: value }
    updateLocalData("contentSections", newSections)
  }

  useEffect(() => {
    console.log("=== NewsEditForm: LocalData changed ===")
    console.log("Current localData:", localData)
  }, [localData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {article.id ? "Редактировать новость" : "Добавить новость"}
          </h1>
          <p className="text-muted-foreground">
            {article.id ? "Изменить информацию о новости" : "Создать новую новость"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline">
            Отмена
          </Button>
          <Button onClick={handleSave} className="bg-[#365f37] hover:bg-[#2d4f2d]">
            {article.id ? "Сохранить изменения" : "Создать новость"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Изображения новости</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Image (для карточки) */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Основное изображение (для карточки)</Label>
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {localData.image ? (
                      <img
                        src={localData.image || "/placeholder.svg"}
                        alt="Основное изображение"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="text-center text-slate-500 hidden">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Предварительный просмотр</p>
                    </div>
                  </div>
                  <Input
                    value={localData.image || ""}
                    onChange={(e) => updateLocalData("image", e.target.value)}
                    placeholder="Ссылка на основное изображение для карточки"
                  />
                  <p className="text-xs text-muted-foreground">Это изображение отображается в списке новостей</p>
                </div>
              </div>

              {/* Hero Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Hero изображение (фон заголовка)</Label>
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {localData.heroImage ? (
                      <img
                        src={localData.heroImage || "/placeholder.svg"}
                        alt="Hero изображение"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="text-center text-slate-500 hidden">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Предварительный просмотр</p>
                    </div>
                  </div>
                  <Input
                    value={localData.heroImage || ""}
                    onChange={(e) => updateLocalData("heroImage", e.target.value)}
                    placeholder="Ссылка на Hero изображение"
                  />
                  <p className="text-xs text-muted-foreground">
                    Фоновое изображение для Hero секции на странице новости
                  </p>
                </div>
              </div>

              {/* Content Image */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Изображение контента</Label>
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {localData.contentImage ? (
                      <img
                        src={localData.contentImage || "/placeholder.svg"}
                        alt="Изображение контента"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div className="text-center text-slate-500 hidden">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Предварительный просмотр</p>
                    </div>
                  </div>
                  <Input
                    value={localData.contentImage || ""}
                    onChange={(e) => updateLocalData("contentImage", e.target.value)}
                    placeholder="Ссылка на изображение контента"
                  />
                  <p className="text-xs text-muted-foreground">Большое изображение в начале статьи</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Article Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Заголовок новости *</Label>
                <Input
                  id="title"
                  value={localData.title || ""}
                  onChange={(e) => updateLocalData("title", e.target.value)}
                  placeholder="Введите заголовок новости"
                />
              </div>

              <div>
                <Label htmlFor="description">Краткое описание *</Label>
                <Textarea
                  id="description"
                  value={localData.description || ""}
                  onChange={(e) => updateLocalData("description", e.target.value)}
                  rows={3}
                  placeholder="Краткое описание новости для списка"
                />
              </div>

              <div>
                <Label htmlFor="date">Дата публикации *</Label>
                <Input
                  id="date"
                  value={localData.date || ""}
                  onChange={(e) => updateLocalData("date", e.target.value)}
                  placeholder="15 декабря 2024"
                />
              </div>

              <div>
                <Label htmlFor="author">Автор</Label>
                <Input
                  id="author"
                  value={localData.author || ""}
                  onChange={(e) => updateLocalData("author", e.target.value)}
                  placeholder="Right Select Team"
                />
              </div>

              <div>
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={localData.category || ""}
                  onChange={(e) => updateLocalData("category", e.target.value)}
                  placeholder="Новости компании"
                />
              </div>
            </CardContent>
          </Card>

          {/* Содержание */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Содержание новости *</CardTitle>
                <Button onClick={addContentSection} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить секцию
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {localData.contentSections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium">Секция {index + 1}</h4>
                      {localData.contentSections.length > 1 && (
                        <Button
                          onClick={() => removeContentSection(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Заголовок</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateContentSection(index, "title", e.target.value)}
                          placeholder="Заголовок секции"
                        />
                      </div>
                      <div>
                        <Label>Текстовое описание</Label>
                        <Textarea
                          value={section.text}
                          onChange={(e) => updateContentSection(index, "text", e.target.value)}
                          placeholder="Текст секции"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Настройки публикации */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки публикации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Опубликовать новость</Label>
                  <Switch
                    id="published"
                    checked={localData.published || false}
                    onCheckedChange={(checked) => updateLocalData("published", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_on_homepage">Показать на главной</Label>
                  <Switch
                    id="show_on_homepage"
                    checked={localData.show_on_homepage || false}
                    onCheckedChange={(checked) => updateLocalData("show_on_homepage", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
