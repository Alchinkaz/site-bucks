export interface ContactsData {
  phone: string
  email: string
  address: string
  workingHours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  whatsappNumbers: {
    primary: string
  }
  mapIframe: string
  gisLink: string
  gisButtonText: string
}

export const defaultContactsData: ContactsData = {
  phone: "+7 (777) 323-17-15",
  email: "info@baks.kz",
  address: "Республика Казахстан, 050000, г. Алматы, ул. Абая, 150/230",
  workingHours: {
    weekdays: "09:00 - 19:00",
    saturday: "10:00 - 16:00",
    sunday: "Выходной",
  },
  whatsappNumbers: {
    primary: "77053333082",
  },
  mapIframe: "",
  gisLink: "https://go.2gis.com/SQyMg",
  gisButtonText: "Смотреть в 2ГИС",
}

export const getContactsData = (): ContactsData => {
  if (typeof window === "undefined") return defaultContactsData

  const saved = localStorage.getItem("contacts_data")
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return { ...defaultContactsData, ...parsed }
    } catch {
      return defaultContactsData
    }
  }
  return defaultContactsData
}

export const saveContactsData = (data: ContactsData): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("contacts_data", JSON.stringify(data))
}

// Инициализация данных при первом запуске
export const initializeContactsData = (): void => {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("contacts_data")
  if (!existing) {
    saveContactsData(defaultContactsData)
  }
}
