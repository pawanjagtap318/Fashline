import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import { fetchAllProducts } from "../redux/slices/productsSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRef } from "react";
import receipt from '../assets/receipt.png';
import ReceiptLogo from '../assets/ReceiptLogo.png';

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
        if (checkout && checkout._id && !hasGeneratedPdf.current) {
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
                logo.src = ReceiptLogo;
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

                    // Save once
                    doc.save(`FashLine_Receipt_${checkout._id}.pdf`);
                    hasGeneratedPdf.current = true;
                };
            };
        }
    }, [checkout, enrichedItems, subtotal, user]);





    return (
        <div className='max-w-3xl mx-auto p-6 bg-white'>
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank You for your Order!
            </h1>

            {checkout && (
                <div className="p-6 rounded-lg border px-4">
                    <div className="flex justify-between mb-20">
                        {/* Order ID and Date */}
                        <div>
                            <h2 className="text-xl font-semibold">
                                Order ID: {checkout._id}
                            </h2>
                            <p className="text-gray-500">
                                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {/* Estimated Delivery */}
                        <div>
                            <p className="text-emerald-700 text-sm">
                                Estimated Delivery: {calculatedEstimatedDelivery(checkout.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="mb-20">
                        {enrichedItems.map((item) => (
                            <div key={item.productId} className="flex items-center mb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className='w-20 h-20 object-cover rounded-md mr-4'
                                />
                                <div>
                                    <h4 className="text-lg font-semibold">{item.name}</h4>
                                    <p className="text-md text-gray-500">
                                        {item.color} | {item.size}
                                    </p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>

                                {/* Deal Logic */}
                                <div className="ml-auto text-right">
                                    {item.isOnDeal ? (
                                        <>
                                            <p className="text-green-600 font-medium">
                                                ${(item.discountPrice * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm line-through text-gray-500">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-red-500">
                                                -{item.discountPercentage}%
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-green-600 font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment and Delivery Info */}
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Payment</h4>
                            <p className="text-gray-600">PayPal</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                            <p className="text-gray-600">
                                {checkout.shippingAddress.address}
                            </p>
                            <p className="text-gray-600">
                                {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    {/* ✅ Subtotal / Total */}
                    <div className="border-t pt-4 flex justify-between">
                        <h4 className="text-xl font-semibold">Total</h4>
                        <p className="text-xl font-bold text-green-600">
                            ${subtotal.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderConfirmationPage;
