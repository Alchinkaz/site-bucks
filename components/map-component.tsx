"use client"

import { memo } from "react"

interface MapComponentProps {
  mapIframe?: string
}

const MapComponent = memo(({ mapIframe }: MapComponentProps) => {
  console.log("MapComponent rendering with iframe:", mapIframe ? "present" : "not present")

  return (
    <div className="bg-gray-700 rounded-2xl overflow-hidden shadow-lg h-[360px] flex items-center justify-center">
      {mapIframe ? (
        <div
          className="w-full h-full [&>*]:w-full [&>*]:h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: mapIframe }}
        />
      ) : (
        <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "360px" }}>
          <a
            href="https://yandex.kz/maps/162/almaty/?utm_medium=mapframe&utm_source=maps"
            style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "0px" }}
          >
            Алматы
          </a>
          <a
            href="https://yandex.kz/maps/geo/almaty/53168302/?from=mapframe&ll=76.952539%2C43.218606&source=mapframe&utm_medium=mapframe&utm_source=maps&z=10"
            style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "14px" }}
          >
            Алматы — Яндекс Карты
          </a>
          <iframe
            src="https://yandex.kz/map-widget/v1/?from=mapframe&ll=76.952539%2C43.218606&mode=search&ol=geo&ouri=ymapsbm1%3A%2Fyandex.kz/map-widget/v1/?from=mapframe&ll=76.952539%2C43.218606&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzE2ODMwMhIg0prQsNC30LDSm9GB0YLQsNC90LDQvdGC0YsiCg0r5JlCFdvyLEI%2C&source=mapframe&utm_source=mapframe&z=10"
            width="100%"
            height="100%"
            frameBorder="1"
            allowFullScreen={true}
            style={{ position: "relative", borderRadius: "1rem" }}
          />
        </div>
      )}
    </div>
  )
})

MapComponent.displayName = "MapComponent"

export default MapComponent
