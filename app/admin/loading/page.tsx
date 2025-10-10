"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PageLoader from "@/components/ui/page-loader"
import * as AdminService from "@/lib/supabase-admin"

export default function AdminLoading() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token")
        if (!token || token === "authenticated") {
          router.push("/admin/login")
          return
        }

        const user = await AdminService.validateSession(token)
        if (!user) {
          localStorage.removeItem("admin_token")
          localStorage.removeItem("current_user")
          router.push("/admin/login")
          return
        }

        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error checking auth:", error)
        localStorage.removeItem("admin_token")
        localStorage.removeItem("current_user")
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
