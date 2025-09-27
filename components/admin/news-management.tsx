"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit3, Trash2, FileText } from "lucide-react"
import * as NewsService from "@/lib/supabase-news"
import type { NewsArticle } from "@/lib/admin-storage"
import { NewsEditForm } from "./news-edit-form"

interface NewsManagementProps {
  currentUser: any
  formatDate: (dateString: string) => string
}

export function NewsManagement({ currentUser, formatDate }: NewsManagementProps) {
  const router = useRouter()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("📰 NewsManagement: Checking auth...")
        const token = localStorage.getItem("admin_token")
        const userData = localStorage.getItem("current_user")

        console.log("📰 NewsManagement: Token:", !!token, "UserData:", !!userData)

        if (!token || !userData) {
          console.log("📰 NewsManagement: Auth failed, redirecting to login")
          router.push("/admin/login")
          return
        }
        console.log("📰 NewsManagement: Auth successful")
      } catch (error) {
        console.error("📰 NewsManagement: Error checking auth:", error)
        router.push("/admin/login")
        return
      }
    }

    checkAuth()
  }, [router])

  // Загрузка новостей
  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const articlesData = await NewsService.getAllNews()
      setArticles(articlesData)
    } catch (error) {
      console.error("Error loading articles:", error)
    }
  }

  const handleAddArticle = () => {
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      title: "",
      description: "",
      content: "",
      image: "",
      published: false,
      show_on_homepage: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Добавляем дополнительные поля для совместимости с формой
      date: new Date().toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: "Right Select Team",
      category: "",
      heroImage: "",
      contentImage: "",
      images: [],
      contentSections: [{ title: "", text: "" }],
    } as any

    setEditingArticle(newArticle)
    setShowAddForm(true)
  }

  const handleEditArticle = (article: NewsArticle) => {
    // Дополняем статью полями для совместимости с формой
    const extendedArticle = {
      ...article,
      date: article.createdAt
        ? new Date(article.createdAt).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : new Date().toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      author: (article as any).author || "Right Select Team",
      category: (article as any).category || "",
      heroImage: (article as any).heroImage || "",
      contentImage: (article as any).contentImage || "",
      images: (article as any).images || [],
      contentSections: (article as any).contentSections || [{ title: "", text: article.content || "" }],
    }

    setEditingArticle(extendedArticle as any)
    setShowAddForm(false)
  }

  const handleSaveArticle = async (articleData: any) => {
    console.log("Saving article:", articleData)

    try {
      if (showAddForm) {
        // Создание новой статьи
        const newArticle = {
          title: articleData.title,
          description: articleData.description,
          content: articleData.content,
          image: articleData.image,
          contentImage: articleData.contentImage,
          contentSections: articleData.contentSections,
          published: articleData.published,
          show_on_homepage: articleData.show_on_homepage,
        }

        await NewsService.createNews(newArticle)
        console.log("Article added successfully")
      } else {
        // Обновление существующей статьи
        const updates = {
          title: articleData.title,
          description: articleData.description,
          content: articleData.content,
          image: articleData.image,
          contentImage: articleData.contentImage,
          contentSections: articleData.contentSections,
          published: articleData.published,
          show_on_homepage: articleData.show_on_homepage,
        }

        await NewsService.updateNews(articleData.id, updates)
        console.log("Article updated successfully")
      }

      await loadArticles()
      setEditingArticle(null)
      setShowAddForm(false)
    } catch (error) {
      console.error("Error saving article:", error)
      alert("Ошибка при сохранении статьи")
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить эту новость?")) {
      try {
        await NewsService.deleteNews(id)
        await loadArticles()
      } catch (error) {
        console.error("Error deleting article:", error)
        alert("Ошибка при удалении статьи")
      }
    }
  }

  const handleCancel = () => {
    setEditingArticle(null)
    setShowAddForm(false)
  }

  // Если показываем форму редактирования
  if (editingArticle) {
    return <NewsEditForm article={editingArticle} onSave={handleSaveArticle} onCancel={handleCancel} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление новостями</h1>
          <p className="text-muted-foreground">Создавайте и редактируйте новости сайта</p>
        </div>
        <Button onClick={handleAddArticle} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Добавить новость
        </Button>
      </div>

      {/* Список новостей */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Новости сайта</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Новостей пока нет</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {article.image && (
                        <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant={article.published ? "default" : "secondary"}>
                            {article.published ? "Опубликовано" : "Черновик"}
                          </Badge>
                          {article.show_on_homepage && (
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                              На главной
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Создано: {formatDate(article.createdAt)}
                          {article.updatedAt && article.updatedAt !== article.createdAt && (
                            <> • Обновлено: {formatDate(article.updatedAt)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button onClick={() => handleEditArticle(article)} size="sm" variant="outline">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button
                        onClick={() => handleDeleteArticle(article.id)}
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
