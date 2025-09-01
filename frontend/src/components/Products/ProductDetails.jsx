import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';


function ProductDetails({ productId }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );
    const { user, guestId } = useSelector(
        (state) => state.auth
    );

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }));
        }
    }, [dispatch, productFetchId]);

    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const colorMap = {
        "Beige": "#F5F5DC",
        "Black": "#000000",
        "Blue": "#0000FF",
        "Blue Floral": "#3F88C5",
        "Brown": "#8B4513",
        "Burgundy": "#800020",
        "Camel": "#C19A6B",
        "Charcoal": "#36454F",
        "Charcoal Grey": "#4A4A4A",
        "Cream": "#FFFDD0",
        "Dark Blue": "#00008B",
        "Dark Green": "#006400",
        "Dark Grey": "#2F4F4F",
        "Dark Wash": "#223A5E",
        "Emerald Green": "#50C878",
        "Floral Print": "#FF69B4",
        "Forest Green": "#228B22",
        "Gray": "#808080",
        "Grey": "#808080",
        "Heather Gray": "#9CA3AF",
        "Heather Grey": "#9CA3AF",
        "Khaki": "#C3B091",
        "Lavender": "#E6E6FA",
        "Light Blue": "#ADD8E6",
        "Light Brown": "#A0522D",
        "Light Green": "#90EE90",
        "Light Wash": "#A7C7E7",
        "Maroon": "#800000",
        "Medium Blue": "#4682B4",
        "Medium Wash": "#6A8CA7",
        "Navy": "#000080",
        "Navy Blue": "#000080",
        "Navy Palms": "#1D2951",
        "Oatmeal": "#D9CBB6",
        "Olive": "#808000",
        "Olive Green": "#556B2F",
        "Orange": "#FFA500",
        "Pink": "#FFC0CB",
        "Pink Floral": "#FFB6C1",
        "Red": "#FF0000",
        "Rust": "#B7410E",
        "Rust Red": "#8B3103",
        "Silver": "#C0C0C0",
        "Striped": "#CCCCCC",
        "Terracotta": "#E2725B",
        "Tropical Print": "#32CD32",
        "Voilet": "#8A2BE2",
        "White": "#FFFFFF",
        "Yellow": "#FFFF00",
        "Yellow Floral": "#FFD700"
    };

    const [mappedColors, setMappedColors] = useState([]);

    useEffect(() => {
        if (selectedProduct?.colors?.length) {
            const validColors = selectedProduct.colors
                .map((color) => ({
                    name: color,
                    hex: colorMap[color] || "#D3D3D3", // fallback light gray if not found
                }));
            setMappedColors(validColors);
            setSelectedColor(validColors[0]?.name || ""); // default first color
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    }

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select size and color before adding to Cart.", {
                duration: 1000,
            });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id,
            })
        ).then(() => {
            toast.success("Product added to Cart!", {
                duration: 1000,
            });
        })
            .finally(() => {
                setIsButtonDisabled(false);
            });
    };

    if (loading) {
        return <p className="text-center py-20">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-20">Error: {error}</p>;
    }


    return (
        <div className="p-6">
            {selectedProduct && (
                <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Left Thumbnails (Desktop) */}
                        <div className="hidden md:flex flex-col space-y-4">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition ${mainImage === image.url
                                        ? "border-2 border-black"
                                        : "border border-gray-300 hover:border-black"
                                        }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="md:w-1/2">
                            <div className="mb-4">
                                <img
                                    src={mainImage}
                                    alt="Main Product"
                                    className="w-full h-auto object-cover rounded-xl shadow-sm transition-transform duration-500 hover:scale-[1.03]"
                                />
                            </div>
                        </div>

                        {/* Mobile Thumbnails */}
                        <div className="md:hidden flex overflow-x-auto space-x-4 mb-4 no-scrollbar">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url
                                        ? "border-2 border-black"
                                        : "border border-gray-300"
                                        }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 md:ml-6">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                                {selectedProduct.name}
                            </h1>

                            {/* Price Section */}
                            <div className="mb-5">
                                {selectedProduct.isOnDeal ? (
                                    <div>
                                        <p className="text-lg text-gray-500 line-through">
                                            ${selectedProduct.price}
                                        </p>
                                        <p className="text-3xl text-green-600 font-bold">
                                            ${selectedProduct.discountPrice?.toFixed(2)}
                                        </p>
                                        <p className="text-red-500 font-medium text-sm">
                                            -{selectedProduct.discountPercentage}%
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        {selectedProduct.originalPrice && (
                                            <p className="text-lg text-gray-500 line-through">
                                                ${selectedProduct.originalPrice}
                                            </p>
                                        )}
                                        <p className="text-2xl text-green-600 font-bold">
                                            ${selectedProduct.price}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {selectedProduct.description}
                            </p>

                            {/* Color Options */}
                            <div className="mb-5">
                                <p className="font-medium text-gray-700">Color:</p>
                                <div className="flex gap-3 mt-2">
                                    {mappedColors.map(({ name, hex }) => (
                                        <button
                                            key={name}
                                            onClick={() => setSelectedColor(name)}
                                            className={`w-10 h-10 rounded-full border-2 transition ${selectedColor === name
                                                ? "border-black scale-110"
                                                : "border-gray-300 hover:border-black"
                                                }`}
                                            style={{ backgroundColor: hex }}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Options */}
                            <div className="mb-5">
                                <p className="font-medium text-gray-700">Size:</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {selectedProduct.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${selectedSize === size
                                                ? "bg-black text-white"
                                                : "border-gray-300 hover:border-black"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <p className="font-medium text-gray-700">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-medium">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add To Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-3 rounded-lg text-white font-semibold transition ${isButtonDisabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-black hover:bg-gray-900"
                                    }`}
                                disabled={isButtonDisabled}
                            >
                                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                            </button>

                            {/* Characteristics */}
                            <div className="mt-10 text-gray-700">
                                <h3 className="text-lg font-bold mb-3">Product Details:</h3>
                                <table className="w-full text-left text-sm text-gray-600">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-medium">Brand</td>
                                            <td className="py-1">{selectedProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-medium">Material</td>
                                            <td className="py-1">{selectedProduct.material}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Similar Products */}
                    <div className="mt-20">
                        <h2 className="text-2xl font-semibold text-center mb-6">
                            You May Also Like
                        </h2>
                        <ProductGrid
                            products={similarProducts}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails;
