import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log(" Fetching currency rates from kurs.kz informer")
    const timestamp = Date.now()
    const response = await fetch(`https://kurs.kz/informers/informer_frame.php?t=${timestamp}`, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from kurs.kz informer")
    }

    const html = await response.text()
    console.log(" HTML received from informer, length:", html.length)
    console.log(" HTML preview:", html.substring(0, 500))

    const currencyRates = parseKursKzInformerData(html)
    console.log(" Parsed currency rates:", currencyRates)

    return NextResponse.json(
      {
        success: true,
        rates: currencyRates,
        lastUpdated: new Date().toISOString(),
        source: "kurs.kz informer",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching currency rates from kurs.kz informer:", error)

    try {
      console.log(" Using fallback API")
      const fallbackResponse = await fetch("https://api.exchangerate-api.com/v4/latest/KZT", {
        cache: "no-store",
      })

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json()

        const usdRate = 1 / data.rates.USD
        const eurRate = 1 / data.rates.EUR
        const rubRate = 1 / data.rates.RUB

        const currencyRates = [
          {
            currency: "USD",
            buyRate: Math.round(usdRate * 0.998 * 10) / 10,
            sellRate: Math.round(usdRate * 1.002 * 10) / 10,
            buyChange: 0,
            sellChange: 0,
          },
          {
            currency: "EUR",
            buyRate: Math.round(eurRate * 0.998 * 10) / 10,
            sellRate: Math.round(eurRate * 1.002 * 10) / 10,
            buyChange: 0,
            sellChange: 0,
          },
          {
            currency: "RUB",
            buyRate: Math.round(rubRate * 0.998 * 100) / 100,
            sellRate: Math.round(rubRate * 1.002 * 100) / 100,
            buyChange: 0,
            sellChange: 0,
          },
        ]

        console.log(" Fallback rates:", currencyRates)
        return NextResponse.json(
          {
            success: true,
            rates: currencyRates,
            lastUpdated: new Date().toISOString(),
            source: "exchangerate-api (fallback)",
          },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
              "Surrogate-Control": "no-store",
            },
          },
        )
      }
    } catch (fallbackError) {
      console.error("Fallback API also failed:", fallbackError)
    }

    const defaultRates = getCurrentMarketRates()

    console.log(" Using updated default rates")
    return NextResponse.json(
      {
        success: false,
        rates: defaultRates,
        error: "Failed to fetch live rates, using default values",
        lastUpdated: new Date().toISOString(),
        source: "default",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      },
    )
  }
}

function parseKursKzInformerData(html: string) {
  try {
    console.log(" Starting improved informer HTML parsing")
    console.log(" HTML content sample:", html.substring(0, 1000))

    // Strategy 1: Look for any table structure with currency data
    const tableMatches = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi)
    if (tableMatches) {
      console.log(` Found ${tableMatches.length} tables in HTML`)
      for (let i = 0; i < tableMatches.length; i++) {
        console.log(` Table ${i} preview:`, tableMatches[i].substring(0, 200))
      }
    }

    const astanaSection = html.match(/Обменные пункты Астана[\s\S]*?(?=Обменные пункты|$)/i)

    if (!astanaSection) {
      console.log(" Astana section not found, trying general parsing")
      return parseGeneralCurrencyData(html)
    }

    console.log(" Found Astana section, parsing...")
    return parseAstanaCurrencyData(astanaSection[0])
  } catch (error) {
    console.error("Error parsing kurs.kz informer data:", error)
    return getCurrentMarketRates()
  }
}

