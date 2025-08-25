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
      <h1 
        className="text-2xl w-fit font-bold mb-6 bg-yellow-100 text-red-600 px-4 py-2 rounded-lg"
      >
        🔥 Hurry! Only {days} {days > 1 ? "Days" : "Day"} Left for These Hot Deals! 🔥
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block"
          >
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              {/* Product Image */}
              <div className="w-full h-60 mb-4">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Name */}
              <h2 className="text-base font-semibold mb-1">{product.name}</h2>

              {/* Price + Discount */}
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="mt-2 text-sm">
                <span className="line-through text-gray-400 mr-2">
                  ${product.price}
                </span>
                <span className="text-green-600 font-bold">
                  ${product.discountPrice?.toFixed(2)}
                </span>
                <span className="ml-2 text-red-500 text-xs">
                  -{product.discountPercentage}%
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OffersPage;
