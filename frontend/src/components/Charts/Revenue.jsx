import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../redux/slices/adminOrderSlice";
import { useDispatch } from "react-redux";

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

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Monthly Order Overview</h2>

            {loading && <p style={styles.message}>Loading order data...</p>}
            {error && <p style={styles.errorMessage}>Error: {error}. Please try again.</p>}

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