function parseGeneralCurrencyData(html: string) {
  const currencyRates = []
  console.log(" Parsing general currency data")

  const patterns = [
    {
      currency: "USD",
      patterns: [
        /USD[\s\S]*?(\d{3}(?:\.\d{1,2})?)[\s\S]*?(\d{3}(?:\.\d{1,2})?)/i,
        /доллар[\s\S]*?(\d{3}(?:\.\d{1,2})?)[\s\S]*?(\d{3}(?:\.\d{1,2})?)/i,
        />(\d{3}(?:\.\d{1,2})?)<[\s\S]*?>(\d{3}(?:\.\d{1,2})?)<[\s\S]*?USD/i,
      ],
      min: 500,
      max: 600,
    },
    {
      currency: "EUR",
      patterns: [
        /EUR[\s\S]*?(\d{3}(?:\.\d{1,2})?)[\s\S]*?(\d{3}(?:\.\d{1,2})?)/i,
        /евро[\s\S]*?(\d{3}(?:\.\d{1,2})?)[\s\S]*?(\d{3}(?:\.\d{1,2})?)/i,
        />(\d{3}(?:\.\d{1,2})?)<[\s\S]*?>(\d{3}(?:\.\d{1,2})?)<[\s\S]*?EUR/i,
      ],
      min: 600,
      max: 700,
    },
    {
      currency: "RUB",
      patterns: [
        /RUB[\s\S]*?(\d\.\d{1,2})[\s\S]*?(\d\.\d{1,2})/i,
        /рубль[\s\S]*?(\d\.\d{1,2})[\s\S]*?(\d\.\d{1,2})/i,
        />(\d\.\d{1,2})<[\s\S]*?>(\d\.\d{1,2})<[\s\S]*?RUB/i,
      ],
      min: 5,
      max: 8,
    },
  ]

  for (const { currency, patterns: currencyPatterns, min, max } of patterns) {
    let found = false

    for (const pattern of currencyPatterns) {
      if (found) break

      const match = html.match(pattern)
      if (match) {
        const buyRate = Number.parseFloat(match[1])
        const sellRate = Number.parseFloat(match[2])

        console.log(` Found ${currency} rates with pattern: ${buyRate}/${sellRate}`)

        if (buyRate >= min && buyRate <= max && sellRate >= min && sellRate <= max && buyRate < sellRate) {
          currencyRates.push({
            currency,
            buyRate,
            sellRate,
            buyChange: 0,
            sellChange: 0,
          })
          console.log(` Accepted ${currency} rates: ${buyRate}/${sellRate}`)
          found = true
        } else {
          console.log(` Rejected ${currency} rates (out of range): ${buyRate}/${sellRate}`)
        }
      }
    }
  }

  // Fill missing currencies with current market rates
  const foundCurrencies = currencyRates.map((rate) => rate.currency)
  const marketRates = getCurrentMarketRates()

  for (const marketRate of marketRates) {
    if (!foundCurrencies.includes(marketRate.currency)) {
      console.log(` Adding fallback rate for ${marketRate.currency}`)
      currencyRates.push(marketRate)
    }
  }

  console.log(` Final parsed rates count: ${currencyRates.length}`)
  return currencyRates.length > 0 ? currencyRates : getCurrentMarketRates()
}

