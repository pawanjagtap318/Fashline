import heroImg from "../../assets/fashline-hero.webp"
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="relative w-full">
      {/* Background Image */}
      <img
        src={heroImg}
        alt="Fashline Hero"
        className="w-full h-[400px] sm:h-[500px] md:h-[650px] lg:h-[750px] object-cover"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight uppercase drop-shadow-lg animate-fadeIn">
            Vacation <br /> Ready
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto animate-slideUp">
            Explore our vacation-ready outfits with fast worldwide shipping.
          </p>

          {/* Button */}
          <div className="mt-6 animate-bounceIn">
            <Link
              to="collections/all"
              className="inline-block bg-white text-black px-6 sm:px-8 py-3 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-black hover:text-white hover:shadow-2xl transition-all duration-300"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;
