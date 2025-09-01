import OrdersLineChart from './TotalOrders/OrdersLineChart';
import TotalOrders from './TotalOrders/TotalOrders';
import { motion } from "framer-motion";

function Orders() {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-10 py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
        📊 Orders Overview
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-4xl hover:shadow-2xl transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          🧾 Total Orders
        </h2>
        <TotalOrders />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-4xl hover:shadow-2xl transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📈 Orders Trend
        </h2>
        <OrdersLineChart />
      </motion.div>
    </div>
  )
}

export default Orders
