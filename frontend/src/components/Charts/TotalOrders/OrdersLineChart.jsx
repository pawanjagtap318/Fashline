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

    if (loading) return <p className="text-center mt-10 text-lg">Loading Orders...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    📈 Monthly Orders Trend
                </h2>
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="year-select" style={{ marginRight: '10px' }}>Select Year:</label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '1em'
                            }}
                        >
                            {[2024, 2025, 2026, 2027].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="month"
                                interval={0}
                                padding={{ left: 10, right: 20 }}
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#0088FE"
                                strokeWidth={3}
                                dot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                </div>
            </div>
        </div>
    );
}

export default OrdersLineChart;
