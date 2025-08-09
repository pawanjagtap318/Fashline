import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
    Legend
} from 'recharts';
import { fetchAdminProducts } from '../../../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../../../redux/slices/adminOrderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const COLORS = "#38bdf8";

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

    const DEFAULT_COLOR = "#d1d5db"; // gray
    const totalCount = topProducts.reduce((sum, p) => sum + p.totalSold, 0);

    const chartData =
        totalCount === 0
            ? [{ name: "No Data", totalSold: 1 }]
            : topProducts;

    if (loading) return <p className="text-center text-lg text-gray-500 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-500 mt-10">Error: {error}</p>;


    return (
        <div className="flex flex-col items-center justify-center px-4 py-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    🏆 Top 10 Products by Sales
                </h2>
                <div className='mt-8'>
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
                <div className="w-full h-[500px]">
                    <div
                        key={selectedYear}
                        className="animate-fadeIn h-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topProducts}
                                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis dataKey="name" type="category" tick={false} width={0} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fcfcfd",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                {totalCount === 0 && (
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#6b7280"
                                        fontSize={16}
                                    >
                                        No data available
                                    </text>
                                )}
                                <Bar
                                    dataKey="totalSold"
                                    name="Total Sold"
                                    fill={totalCount === 0 ? DEFAULT_COLOR : COLORS}
                                    radius={[10, 10, 10, 10]}
                                    barSize={25}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopSellingProductsChart;
