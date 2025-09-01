import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'
import CartDrawer from '../Layout/CartDrawer'

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Topbar */}
      <div className="bg-gray-100 text-gray-700 text-sm py-2">
        <Topbar />
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8">
        <Navbar />

        {/* Cart Drawer Trigger */}
        <div className="ml-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  )
};

export default Header;