import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
} from 'recharts';
import { fetchAdminProducts } from '../../../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../../../redux/slices/adminOrderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

const COLORS = "url(#barGradient)";

const TopSellingProductsChart = () => {
    const { user } = useSelector((state) => state.auth);
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const { orders } = useSelector((state) => state.adminOrders);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [topProducts, setTopProducts] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAdminProducts());
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);

    const getTopSellingProducts = (products, orders) => {
        const salesMap = {};

        orders.forEach(order => {
            if (!order.deliveredAt) return;

            const date = new Date(order.deliveredAt);
            const year = date.getFullYear();
            if (year === selectedYear) {
                order.orderItems.forEach(item => {
                    const product = products.find(p => p._id === item.productId);
                    if (product) {
                        if (!salesMap[product._id]) {
                            salesMap[product._id] = {
                                name: product.name,
                                totalSold: 0
                            };
                        }
                        salesMap[product._id].totalSold += item.quantity;
                    }
                });
            }
        });

        const sorted = Object.values(salesMap)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 10);

        return sorted;
    };

    useEffect(() => {
        const chartData = getTopSellingProducts(products, orders);
        setTopProducts(chartData);
    }, [products, orders, selectedYear]);

    const DEFAULT_COLOR = "#d1d5db";
    const totalCount = topProducts.reduce((sum, p) => sum + p.totalSold, 0);

    if (loading) return <p className="text-center text-lg text-gray-500 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-500 mt-10">Error: {error}</p>;


    return (
        <div className="flex flex-col items-center justify-center px-4 py-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-6 w-full max-w-6xl"
            >
                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
                    🏆 Top 10 Products by Sales
                </h2>

                {/* Year Selector */}
                <div className="flex justify-center mb-6">
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map((year) => (
                            <option key={year} value={year} className="text-black">
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chart */}
                <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={
                                totalCount === 0
                                    ? [{ name: "No Data", totalSold: 1 }]
                                    : topProducts
                            }
                            margin={{ top: 20, right: 40, left: 50, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#38bdf8" />
                                    <stop offset="100%" stopColor="#0ea5e9" />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 14, fill: "#374151" }}
                                width={150}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "10px",
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="totalSold"
                                name="Total Sold"
                                fill={totalCount === 0 ? DEFAULT_COLOR : COLORS}
                                radius={[8, 8, 8, 8]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default TopSellingProductsChart;
