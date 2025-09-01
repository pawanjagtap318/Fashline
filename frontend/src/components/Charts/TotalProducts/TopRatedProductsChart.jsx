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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TopRatedProductsChart = () => {
    const { user } = useSelector((state) => state.auth);
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAdminProducts());
        }
    }, [dispatch, user, navigate]);

    const getTopRatedProducts = (products, year) => {
        const ratingData = products
            .map(p => {
                const reviews = (p.reviews || []).filter(r => {
                    if (!r.createdAt) return false;
                    const reviewYear = new Date(r.createdAt).getFullYear();
                    return reviewYear === year;
                });

                if (reviews.length === 0) return null;

                const avgRating =
                    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

                return {
                    name: p.name,
                    avgRating: parseFloat(avgRating.toFixed(2)),
                    totalReviews: reviews.length,
                };
            })
            .filter(Boolean) // remove nulls
            .sort((a, b) => b.avgRating - a.avgRating)
            .slice(0, 5);

        return ratingData;
    };

    useEffect(() => {
        if (products.length > 0) {
            const chartData = getTopRatedProducts(products, selectedYear);
            setTopRatedProducts(chartData);
        }
    }, [products, selectedYear]);

    if (loading)
        return <p className="text-center text-lg text-gray-500 mt-10">Loading...</p>;
    if (error)
        return <p className="text-center text-lg text-red-500 mt-10">Error: {error}</p>;

    const chartData =
        topRatedProducts.length === 0
            ? [{ name: "No Data", avgRating: 0 }]
            : topRatedProducts;

    return (
        <div className="flex flex-col items-center px-4 py-6">
            <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 shadow-lg rounded-2xl p-6 w-full max-w-5xl transition-transform hover:scale-[1.01]">
                {/* Heading */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-2">
                    ⭐ Top 5 Products by Rating
                </h2>
                <div className="flex justify-center mb-6">
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map((year) => (
                            <option key={year} value={year} className="text-black">
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-center text-gray-500 text-sm md:text-base">
                    Based on customer feedback & average ratings
                </p>

                {/* Chart */}
                <div className="w-full h-[400px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 20, right: 40, left: 80, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={150}
                                tick={{ fontSize: 12, fontWeight: "500" }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} ★`, "Avg Rating"]}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="avgRating"
                                name="Avg Rating"
                                fill="#6366f1"
                                radius={[12, 12, 12, 12]}
                                barSize={30}
                            >
                                <LabelList
                                    dataKey="avgRating"
                                    position="right"
                                    className="font-semibold text-gray-700"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Footer Info */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    Max Rating: <span className="font-bold">5 ★</span>
                </div>
            </div>
        </div>
    );
};

export default TopRatedProductsChart;