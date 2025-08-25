import { RiDeleteBin3Line } from "react-icons/ri"
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';
import { fetchAllProducts } from "../../redux/slices/productsSlice";
import { useEffect } from "react";

function CartContent({ cart, userId, guestId }) {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
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
    <div>
      {cart.products.map((cartProduct, index) => {
        const fullProduct = products.find((p) => p._id === cartProduct.productId);
        return (
          <div
            key={index}
            className='flex items-start justify-between py-4 border-b'
          >
            <div className='flex items-start'>
              <img
                src={cartProduct.image}
                alt={cartProduct.name}
                className='w-24 h-24 object-cover mr-4 rounded'
              />
              <div>
                <h3>{cartProduct.name}</h3>
                <p className='text-sm text-gray-500'>
                  size: {cartProduct.size} | color: {cartProduct.color}
                </p>
                {/* Quantity controls */}
                <div className='flex items-center mt-2'>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        cartProduct.productId,
                        -1,
                        cartProduct.quantity,
                        cartProduct.size,
                        cartProduct.color,
                      )
                    }
                    className='border rounded px-2 py-1 text-xl font-medium'
                  >
                    -
                  </button>
                  <span className='mx-4'>{cartProduct.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        cartProduct.productId,
                        1,
                        cartProduct.quantity,
                        cartProduct.size,
                        cartProduct.color,
                      )
                    }
                    className='border rounded px-2 py-1 text-xl font-medium'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="text-right">
              {fullProduct?.isOnDeal ? (
                <>
                  {/* Line total with deal price */}
                  <p className="font-medium mt-2 text-green-600">
                    ${(Number(fullProduct.discountPrice) * cartProduct.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm line-through text-gray-500">
                    ${(fullProduct.price * cartProduct.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    (${Number(fullProduct.discountPrice).toFixed(2)} each)
                    <span className="ml-2 text-red-500 text-xs">
                      -{fullProduct.discountPercentage}%
                    </span>
                  </p>
                </>
              ) : (
                <>
                  {/* Line total with regular price */}
                  <p className="font-medium mt-2 text-green-600">
                    ${(Number(fullProduct?.price ?? cartProduct.price) * cartProduct.quantity).toFixed(2)}
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
                    cartProduct.color,
                  )
                }
              >
                <RiDeleteBin3Line className="place-self-end mt-4 mr-4 h-6 w-6 text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
      <div className="mt-6 flex justify-between items-center pt-4">
        <h2 className="text-xl font-semibold">Your Cart Total</h2>
        <p className="text-2xl font-bold text-green-600">
          ${calculateCartTotal().toFixed(2)}
        </p>
      </div>
    </div>
  )
};

export default CartContent;
