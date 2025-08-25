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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2">Product Management</h2>
            <div className="place-self-end mr-10 mb-4">
                <NavLink to="/admin/allProducts" className="text-blue-500 hover:underline cursor-pointer">
                    View Products Charts
                </NavLink>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => requestSort("name")}
                            >
                                Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => requestSort("countInStock")}
                            >
                                Stock {sortConfig.key === "countInStock" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => requestSort("price")}
                            >
                                Price {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => requestSort("sku")}
                            >
                                SKU {sortConfig.key === "sku" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.length > 0 ? (
                            sortedProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                                        {product.name}
                                    </td>
                                    <td className="p-4">{product.countInStock}</td>
                                    <td className="p-4">${product.price}</td>
                                    <td className="p-4">{product.sku}</td>
                                    <td className="p-4">
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No Products Found.
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
