"use client"

import { useEffect, useState } from "react"
import { BarChart3 } from "lucide-react"

interface PageLoaderProps {
  isLoading: boolean
  loadingText?: string
  onLoadingComplete?: () => void
}

export default function PageLoader({ isLoading, loadingText = "Загрузка...", onLoadingComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            if (onLoadingComplete) {
              setTimeout(onLoadingComplete, 200)
            }
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 100)

      return () => clearInterval(interval)
    } else {
      setProgress(100)
    }
  }, [isLoading, onLoadingComplete])

  if (!isLoading && progress >= 100) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <BarChart3 className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{loadingText}</h2>
          <p className="text-sm text-muted-foreground">Пожалуйста, подождите...</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}%</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
