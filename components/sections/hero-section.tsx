import { ArrowRight } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Amazing Platform</h1>
        <p className="text-xl text-gray-700 mb-8">Discover a world of possibilities with our innovative solutions.</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center">
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </section>
  )
}

export default HeroSection
