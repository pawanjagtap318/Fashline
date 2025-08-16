import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchAdminProducts } from "../../../redux/slices/adminProductSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllOrders } from "../../../redux/slices/adminOrderSlice";
import * as XLSX from "xlsx";


const COLORS = {
    totalStock: "#FFBB28",
    inStock: "#00C49F",
    sold: "#FF4444",
};

function ProductChart() {
    const { user } = useSelector((state) => state.auth);
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const { orders } = useSelector((state) => state.adminOrders);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAdminProducts());
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);

    const getProductStockData = (products, orders) => {
        const soldQuantities = {};

        orders.forEach((order) => {
            order.orderItems.forEach((item) => {
                soldQuantities[item.productId] = (soldQuantities[item.productId] || 0) + item.quantity;
            });
        });

        const categoryData = {};

        products.forEach((product) => {
            const soldQuantity = soldQuantities[product._id] || 0;
            const totalProducts = product.countInStock + soldQuantity;

            if (!categoryData[product.brand]) {
                categoryData[product.brand] = { totalStock: 0, inStock: 0, sold: 0 };
            }

            categoryData[product.brand].totalStock += totalProducts;
            categoryData[product.brand].inStock += product.countInStock;
            categoryData[product.brand].sold += soldQuantity;
        });

        return Object.keys(categoryData).map((brand) => ({
            brand,
            ...categoryData[brand],
        }));
    };

    useEffect(() => {
        const chart = getProductStockData(products, orders);
        setChartData(chart);
    }, [products, orders]);

    const exportToExcel = () => {
        if (!products.length) {
            alert("No products available to export!");
            return;
        }

        const dataToExport = products.map((p) => ({
            ProductID: p._id,
            Name: p.name,
            Brand: p.brand,
            Category: p.category,
            Collections: p.collections,
            Gender: p.gender,
            Material: p.material,
            Rating: p.rating || 0,
            Price: p.price,
            DiscountPrice: p.discountPrice,
            TotalStock: p.countInStock + (orders.reduce((sum, o) =>
                sum + o.orderItems.filter(item => item.productId === p._id).reduce((q, item) => q + item.quantity, 0), 0)),
            RemainingStock: p.countInStock,
            Colors: p.colors?.join(", ") || "",
            Sizes: p.sizes?.join(", ") || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        XLSX.writeFile(workbook, "products_data.xlsx");
    };

    if (loading) return <p className="text-center text-lg text-gray-500 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-lg text-red-500 mt-10">Error: {error}</p>;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📦 Products by Stock Status per Brand
                    </h2>
                    <button
                        onClick={exportToExcel}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-1 pr-2 py-1.5 rounded-lg shadow-md transition duration-200"
                    >
                        📥 Download Excel
                    </button>
                </div>

                <div className="w-full h-[500px] mt-4">
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="brand" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="totalStock" stackId="a" fill={COLORS.totalStock} name="Total Stock" />
                            <Bar dataKey="inStock" stackId="a" fill={COLORS.inStock} name="In Stock" />
                            <Bar dataKey="sold" stackId="a" fill={COLORS.sold} name="Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProductChart;