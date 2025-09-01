import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, deleteProduct } from "../../redux/slices/adminProductSlice";

function ProductManagement() {
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(
        (state) => state.adminProducts
    );

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete the product?")) {
            dispatch(deleteProduct(id));
        }
    };

    // Sorting function
    const sortedProducts = React.useMemo(() => {
        let sortableProducts = [...products];
        if (sortConfig.key !== null) {
            sortableProducts.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (typeof aVal === "string") {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableProducts;
    }, [products, sortConfig]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800">🛒 Product Management</h2>
                <NavLink
                    to="/admin/allProducts"
                    className="text-blue-600 hover:underline font-medium"
                >
                    View Products Charts →
                </NavLink>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            {["name", "countInStock", "price", "sku"].map((key) => (
                                <th
                                    key={key}
                                    className="py-3 px-4 cursor-pointer select-none"
                                    onClick={() => requestSort(key)}
                                >
                                    {key === "name" && "Name"}
                                    {key === "countInStock" && "Stock"}
                                    {key === "price" && "Price"}
                                    {key === "sku" && "SKU"}
                                    {sortConfig.key === key && (
                                        <span className="ml-1">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                                    )}
                                </th>
                            ))}
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product, idx) => (
                                <tr
                                    key={product._id}
                                    className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                                >
                                    <td className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                        {product.name}
                                    </td>
                                    <td
                                        className={`p-4 font-medium ${product.countInStock > 10
                                                ? "text-green-600"
                                                : product.countInStock > 0
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {product.countInStock}
                                    </td>
                                    <td className="p-4 font-medium text-blue-600">${product.price}</td>
                                    <td className="p-4">{product.sku}</td>
                                    <td className="p-4 flex flex-wrap gap-2">
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-600 transition"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">
                                    No Products Found 🚫
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductManagement;
