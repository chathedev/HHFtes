"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { Heart } from "lucide-react"
import { useState } from "react"

interface NewsCardProps {
  title: string
  date: string
  imageUrl: string
  link: string
  description: string
}

export default function NewsCard({ title, date, imageUrl, link, description }: NewsCardProps) {
  const [likes, setLikes] = useState(0)

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1)
  }

  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={link}>
        <div className="relative w-full h-48">
          <Image
            src={imageUrl || "/placeholder.svg?height=200&width=300&query=news article image"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time dateTime={date}>{format(new Date(date), "d MMMM yyyy", { locale: sv })}</time>
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Like this news article"
          >
            <Heart size={16} fill={likes > 0 ? "currentColor" : "none"} className={likes > 0 ? "text-red-500" : ""} />
            <span>{likes}</span>
          </button>
        </div>
        <Link href={link}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
        <Link href={link} className="text-orange-500 hover:underline text-sm font-medium">
          Läs mer
        </Link>
      </CardContent>
    </Card>
  )
}
