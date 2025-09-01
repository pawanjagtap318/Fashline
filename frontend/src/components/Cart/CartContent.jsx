import { RiDeleteBin3Line } from "react-icons/ri"
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';
import { fetchAllProducts } from "../../redux/slices/productsSlice";
import { useEffect } from "react";

function CartContent({ cart, userId, guestId }) {
  const dispatch = useDispatch();
  const { products } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const calculateCartTotal = () => {
    return cart.products.reduce((acc, cartProduct) => {
      const fullProduct = products.find((p) => p._id === cartProduct.productId);
      if (!fullProduct) return acc;

      const price = fullProduct.isOnDeal
        ? Number(fullProduct.discountPrice)
        : Number(fullProduct.price ?? cartProduct.price);

      return acc + price * cartProduct.quantity;
    }, 0);
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div className="space-y-6">
      {cart.products.map((cartProduct, index) => {
        const fullProduct = products.find(
          (p) => p._id === cartProduct.productId
        );
        return (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-start justify-between p-4 bg-white border rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {/* Left: Image + details */}
            <div className="flex items-start sm:w-2/3">
              <img
                src={cartProduct.image}
                alt={cartProduct.name}
                className="w-24 h-24 object-cover mr-4 rounded-xl shadow-sm"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{cartProduct.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Size: <span className="font-medium">{cartProduct.size}</span> | Color:{" "}
                  <span className="font-medium">{cartProduct.color}</span>
                </p>

                {/* Quantity controls */}
                <div className="flex items-center mt-3 space-x-3">
                  <button
                    onClick={() =>
                      handleAddToCart(
                        cartProduct.productId,
                        -1,
                        cartProduct.quantity,
                        cartProduct.size,
                        cartProduct.color
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center border rounded-full text-lg font-bold hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="font-medium text-gray-700">
                    {cartProduct.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        cartProduct.productId,
                        1,
                        cartProduct.quantity,
                        cartProduct.size,
                        cartProduct.color
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center border rounded-full text-lg font-bold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Price + Remove */}
            <div className="flex flex-col items-end sm:w-1/3 mt-4 sm:mt-0">
              {fullProduct?.isOnDeal ? (
                <>
                  <p className="font-semibold text-green-600 text-lg">
                    ${(Number(fullProduct.discountPrice) * cartProduct.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm line-through text-gray-400">
                    ${(fullProduct.price * cartProduct.quantity).toFixed(2)}
                  </p>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded mt-1">
                    Save {fullProduct.discountPercentage}%
                  </span>
                </>
              ) : (
                <>
                  <p className="font-semibold text-green-600 text-lg">
                    $
                    {(
                      Number(fullProduct?.price ?? cartProduct.price) *
                      cartProduct.quantity
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    (${Number(fullProduct?.price ?? cartProduct.price).toFixed(2)} each)
                  </p>
                </>
              )}

              <button
                onClick={() =>
                  handleRemoveFromCart(
                    cartProduct.productId,
                    cartProduct.size,
                    cartProduct.color
                  )
                }
                className="mt-3 hover:scale-110 transition"
              >
                <RiDeleteBin3Line className="h-6 w-6 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        );
      })}

      {/* Cart Total */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          Your Cart Total
        </h2>
        <p className="text-2xl font-bold text-green-600 mt-2 sm:mt-0">
          ${calculateCartTotal().toFixed(2)}
        </p>
      </div>
    </div>
  )
};

export default CartContent;
