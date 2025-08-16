import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../redux/slices/adminOrderSlice";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '30px',
        maxWidth: '960px',
        margin: '40px auto',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2.2em',
        color: '#333',
        marginBottom: '30px',
        fontWeight: '600',
        borderBottom: '2px solid #eee',
        paddingBottom: '15px',
    },
    message: {
        fontSize: '1.1em',
        color: '#555',
        padding: '20px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        margin: '20px 0',
    },
    errorMessage: {
        fontSize: '1.1em',
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        border: '1px solid #ef9a9a',
    },
    chartWrapper: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #eee',
    },
    axisLabels: {
        fontSize: '0.9em',
        fill: '#666',
    },
    tooltipContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    tooltipLabel: {
        color: '#555',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    legend: {
        paddingTop: '15px',
        fontSize: '0.95em',
        color: '#555',
    },
    noDataMessage: {
        fontSize: '1.1em',
        color: '#888',
        padding: '30px',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
    }
};

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

            // Filter by range
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

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Monthly Order Overview</h2>

            {loading && <p style={styles.message}>Loading order data...</p>}
            {error && <p style={styles.errorMessage}>Error: {error}. Please try again.</p>}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "25px",
                    flexWrap: "wrap",
                    background: "#f9fafb",
                    padding: "15px 20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    alignItems: "flex-end",
                }}
            >
                {[
                    { label: "From Year", value: fromYear, onChange: (e) => setFromYear(Number(e.target.value)), options: [2024, 2025, 2026, 2027] },
                    { label: "From Month", value: fromMonth, onChange: (e) => setFromMonth(Number(e.target.value)), options: monthNames.map((m, i) => ({ label: m, value: i + 1 })) },
                    { label: "To Year", value: toYear, onChange: (e) => setToYear(Number(e.target.value)), options: [2024, 2025, 2026, 2027] },
                    { label: "To Month", value: toMonth, onChange: (e) => setToMonth(Number(e.target.value)), options: monthNames.map((m, i) => ({ label: m, value: i + 1 })) },
                ].map((field, index) => (
                    <div key={index} style={{ display: "flex", flexDirection: "column", minWidth: "120px" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>
                            {field.label}
                        </label>
                        <select
                            value={field.value}
                            onChange={field.onChange}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #d1d5db",
                                fontSize: "0.95rem",
                                backgroundColor: "white",
                                cursor: "pointer",
                                transition: "border-color 0.2s ease",
                            }}
                            onMouseOver={(e) => (e.target.style.borderColor = "#4F46E5")}
                            onMouseOut={(e) => (e.target.style.borderColor = "#d1d5db")}
                        >
                            {field.options.map((opt, i) =>
                                typeof opt === "object" ? (
                                    <option key={i} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ) : (
                                    <option key={i} value={opt}>
                                        {opt}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                ))}

                <button
                    onClick={exportToExcel}
                    style={{
                        backgroundColor: "#4F46E5",
                        color: "white",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
                        transition: "background-color 0.2s ease, transform 0.1s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#4338CA")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#4F46E5")}
                    onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
                    onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                    📥 Download Excel
                </button>
            </div>


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

            {!loading && !error && (
                <div style={styles.chartWrapper}>
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={{ stroke: '#ccc' }}
                                    style={styles.axisLabels}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    style={styles.axisLabels}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div style={styles.tooltipContent}>
                                                    <div style={styles.tooltipLabel}>{label}</div>
                                                    <p style={{ margin: 0 }}>Orders: {data.orders}</p>
                                                    <p style={{ margin: 0 }}>Revenue: ₹{data.revenue}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend wrapperStyle={styles.legend} />
                                <Bar
                                    dataKey="orders"
                                    fill="#2196F3"
                                    name="Number of Orders"
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={styles.noDataMessage}>No order data available to display the chart.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Revenue
