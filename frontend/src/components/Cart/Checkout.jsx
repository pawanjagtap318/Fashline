import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';
import { fetchAllProducts } from "../../redux/slices/productsSlice";

function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { checkout } = useSelector((state) => state.checkout);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const [checkoutId, setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "Paypal",
                })
            );
            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id);
            }
        }
    }

    const handlePaymentSuccess = async (details) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus: "paid", paymentDetails: details },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            await handleFinalizeCheckout(checkoutId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            navigate("/order-confirmation");
        } catch (error) {
            console.error(error);
        }
    };

    const getCartWithFullProducts = () => {
        return cart?.products?.map((cartProduct) => {
            const fullProduct = products.find((p) => p._id === cartProduct.productId);

            if (!fullProduct) return null;

            return {
                ...fullProduct,
                quantity: cartProduct.quantity,
                size: cartProduct.size,
                color: cartProduct.color,
                image: cartProduct.image
            };
        }).filter(Boolean);
    };

    const enrichedCartProducts = getCartWithFullProducts();

    const calculateSubtotal = () => {
        return enrichedCartProducts.reduce((acc, product) => {
            const effectivePrice = product.isOnDeal
                ? product.discountPrice
                : product.price;
            return acc + effectivePrice * product.quantity;
        }, 0);
    };

    const subtotal = calculateSubtotal();

    if (loading) return <p>Loading Cart...</p>
    if (error) return <p>Error: {error}</p>
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto py-12 px-6">
            {/* Left Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h2>
                <form onSubmit={handleCreateCheckout} className="space-y-6">
                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                        <input
                            type="text"
                            value={user ? user.email : ""}
                            disabled
                            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div>

                    {/* Delivery */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Address"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: e.target.value,
                                })
                            }
                            className="w-full mt-4 p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="City"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Country"
                                value={shippingAddress.country}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        country: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={shippingAddress.phone}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        phone: e.target.value,
                                    })
                                }
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Step */}
                    <div className="pt-4">
                        {!checkoutId ? (
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
                            >
                                Continue to Payment
                            </button>
                        ) : (
                            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="text-lg mb-4 font-semibold text-gray-700">
                                    Complete Your Payment
                                </h3>
                                <PayPalButton
                                    amount={checkoutId ? checkout?.totalPrice : 0}
                                    onSuccess={handlePaymentSuccess}
                                    onError={() => alert("Payment failed. Try again.")}
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="bg-gray-50 rounded-2xl shadow-md p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Order Summary
                </h3>
                <div className="divide-y">
                    {enrichedCartProducts.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-4"
                        >
                            <div className="flex">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-24 object-cover rounded-lg mr-4 shadow-sm"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        Size: {product.size} | Color: {product.color}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {product.quantity}
                                    </p>
                                </div>
                            </div>
                            {product.isOnDeal ? (
                                <div className="text-right">
                                    <p className="text-green-600 font-semibold">
                                        ${(product.discountPrice * product.quantity).toLocaleString()}
                                    </p>
                                    <p className="text-sm line-through text-gray-400">
                                        ${(product.price * product.quantity).toLocaleString()}
                                    </p>
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                        -{product.discountPercentage}%
                                    </span>
                                </div>
                            ) : (
                                <p className="font-semibold text-green-600">
                                    ${(product.price * product.quantity).toLocaleString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-2 text-lg">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p className="text-green-600">${subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping</p>
                        <p className="text-gray-600">Free</p>
                    </div>
                    <div className="flex justify-between border-t pt-4 font-bold text-xl">
                        <p>Total</p>
                        <p className="text-green-600">${subtotal.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
