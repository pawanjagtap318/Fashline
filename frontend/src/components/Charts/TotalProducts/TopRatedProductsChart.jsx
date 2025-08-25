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

const COLORS = "#facc15";

const TopRatedProductsChart = () => {
    const { user } = useSelector((state) => state.auth);
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [topRatedProducts, setTopRatedProducts] = useState([]);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAdminProducts());
        }
    }, [dispatch, user, navigate]);

    const getTopRatedProducts = (products) => {
        const ratingData = products
            .filter(p => p.rating && p.rating > 0)
            .map(p => ({
                name: p.name,
                avgRating: parseFloat(p.rating.toFixed(2)),
                totalReviews: p.numOfReviews || (p.reviews ? p.reviews.length : 0)
            }))
            .sort((a, b) => b.avgRating - a.avgRating)
            .slice(0, 5);

        return ratingData;
    };

    useEffect(() => {
        if (products.length > 0) {
            const chartData = getTopRatedProducts(products);
            setTopRatedProducts(chartData);
        }
    }, [products]);

    if (loading) return <p className="text-center text-lg text-gray-500 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-500 mt-10">Error: {error}</p>;

    const DEFAULT_COLOR = "#d1d5db";
    const chartData =
        topRatedProducts.length === 0
            ? [{ name: "No Data", avgRating: 0 }]
            : topRatedProducts;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    ⭐ Top 5 Products by Rating
                </h2>
                <div className="w-full h-[400px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                type="number"
                                domain={[0, 5]}
                                allowDecimals={true}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={150}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value, name, props) =>
                                    [`${value} ★`, "Avg Rating"]
                                }
                                contentStyle={{
                                    backgroundColor: "#fcfcfd",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="avgRating"
                                name="Avg Rating"
                                fill={chartData.length === 0 ? DEFAULT_COLOR : COLORS}
                                radius={[10, 10, 10, 10]}
                                barSize={25}
                            >
                                <LabelList dataKey="avgRating" position="right" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TopRatedProductsChart;