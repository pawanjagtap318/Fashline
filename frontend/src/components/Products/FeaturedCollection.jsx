import { Link } from "react-router-dom"
import featured from "../../assets/featured.webp"

function FeaturedCollection() {
    return (
        <section className="py-2 px-4 lg:px-0">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center 
        bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-3xl shadow-xl overflow-hidden">

                {/* Left Content */}
                <div className="lg:w-1/2 p-10 text-center lg:text-left animate-fadeIn">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Comfort & Style
                    </h2>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                        Apparel made for <br className="hidden sm:block" /> your everyday life
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-xl mx-auto lg:mx-0">
                        Discover high-quality, comfortable clothing that effortlessly blends fashion
                        and function. Designed to make you look and feel great every single day.
                    </p>
                    <Link
                        to="/collections/all"
                        className="inline-block bg-black text-white px-6 sm:px-8 py-3 sm:py-4 
              rounded-full text-base sm:text-lg font-semibold shadow-lg 
              hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        Shop Now →
                    </Link>
                </div>

                {/* Right Content */}
                <div className="lg:w-1/2 animate-slideIn">
                    <img
                        src={featured}
                        alt="Featured Collection"
                        className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl transform hover:scale-105 transition duration-500"
                    />
                </div>
            </div>
        </section>
    )
}

export default FeaturedCollection
