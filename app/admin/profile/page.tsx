"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as AdminService from "@/lib/supabase-admin"
import type { User } from "@/lib/admin-storage"
import { Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!currentUser) return

    // Validate new password
    if (passwordData.newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов")
      return
    }

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    try {
      // Update password in Supabase
      const success = await AdminService.updateUserPassword(
        currentUser.id,
        passwordData.currentPassword,
        passwordData.newPassword
      )

      if (success) {
        setMessage("Пароль успешно изменен")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setIsChangingPassword(false)
      } else {
        setError("Неверный текущий пароль")
      }
    } catch (error) {
      console.error("Password change error:", error)
      setError("Ошибка при изменении пароля")
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Профиль администратора</h1>
        <p className="text-muted-foreground">Управление настройками аккаунта</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Информация о пользователе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {currentUser?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{currentUser?.username}</h3>
              <p className="text-muted-foreground">Администратор</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <div>
              <p className="text-muted-foreground mb-4">Измените пароль для обеспечения безопасности вашего аккаунта</p>
              <Button onClick={() => setIsChangingPassword(true)} className="bg-primary hover:bg-primary/90">
                Изменить пароль
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pr-10 bg-input border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Новый пароль</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pr-10 bg-input border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pr-10 bg-input border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert>
                  <AlertDescription className="text-green-600">{message}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Сохранить пароль
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                    setError("")
                    setMessage("")
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