function parseAstanaCurrencyData(astanaHtml: string) {
  const currencyRates = []
  console.log(" Parsing Astana currency data")
  console.log(" Astana HTML sample:", astanaHtml.substring(0, 500))

  const tableRowPattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi
  const rows = astanaHtml.match(tableRowPattern) || []

  console.log(` Found ${rows.length} table rows in Astana section`)

  for (const row of rows) {
    console.log(" Processing row:", row.substring(0, 200))

    // Extract currency code and rates from table cells
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi
    const cells = []
    let cellMatch

    while ((cellMatch = cellPattern.exec(row)) !== null) {
      let cellContent = cellMatch[1]

      // Remove HTML tags first
      cellContent = cellContent.replace(/<[^>]*>/g, " ")

      // Clean up whitespace and special characters
      cellContent = cellContent.replace(/&nbsp;/g, " ").trim()

      // For currency cells, just get the currency code
      if (/^[A-Z]{3}$/.test(cellContent.trim())) {
        cells.push(cellContent.trim())
      } else {
        // For numeric cells, extract the first valid number
        const numericMatch = cellContent.match(/(\d+(?:\.\d{1,2})?)/)
        if (numericMatch) {
          cells.push(numericMatch[1])
        } else {
          cells.push(cellContent.trim())
        }
      }
    }

    console.log(" Row cells:", cells)

    if (cells.length >= 3) {
      const currencyCode = cells[0].toUpperCase()

      if (["USD", "EUR", "RUB"].includes(currencyCode)) {
        const buyRate = Number.parseFloat(cells[1])
        const sellRate = Number.parseFloat(cells[2])

        console.log(` Found ${currencyCode}: buy=${buyRate}, sell=${sellRate}`)

        // Validate rates are reasonable
        const isValidUSD =
          currencyCode === "USD" && buyRate >= 500 && buyRate <= 600 && sellRate >= 500 && sellRate <= 600
        const isValidEUR =
          currencyCode === "EUR" && buyRate >= 600 && buyRate <= 700 && sellRate >= 600 && sellRate <= 700
        const isValidRUB = currencyCode === "RUB" && buyRate >= 5 && buyRate <= 8 && sellRate >= 5 && sellRate <= 8

        if ((isValidUSD || isValidEUR || isValidRUB) && buyRate < sellRate && !isNaN(buyRate) && !isNaN(sellRate)) {
          currencyRates.push({
            currency: currencyCode,
            buyRate,
            sellRate,
            buyChange: 0,
            sellChange: 0,
          })
          console.log(` Added ${currencyCode} rates: ${buyRate}/${sellRate}`)
        } else {
          console.log(` Rejected ${currencyCode} rates (invalid): ${buyRate}/${sellRate}`)
        }
      }
    }
  }

  if (currencyRates.length === 0) {
    console.log(" No rates found in table rows, trying enhanced alternative parsing")

    // More specific patterns that avoid duplication
    const currencyPatterns = [
      {
        currency: "USD",
        pattern: /USD[\s\S]*?(\d{3})[\s\S]*?(\d{3})/i,
        min: 500,
        max: 600,
      },
      {
        currency: "EUR",
        pattern: /EUR[\s\S]*?(\d{3})[\s\S]*?(\d{3})/i,
        min: 600,
        max: 700,
      },
      {
        currency: "RUB",
        pattern: /RUB[\s\S]*?(\d\.\d{1,2})[\s\S]*?(\d\.\d{1,2})/i,
        min: 5,
        max: 8,
      },
    ]

    for (const { currency, pattern, min, max } of currencyPatterns) {
      const match = astanaHtml.match(pattern)
      if (match) {
        const buyRate = Number.parseFloat(match[1])
        const sellRate = Number.parseFloat(match[2])

        if (buyRate >= min && buyRate <= max && sellRate >= min && sellRate <= max && buyRate < sellRate) {
          currencyRates.push({
            currency,
            buyRate,
            sellRate,
            buyChange: 0,
            sellChange: 0,
          })
          console.log(` Alternative parsing found ${currency} rates: ${buyRate}/${sellRate}`)
        }
      }
    }
  }

  console.log(` Final Astana rates found: ${currencyRates.length}`)
  return currencyRates.length > 0 ? currencyRates : getCurrentMarketRates()
}

function getCurrentMarketRates() {
  console.log(" Using zero default rates - forcing actual data extraction")
  return [
    {
      currency: "USD",
      buyRate: 0,
      sellRate: 0,
      buyChange: 0,
      sellChange: 0,
    },
    {
      currency: "EUR",
      buyRate: 0,
      sellRate: 0,
      buyChange: 0,
      sellChange: 0,
    },
    {
      currency: "RUB",
      buyRate: 0,
      sellRate: 0,
      buyChange: 0,
      sellChange: 0,
    },
  ]
}
