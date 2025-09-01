import menCollectionImage from "../../assets/mens-collection.webp"
import womenCollectionImage from "../../assets/womens-collection.webp"
import { Link } from 'react-router-dom'

function GenderCollectionSection() {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Women's Collection */}
        <div className="relative group rounded-3xl overflow-hidden shadow-lg">
          <img
            src={womenCollectionImage}
            alt="Women's Collection"
            className="w-full h-[500px] md:h-[650px] object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="inline-block bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow-md hover:bg-black hover:text-white transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
        {/* Men's Collection */}
        <div className="relative group rounded-3xl overflow-hidden shadow-lg">
          <img
            src={menCollectionImage}
            alt="Men's Collection"
            className="w-full h-[500px] md:h-[650px] object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="inline-block bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow-md hover:bg-black hover:text-white transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderCollectionSection
