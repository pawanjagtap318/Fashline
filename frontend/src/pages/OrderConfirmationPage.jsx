import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import { fetchAllProducts } from "../redux/slices/productsSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import receipt from '../assets/receipt.png';
import Logo from '../assets/Logo.png';

function OrderConfirmationPage() {
    const hasGeneratedPdf = useRef(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { checkout } = useSelector((state) => state.checkout);
    const { user } = useSelector((state) => state.auth);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const calculatedEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10);  // Add 10 days
        return orderDate.toLocaleDateString();
    };

    useEffect(() => {
        const updateProductStock = async () => {
            if (checkout && checkout._id) {
                for (const item of checkout.checkoutItems) {
                    try {
                        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${item.productId}/reduce-stock`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                            },
                            body: JSON.stringify({ quantity: item.quantity }),
                        });
                    } catch (error) {
                        console.error("Error reducing stock:", error);
                    }
                }

                dispatch(clearCart());
                localStorage.removeItem("cart");
            } else {
                navigate("/my-orders");
            }
        };

        updateProductStock();
    }, [checkout, dispatch, navigate, user]);

    // Enrich checkout items with product info (isOnDeal, discount, etc.)
    const enrichedItems = useMemo(() => {
        if (!checkout || !products.length) return [];
        return checkout.checkoutItems.map((item) => {
            const fullProduct = products.find((p) => p._id === item.productId);
            return {
                ...item,
                isOnDeal: fullProduct?.isOnDeal || false,
                discountPrice: fullProduct?.discountPrice || item.price,
                discountPercentage: fullProduct?.discountPercentage || 0,
            };
        });
    }, [checkout, products]);

    // Calculate subtotal using deal logic
    const subtotal = useMemo(() => {
        return enrichedItems.reduce((acc, item) => {
            const effectivePrice = item.isOnDeal ? item.discountPrice : item.price;
            return acc + effectivePrice * item.quantity;
        }, 0);
    }, [enrichedItems]);


    useEffect(() => {
        if (!checkout || !checkout._id || hasGeneratedPdf.current) return;

        hasGeneratedPdf.current = true;

        const doc = new jsPDF();
        const img = new Image();
        img.src = receipt;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const lightImg = canvas.toDataURL("image/png");

            // Background Image
            doc.addImage(lightImg, "PNG", 0, 0, 210, 297);

            // --- Header background ---
            doc.setFillColor(0, 174, 239);
            doc.rect(0, 0, 210, 30, "F");

            // --- Logo instead of text ---
            const logo = new Image();
            logo.src = Logo;

            logo.onload = () => {
                doc.addImage(logo, "PNG", 15, 10, 50, 15);

                doc.setFontSize(11);
                doc.setTextColor(255, 255, 255);
                doc.text("Fashion at your Fingertips", 200, 20, { align: "right" });

                // --- Order Title ---
                doc.setTextColor(40, 40, 40);
                doc.setFontSize(16);
                doc.text("Order Receipt", 20, 45);

                // --- Order Info ---
                doc.setFontSize(12);
                doc.setTextColor(80, 80, 80);
                doc.text(`Order ID: ${checkout._id}`, 20, 60);
                doc.text(
                    `Order Date: ${new Date(checkout.createdAt).toLocaleDateString()}`,
                    20,
                    70
                );
                doc.text(`Customer: ${user?.email || "N/A"}`, 20, 80);

                // --- Line separator ---
                doc.setDrawColor(200, 200, 200);
                doc.line(20, 85, 190, 85);

                // --- Items Table ---
                const tableData = enrichedItems.map((item, idx) => [
                    idx + 1,
                    item.name,
                    item.quantity,
                    `$${(item.isOnDeal ? item.discountPrice : item.price).toFixed(2)}`,
                    `$${(
                        (item.isOnDeal ? item.discountPrice : item.price) * item.quantity
                    ).toFixed(2)}`,
                ]);

                autoTable(doc, {
                    startY: 95,
                    head: [["#", "Product", "Qty", "Price", "Total"]],
                    body: tableData,
                    styles: { fontSize: 11 },
                    headStyles: {
                        fillColor: [52, 152, 219],
                        textColor: 255,
                        halign: "center",
                    },
                    bodyStyles: { halign: "center" },
                });

                // --- Subtotal Section ---
                let finalY = doc.lastAutoTable.finalY + 20;
                doc.setFontSize(14);
                doc.setTextColor(44, 62, 80);
                doc.text(`Grand Total: $${subtotal.toFixed(2)}`, 20, finalY);

                // --- Footer ---
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text("Thank you for shopping with us.", 20, finalY + 20);
                doc.text("Visit us again at www.fashline.com", 20, finalY + 30);

                doc.save(`FashLine_Receipt_${checkout._id}.pdf`);
            };
        };
    }, [checkout]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <div className="text-center mb-10">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800">
                    Thank You for Your Order!
                </h1>
                <p className="text-gray-500 mt-2">
                    Your order has been placed successfully.
                </p>
            </div>

            {checkout && (
                <div className="p-6 rounded-xl border bg-gray-50">
                    {/* ✅ Order Info */}
                    <div className="flex flex-col sm:flex-row justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Order ID:{" "}
                                <span className="text-gray-600 font-normal">
                                    {checkout._id}
                                </span>
                            </h2>
                            <p className="text-gray-500">
                                Date: {new Date(checkout.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-emerald-600 font-semibold">
                                Estimated Delivery
                            </p>
                            <p className="text-gray-700 font-medium">
                                {calculatedEstimatedDelivery(checkout.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* ✅ Ordered Items */}
                    <div className="mb-10 divide-y">
                        {enrichedItems.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center py-4 gap-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-gray-800">
                                        {item.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {item.color} | {item.size}
                                    </p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>

                                <div className="text-right">
                                    {item.isOnDeal ? (
                                        <>
                                            <p className="text-green-600 font-bold">
                                                ${(item.discountPrice * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm line-through text-gray-400">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-red-500 font-medium">
                                                -{item.discountPercentage}%
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-green-600 font-bold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ✅ Payment + Delivery */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h4 className="text-lg font-semibold mb-2">Payment</h4>
                            <p className="text-gray-600">PayPal</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                            <p className="text-gray-600">
                                {checkout.shippingAddress.address}
                            </p>
                            <p className="text-gray-600">
                                {checkout.shippingAddress.city},{" "}
                                {checkout.shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    {/* ✅ Total */}
                    <div className="border-t pt-4 flex justify-between items-center">
                        <h4 className="text-xl font-semibold text-gray-800">Total</h4>
                        <p className="text-2xl font-extrabold text-green-600">
                            ${subtotal.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderConfirmationPage;