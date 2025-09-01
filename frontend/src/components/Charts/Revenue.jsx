import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../redux/slices/adminOrderSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Revenue() {
    const { user } = useSelector((state) => state.auth);
    const { orders, loading, error } = useSelector((state) => state.adminOrders);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [fromMonth, setFromMonth] = useState(new Date().getMonth() + 1);
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [toMonth, setToMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const getChartData = (orders) => {
        const monthCounts = Array(12).fill(0);
        const monthRevenue = Array(12).fill(0);

        orders.forEach((order) => {
            if (!order.deliveredAt) return;

            const date = new Date(order.deliveredAt);
            const year = date.getFullYear();
            if (year === selectedYear) {
                const month = date.getMonth();
                monthCounts[month]++;
                monthRevenue[month] += order.totalPrice;
            }
        });

        return monthNames.map((name, index) => ({
            name,
            orders: monthCounts[index],
            revenue: parseFloat(monthRevenue[index].toFixed(2)),
        }));
    };

    const data = getChartData(orders);

    const exportToExcel = () => {
        let monthlyData = {};

        orders.forEach((order) => {
            if (!order.deliveredAt) return;
            const date = new Date(order.deliveredAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const startKey = fromYear * 100 + fromMonth;
            const endKey = toYear * 100 + toMonth;
            const currentKey = year * 100 + month;

            if (currentKey >= startKey && currentKey <= endKey) {
                const key = `${year}-${month.toString().padStart(2, "0")}`;
                if (!monthlyData[key]) {
                    monthlyData[key] = { month: key, orders: 0, revenue: 0 };
                }
                monthlyData[key].orders += 1;
                monthlyData[key].revenue += order.totalPrice;
            }
        });

        const excelData = Object.values(monthlyData).map((item) => ({
            Month: item.month,
            Orders: item.orders,
            Revenue: parseFloat(item.revenue.toFixed(2)),
        }));

        if (excelData.length === 0) {
            alert("No data found for the selected range.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Orders");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `Orders_${fromYear}-${fromMonth}_to_${toYear}-${toMonth}.xlsx`);
    };

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 pb-3 border-b">
                📊 Monthly Order Overview
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end bg-gray-50 p-5 rounded-xl shadow-sm mb-6">
                {/* From Year */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">From Year</label>
                    <select
                        value={fromYear}
                        onChange={(e) => setFromYear(Number(e.target.value))}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                        {[2024, 2025, 2026, 2027].map((year) => (
                            <option key={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* From Month */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">From Month</label>
                    <select
                        value={fromMonth}
                        onChange={(e) => setFromMonth(Number(e.target.value))}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                        {monthNames.map((m, i) => (
                            <option key={i} value={i + 1}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>

                {/* To Year */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">To Year</label>
                    <select
                        value={toYear}
                        onChange={(e) => setToYear(Number(e.target.value))}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                        {[2024, 2025, 2026, 2027].map((year) => (
                            <option key={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* To Month */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">To Month</label>
                    <select
                        value={toMonth}
                        onChange={(e) => setToMonth(Number(e.target.value))}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                        {monthNames.map((m, i) => (
                            <option key={i} value={i + 1}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Download Button */}
            <div className="text-center mb-8">
                <button
                    onClick={exportToExcel}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
                >
                    📥 Download Excel
                </button>
            </div>

            {/* Year Selector */}
            <div className="text-center mb-6">
                <label className="mr-3 font-medium text-gray-700">Select Year:</label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                >
                    {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <option key={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 rounded-xl shadow-inner p-6">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "#ccc" }} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                                <p className="font-semibold text-gray-700">{label}</p>
                                                <p className="text-sm text-gray-600">Orders: {data.orders}</p>
                                                <p className="text-sm text-gray-600">Revenue: ₹{data.revenue}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: "10px" }} />
                            <Bar dataKey="orders" fill="#4F46E5" name="Number of Orders" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center py-10">No order data available to display.</p>
                )}
            </div>
        </div>
    )
}

export default Revenue
