import { NextResponse } from "next/server"

export async function GET() {
  const events = [
    {
      id: "1",
      date: "2024-03-10",
      time: "14:00",
      title: "Träningsmatch: Härnösands HF vs. Sundsvall HK",
      location: "Härnösands Sporthall",
    },
    {
      id: "2",
      date: "2024-03-15",
      time: "18:30",
      title: "Seriespel: Härnösands HF vs. Östersunds HK",
      location: "Östersund Arena",
    },
    {
      id: "3",
      date: "2024-03-22",
      time: "19:00",
      title: "Klubbmöte",
      location: "Klubbhuset",
    },
    {
      id: "4",
      date: "2024-03-28",
      time: "16:00",
      title: "Ungdomsträning: Alla åldrar",
      location: "Härnösands Sporthall",
    },
  ]
  return NextResponse.json(events)
}
