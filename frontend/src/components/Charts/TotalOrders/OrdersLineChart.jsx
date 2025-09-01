import { useSelector, useDispatch } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../../redux/slices/adminOrderSlice";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function OrdersLineChart() {
    const { user } = useSelector((state) => state.auth);
    const { orders, loading, error } = useSelector((state) => state.adminOrders);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);

    const getMonthlyOrders = (orders) => {
        const monthCounts = Array(12).fill(0);

        orders.forEach((order) => {
            if (!order.deliveredAt) return;

            const date = new Date(order.deliveredAt);
            const year = date.getFullYear();
            if (year === selectedYear) {
                const month = date.getMonth();
                monthCounts[month]++;
            }
        });

        return monthNames.map((name, index) => ({
            month: name,
            orders: monthCounts[index],
        }));
    };

    const data = getMonthlyOrders(orders);

    if (loading) return <p className="text-center mt-10 text-lg">⏳ Loading Orders...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">❌ Error: {error}</p>;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl transition-transform duration-300 hover:scale-[1.01]">
                {/* Header */}
                <h2 className="text-3xl font-extrabold text-center text-black mb-2">
                    📈 Monthly Orders Trend
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Visualize your order growth across months
                </p>

                {/* Year Selector */}
                <div className="flex justify-center mb-6">
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Chart */}
                <div className="w-full h-[400px]">
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                            <XAxis
                                dataKey="month"
                                interval={0}
                                padding={{ left: 10, right: 20 }}
                                tick={{ fill: "#4B5563", fontSize: 14 }}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: "#4B5563", fontSize: 14 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                                }}
                                labelStyle={{ color: "#374151", fontWeight: "600" }}
                            />
                            <Legend verticalAlign="top" height={40} />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="url(#colorOrders)"
                                strokeWidth={4}
                                dot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
                                activeDot={{ r: 10, fill: "#2563eb" }}
                                animationDuration={1200}
                            />
                            {/* Gradient Line Color */}
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default OrdersLineChart;
