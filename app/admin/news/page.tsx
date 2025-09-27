"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/admin-storage"
import { NewsManagement } from "@/components/admin/news-management"

export default function NewsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("current_user")
        if (userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Дата не указана"
      }
      return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Дата не указана"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Загрузка...</h1>
        </div>
      </div>
    )
  }

  return <NewsManagement currentUser={currentUser} formatDate={formatDate} />
}
