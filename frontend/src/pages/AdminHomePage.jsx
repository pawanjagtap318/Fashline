import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function AdminHomePage() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [orderLimit, setOrderLimit] = useState("");
    const dispatch = useDispatch();

    const {
        products,
        loading: productsLoading,
        error: productsError,
    } = useSelector((state) => state.adminProducts);
    const {
        orders,
        totalOrders,
        totalSales,
        loading: ordersLoading,
        error: ordersError,
    } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const exportOrdersToExcel = () => {
        let filteredOrders = [...orders];

        // Filter by date range
        if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            filteredOrders = filteredOrders.filter(order =>
                new Date(order.createdAt) >= from
            );
        }
        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            filteredOrders = filteredOrders.filter(order =>
                new Date(order.createdAt) <= to
            );
        }

        // Limit last N orders
        if (orderLimit) {
            filteredOrders = filteredOrders.slice(-Number(orderLimit));
        }

        if (filteredOrders.length === 0) {
            alert("No orders found for the selected filters.");
            return;
        }

        // Prepare data for Excel
        const data = filteredOrders.map(order => ({
            "Order ID": order._id,
            "User ID": order.user,
            "Product Name": order.orderItems.map(item => item.name).join(", "),
            "Product Quantity": order.orderItems.map(item => item.quantity).join(", "),
            "Product Size": order.orderItems.map(item => item.size).join(", "),
            "Product Color": order.orderItems.map(item => item.color).join(", "),
            "Product Price": order.orderItems.map(item => item.price).join(", "),
            "Total Price": order.totalPrice,
            "Status": order.status,
            "Created At": new Date(order.createdAt).toLocaleString(),
            "Address": "Address: " + order.shippingAddress.address + ", City: " + order.shippingAddress.city
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        // Save file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `Orders_${Date.now()}.xlsx`);
    };


    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            {productsLoading || ordersLoading ? (
                <p>Loading...</p>
            ) : productsError ? (
                <p>Error fetching products: {productsError}</p>
            ) : ordersError ? (
                <p>Error fetching orders: {ordersError}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold">Revenue</h2>
                        <p className="text-2xl">${totalSales.toFixed(2)}</p>
                        <div className='mt-2'>
                            <NavLink
                                to="/admin/revenue"
                                className='text-blue-500 hover:underline cursor-pointer'
                            >
                                View
                            </NavLink>
                        </div>
                    </div>
                    <div className="p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold">Total Orders</h2>
                        <p className="text-2xl">{totalOrders}</p>
                        <div className='flex flex-col space-y-2 mt-2'>
                            <NavLink to="/admin/totalOrders" className='text-blue-500 hover:underline cursor-pointer'>
                                View
                            </NavLink>
                            <NavLink to="/admin/orders" className='text-blue-500 hover:underline cursor-pointer'>
                                Manage Orders
                            </NavLink>
                        </div>
                    </div>
                    <div className="p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold">Total Products</h2>
                        <p className="text-2xl">{products.length}</p>
                        <div className='flex flex-col space-y-2 mt-2'>
                            <NavLink to="/admin/allProducts" className='text-blue-500 hover:underline cursor-pointer'>
                                View
                            </NavLink>
                            <NavLink to="/admin/products" className='text-blue-500 hover:underline cursor-pointer'>
                                Manage Products
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Recent Orders</h2>
                <div className="flex flex-wrap gap-4 mb-4 items-end">
                    <div>
                        <label className="block text-sm font-medium">From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last N Orders</label>
                        <input
                            type="number"
                            min="1"
                            value={orderLimit}
                            onChange={(e) => setOrderLimit(e.target.value)}
                            placeholder="e.g. 10"
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <button
                        onClick={exportOrdersToExcel}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Download Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-gray-500">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Total Price</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                                        <td className="p-4">{order._id}</td>
                                        <td className="p-4">{order.user}</td>
                                        <td className="p-4">{order.totalPrice.toFixed(2)}</td>
                                        <td className="p-4">{order.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No Recent Orders Found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage
