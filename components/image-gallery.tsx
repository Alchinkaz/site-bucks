"use client"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  isOpen: boolean
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function ImageGallery({ images, isOpen, currentIndex, onClose, onNext, onPrevious }: ImageGalleryProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
      >
        <X size={24} />
      </button>

      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3 hidden lg:block"
        disabled={images.length <= 1}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3 hidden lg:block"
        disabled={images.length <= 1}
      >
        <ChevronRight size={32} />
      </button>

      <div className={`w-full max-w-4xl mx-8 transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}>
        <div className="aspect-video">
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Работа ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-8 lg:hidden">
        <button
          onClick={onPrevious}
          className="z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
          disabled={images.length <= 1}
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={onNext}
          className="z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
          disabled={images.length <= 1}
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  )
}
