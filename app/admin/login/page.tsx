"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Eye, EyeOff, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import * as AdminService from "@/lib/supabase-admin"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await AdminService.authenticateUser(username, password)

      if (user) {
        // Создаем сессию
        const token = await AdminService.createSession(user.id)
        
        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem("admin_token", token)
        localStorage.setItem("current_user", JSON.stringify(user))

        router.push("/admin")
      } else {
        setError("Неверный логин или пароль")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Ошибка при входе в систему")
    }

    setIsLoading(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="relative w-full max-w-md space-y-8">
        {/* Login Card */}
        <Card className="shadow-xl border-gray-700" style={{ backgroundColor: "#141415" }}>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                  Логин
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Введите логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ backgroundColor: "#1a1a1a" }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ backgroundColor: "#1a1a1a" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-600 bg-red-900/20">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-white font-medium shadow-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#16a34a" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin" />
                    Вход...
                  </div>
                ) : (
                  "Войти в систему"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
