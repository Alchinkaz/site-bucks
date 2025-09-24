"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PageLoader from "@/components/ui/page-loader"
import { AdminStorage } from "@/lib/admin-storage"

export default function AdminLoading() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (!AdminStorage.isAuthenticated()) {
          router.push("/admin/login")
          return
        }

        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/admin/login")
        return
      }
    }

    checkAuth()
  }, [router])

  return (
    <PageLoader
      isLoading={isLoading}
      loadingText="Загрузка панели управления..."
      onLoadingComplete={() => setIsLoading(false)}
    />
  )
}
