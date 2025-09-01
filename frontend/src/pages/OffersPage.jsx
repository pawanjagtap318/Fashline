import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOffers } from "../redux/slices/productsSlice";

function OffersPage() {
  const [days, setDays] = useState(0);
  const dispatch = useDispatch();
  const { offers, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  useEffect(() => {
    if (offers.length > 0 && offers[0].discountEndDate) {
      const endDate = new Date(offers[0].discountEndDate);
      const today = new Date();

      // normalize both to midnight
      endDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = endDate - today;
      const diffDays = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 0);

      setDays(diffDays);
    }
  }, [offers]);


  if (loading) return <p className="text-center">Loading offers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* 🔥 Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 text-white text-center py-4 rounded-2xl shadow-lg mb-8 animate-pulse">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          🔥 Hurry! Only{" "}
          <span className="bg-black/20 px-2 py-1 rounded-md text-black font-extrabold">
            {days + 1} {days + 1 > 1 ? "Days" : "Day"}
          </span>{" "}
          Left for These Hot Deals! 🔥
        </h1>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block group"
          >
            <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
              {/* Discount Badge */}
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{product.discountPercentage}%
              </span>

              {/* Product Image */}
              <div className="w-full h-60 overflow-hidden">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-full object-cover rounded-t-2xl transform group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Product Content */}
              <div className="p-4">
                <h2 className="text-base font-semibold mb-1 line-clamp-1 group-hover:text-red-500 transition">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="line-through text-gray-400 text-sm">
                    ${product.price}
                  </span>
                  <span className="text-lg text-green-600 font-bold">
                    ${product.discountPrice?.toFixed(2)}
                  </span>
                </div>

                {/* CTA Button */}
                <button className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-medium shadow hover:scale-105 transition duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OffersPage;
