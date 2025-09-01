import { Link } from "react-router-dom"

function ProductGrid({ products, loading, error }) {
    if (loading) {
        return <p className="text-center py-10 text-gray-600">Loading...</p>
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">Error: {error}</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
            {products.map((product, index) => (
                <Link
                    key={index}
                    to={`/product/${product._id}`}
                    className="group block"
                >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                        {/* Product Image */}
                        <div className="relative w-full h-80 sm:h-96 overflow-hidden">
                            <img
                                src={product.images[0].url}
                                alt={product.images[0].altText || product.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 truncate">
                                {product.name}
                            </h3>
                            <p className="text-gray-500 font-medium text-sm tracking-wide mt-1">
                                ${product.price}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default ProductGrid
