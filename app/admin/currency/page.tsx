"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Clock, Globe } from "lucide-react"
import { getHomepageData, updateHomepageData, type CurrencyRate } from "@/lib/supabase-homepage"

export default function CurrencyManagement() {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingRates, setIsUpdatingRates] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Admin loading currency data")
        const data = await getHomepageData()
        setCurrencyRates(data.currencyRates || [])
        console.log("Admin loaded rates:", data.currencyRates)
      } catch (error) {
        console.error("Error loading currency data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpdateRates = async () => {
    setIsUpdatingRates(true)
    try {
      console.log("Admin updating currency rates")
      const timestamp = Date.now()
      const response = await fetch(`/api/currency-rates?t=${timestamp}&admin=true`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      const data = await response.json()

      if (data.success) {
        console.log("Admin received fresh rates:", data.rates)
        setCurrencyRates(data.rates)
        setLastUpdated(data.lastUpdated)

        await updateHomepageData({ currencyRates: data.rates })
        console.log("Homepage data updated from admin panel")
      } else {
        console.error("Failed to update rates:", data.error)
      }
    } catch (error) {
      console.error("Error updating currency rates:", error)
    } finally {
      setIsUpdatingRates(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Загрузка...</h1>
          <p className="text-muted-foreground">Подготовка данных курсов валют</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Управление курсами валют</h1>
          <p className="text-muted-foreground mt-2">
            Актуальные курсы валют, которые отображаются на главной странице сайта
          </p>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
              <Clock className="h-4 w-4" />
              Последнее обновление: {new Date(lastUpdated).toLocaleString("ru-RU")}
            </div>
          )}
        </div>
        <Button
          onClick={handleUpdateRates}
          disabled={isUpdatingRates}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isUpdatingRates ? "animate-spin" : ""}`} />
          {isUpdatingRates ? "Обновление..." : "Обновить"}
        </Button>
      </div>

      <div className="flex justify-between gap-6">
        {/* Левая колонка - Текущие курсы валют */}
        <div className="flex-[2]">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-xl">Текущие курсы валют</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currencyRates
                  .filter((rate) => rate.buyRate > 0 && rate.sellRate > 0)
                  .map((rate) => (
                    <div key={rate.currency} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-sm">
                          {rate.currency === "USD"
                            ? "Доллар США"
                            : rate.currency === "EUR"
                              ? "Евро"
                              : rate.currency === "RUB"
                                ? "Российский рубль"
                                : rate.currency}
                        </Badge>
                        <span className="font-bold text-lg">{rate.currency}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Покупка</div>
                          <div className="font-semibold text-lg">{rate.buyRate}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Продажа</div>
                          <div className="font-semibold text-lg">{rate.sellRate}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0">
          <div style={{ width: "350px", height: "350px" }}>
            <iframe
              src="https://kurs.kz/informers/informer_frame.php"
              width="350"
              height="350"
              frameBorder="0"
              scrolling="no"
              title="Курсы валют Казахстана"
              className="block"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
