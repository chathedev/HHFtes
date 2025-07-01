import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Amazing Website</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover the best solutions for your needs. We offer high-quality products and services to help you succeed.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Learn More <ArrowRight className="inline-block ml-2" size={16} />
        </button>
      </div>
    </section>
  )
}
