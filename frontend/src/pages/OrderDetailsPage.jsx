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

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

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
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
            {!orderDetails ? (
                <p>No Order Details Found</p>
            ) : (
                <div className="p-4 sm:p-6 rounded-lg border">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between mb-8">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold">
                                Order ID: #{orderDetails._id}
                            </h3>
                            <p className="text-gray-600">
                                {new Date(orderDetails.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                            <span className={`${orderDetails.isPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                } px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                                {orderDetails.isPaid ? "Approved" : "Pending"}
                            </span>
                            {orderDetails.status !== "Cancelled" ? (
                                <span className={`${orderDetails.isDelivered
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    } px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                                    {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    Cancelled
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Payment + Shipping */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                            <p>Payment Method: {orderDetails.paymentMethod}</p>
                            <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                            <p>Shipping Method: {orderDetails.shippingMethod}</p>
                            <p>Address: {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}</p>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="overflow-x-auto">
                        <h4 className="text-lg font-semibold mb-4">Products</h4>
                        <table className='min-w-full text-gray-600 mb-4'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Unit Price</th>
                                    <th className="py-2 px-4 text-left">Quantity</th>
                                    <th className="py-2 px-4 text-left">Total</th>
                                    <th className='py-2 px-4 text-left'>Feedback</th>
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
                                        <tr key={item.productId} className="border-b">
                                            <td className="py-2 px-4 flex items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-lg mr-4"
                                                />
                                                <Link
                                                    to={`/product/${item.productId}`}
                                                    className='text-blue-500 hover:underline'
                                                >
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="py-2 px-4">
                                                {isOnDeal ? (
                                                    <div>
                                                        <p className="text-green-600 font-medium">
                                                            ${unitPrice.toFixed(2)}
                                                        </p>
                                                        <p className="text-sm line-through text-gray-500">
                                                            ${Number(fullProduct?.price ?? item.price).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-red-500">
                                                            -{fullProduct?.discountPercentage ?? item.discountPercentage}%
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p>${unitPrice.toFixed(2)}</p>
                                                )}
                                            </td>
                                            <td className="py-2 px-4">{item.quantity}</td>
                                            <td className="py-2 px-4 font-semibold text-green-600">
                                                ${(unitPrice * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="py-2 px-4">
                                                {item.hasFeedback ? (
                                                    <span className="text-gray-500">Feedback Given</span>
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
                    <div className="mt-6 flex justify-between items-center pt-4 border-t">
                        <h2 className="text-xl font-semibold ml-8">Order Total</h2>
                        <p className="text-2xl font-bold text-green-600 mr-8 mt-2">
                            ${calculateOrderTotal().toFixed(2)}
                        </p>
                    </div>

                    {/* Back to Orders */}
                    <Link to="/my-orders" className='text-blue-500 hover:underline ml-8'>
                        Back to My Orders
                    </Link>
                </div>
            )}
        </div>
    )
}

export default OrderDetailsPage
