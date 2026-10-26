import Footer from "../components/layout/Footer"
import Navbar from "../components/layout/Navbar"
import Destinations from "../components/sections/Destinations"
import Features from "../components/sections/Features"
import Hero from "../components/sections/Hero"
import HowItWorks from "../components/sections/HowItWorks"
import Testimonials from "../components/sections/Testimonials"

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Destinations />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home
