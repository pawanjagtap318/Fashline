import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/orderSlice';

function MyOrdersPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    }

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {orders.length > 0 ? (
                <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full text-left text-gray-600">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-700 sticky top-0">
                                <tr>
                                    <th className="py-3 px-4">Image</th>
                                    <th className="py-3 px-4">Order ID</th>
                                    <th className="py-3 px-4">Created</th>
                                    <th className="py-3 px-4">Shipping</th>
                                    <th className="py-3 px-4">Items</th>
                                    <th className="py-3 px-4">Price</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => handleRowClick(order._id)}
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <td className="py-3 px-4">
                                            <img
                                                src={order.orderItems[0].image}
                                                alt={order.orderItems[0].name}
                                                className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                            />
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(order.createdAt).toLocaleDateString()}{" "}
                                            <span className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleTimeString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.shippingAddress
                                                ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                                : "N/A"}
                                        </td>
                                        <td className="py-3 px-4">{order.orderItems.length}</td>
                                        <td className="py-3 px-4 font-medium">
                                            ₹{order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.status === "Cancelled" ? (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    Refund
                                                </span>
                                            ) : order.isPaid ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card Layout for Mobile */}
                    <div className="grid gap-4 md:hidden">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => handleRowClick(order._id)}
                                className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={order.orderItems[0].image}
                                        alt={order.orderItems[0].name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            Order #{order._id.slice(-6)}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {order.status === "Cancelled" ? (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                            Refund
                                        </span>
                                    ) : order.isPaid ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                            Paid
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3 text-sm text-gray-600 flex justify-between">
                                    <span>{order.orderItems.length} items</span>
                                    <span className="font-medium">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 text-center py-12 rounded-xl shadow-inner">
                    <p className="text-gray-500 text-lg">🛒 You have no orders yet.</p>
                </div>
            )}
        </div>
    )
}

export default MyOrdersPage;
