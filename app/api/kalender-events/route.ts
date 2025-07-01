import { NextResponse } from "next/server"

export async function GET() {
  const events = [
    {
      id: "1",
      date: "2024-07-20",
      time: "14:00",
      title: "Match: Härnösands FF vs. Sundsvalls BK",
      location: "Härnösands Arena",
      category: "match",
    },
    {
      id: "2",
      date: "2024-07-25",
      time: "18:00",
      title: "Träning: Herrlaget",
      location: "Träningsplan 1",
      category: "training",
    },
    {
      id: "3",
      date: "2024-08-01",
      time: "10:00",
      title: "Ungdomsturnering",
      location: "Härnösands Arena",
      category: "tournament",
    },
    {
      id: "4",
      date: "2024-08-05",
      time: "19:00",
      title: "Styrelsemöte",
      location: "Klubbhuset",
      category: "meeting",
    },
    {
      id: "5",
      date: "2024-08-10",
      time: "16:00",
      title: "Match: Damlaget vs. Östersunds DFF",
      location: "Härnösands Arena",
      category: "match",
    },
  ]

  return NextResponse.json(events)
}
