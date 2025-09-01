import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom'
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import { fetchAllProducts } from '../redux/slices/productsSlice';

function OrderDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.orders);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchOrderDetails(id));
        dispatch(fetchAllProducts());
    }, [dispatch, id]);

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center py-10 text-red-600">Error: {error}</p>;

    // Calculate grand total
    const calculateOrderTotal = () => {
        if (!orderDetails?.orderItems) return 0;

        return orderDetails.orderItems.reduce((acc, item) => {
            const fullProduct = products.find((p) => p._id === item.productId);

            const price = fullProduct?.isOnDeal
                ? Number(fullProduct.discountPrice)
                : Number(fullProduct?.price ?? item.price);

            return acc + price * item.quantity;
        }, 0);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Order Details</h2>

            {!orderDetails ? (
                <p className="text-center text-gray-500">No Order Details Found</p>
            ) : (
                <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Order ID: <span className="text-indigo-600">#{orderDetails._id}</span>
                            </h3>
                            <p className="text-gray-500">
                                {new Date(orderDetails.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${orderDetails.isPaid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {orderDetails.isPaid ? "Approved" : "Pending"}
                            </span>
                            {orderDetails.status !== "Cancelled" ? (
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${orderDetails.isDelivered
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                    Cancelled
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Payment + Shipping */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold mb-2 text-gray-700">
                                Payment Info
                            </h4>
                            <p className="text-sm text-gray-600">
                                Method: <span className="font-medium">{orderDetails.paymentMethod}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Status:{" "}
                                <span
                                    className={`font-medium ${orderDetails.isPaid ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {orderDetails.isPaid ? "Paid" : "Unpaid"}
                                </span>
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold mb-2 text-gray-700">
                                Shipping Info
                            </h4>
                            <p className="text-sm text-gray-600">
                                Method:{" "}
                                <span className="font-medium">{orderDetails.shippingMethod}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Address:{" "}
                                <span className="font-medium">
                                    {orderDetails.shippingAddress.city},{" "}
                                    {orderDetails.shippingAddress.country}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="overflow-x-auto">
                        <h4 className="text-xl font-semibold mb-4 text-gray-700">Products</h4>
                        <table className="min-w-full border text-sm text-gray-700">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="py-3 px-4 text-left">Product</th>
                                    <th className="py-3 px-4 text-left">Unit Price</th>
                                    <th className="py-3 px-4 text-center">Quantity</th>
                                    <th className="py-3 px-4 text-right">Total</th>
                                    <th className="py-3 px-4 text-center">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.orderItems.map((item) => {
                                    const fullProduct = products.find((p) => p._id === item.productId);
                                    const isOnDeal = fullProduct?.isOnDeal ?? item.isOnDeal;
                                    const unitPrice = isOnDeal
                                        ? Number(fullProduct?.discountPrice ?? item.discountPrice)
                                        : Number(fullProduct?.price ?? item.price);

                                    return (
                                        <tr
                                            key={item.productId}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="py-3 px-4 flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                />
                                                <Link
                                                    to={`/product/${item.productId}`}
                                                    className="text-indigo-600 hover:underline font-medium"
                                                >
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                {isOnDeal ? (
                                                    <div>
                                                        <p className="text-green-600 font-semibold">
                                                            ${unitPrice.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs line-through text-gray-500">
                                                            ${Number(fullProduct?.price ?? item.price).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-red-500">
                                                            -{fullProduct?.discountPercentage ??
                                                                item.discountPercentage}
                                                            %
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p>${unitPrice.toFixed(2)}</p>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">{item.quantity}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-green-600">
                                                ${(unitPrice * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {item.hasFeedback ? (
                                                    <span className="text-gray-400">Feedback Given</span>
                                                ) : (
                                                    <Link
                                                        to={`/order/${id}/feedback/${item.productId}`}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Leave Feedback
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Total */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center pt-6 border-t gap-3">
                        <h2 className="text-xl font-semibold text-gray-800">Order Total</h2>
                        <p className="text-3xl font-bold text-green-600">
                            ${calculateOrderTotal().toFixed(2)}
                        </p>
                    </div>

                    {/* Back to Orders */}
                    <div className="mt-6">
                        <Link
                            to="/my-orders"
                            className="inline-block text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                            ← Back to My Orders
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderDetailsPage;