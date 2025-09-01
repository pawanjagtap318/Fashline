import ProductChart from "./TotalProducts/ProductChart";
import TopRatedProductsChart from "./TotalProducts/TopRatedProductsChart";
import TopSellingProductsChart from "./TotalProducts/TopSellingProducts";
import { motion } from "framer-motion";

function Products() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
        📦 Products Dashboard
      </h1>

      {/* Product Chart */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-5xl hover:shadow-2xl transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📊 Total Products
        </h2>
        <ProductChart />
      </motion.div>

      {/* Top Selling Products */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-5xl hover:shadow-2xl transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          🏆 Top Selling Products
        </h2>
        <TopSellingProductsChart />
      </motion.div>

      {/* Top Rated Products */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-5xl hover:shadow-2xl transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          ⭐ Top Rated Products
        </h2>
        <TopRatedProductsChart />
      </motion.div>
    </div>
  )
}

export default Products;