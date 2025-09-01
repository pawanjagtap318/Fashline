import { IoMdClose } from 'react-icons/io';
import CartContent from '../Cart/CartContent';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CartDrawer({ drawerOpen, togglCartDrawer }) {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    togglCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-opacity-40 backdrop-blur-xs transition-opacity duration-300 z-40 ${drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={togglCartDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-4/5 md:w-[28rem] bg-white shadow-2xl rounded-l-2xl
        transform transition-transform duration-300 ease-in-out flex flex-col z-50 
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Shopping Cart</h2>
          <button
            onClick={togglCartDrawer}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <IoMdClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart contents with scrollable area */}
        <div className="flex-grow p-4 overflow-y-auto">
          {cart && cart?.products?.length > 0 ? (
            <CartContent cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg font-medium">🛒 Your cart is empty</p>
              <p className="text-sm">Start shopping to add items here.</p>
            </div>
          )}
        </div>

        {/* Checkout button fixed at the bottom */}
        {cart && cart?.products?.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-black via-gray-800 to-black text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Shipping, taxes & discounts calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
