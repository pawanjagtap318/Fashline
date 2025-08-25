import { Link } from "react-router-dom"
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2"
import { IoChatbubblesOutline } from 'react-icons/io5'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import ChatBox from '../AI/ChatBox'
import Logo from '../../assets/Logo.png';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  }

  const togglCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  const handleChatBoxToggle = () => {
    setChatBoxOpen(!chatBoxOpen);
  }

  return (
    <>
      <nav className='container mx-auto flex items-center justify-between py-4 px-6'>

        {/* Left - Logo */}
        <div>
          <Link to='/' className='flex items-center'>
            <img
              src={Logo}
              alt="Fashline Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Center - Navigation Link */}
        <div className='hidden md:flex space-x-6'>
          <Link to="/collections/all?gender=Men" className='text-gray-600 hover:text-black text-sm font-medium uppercase'>
            Men
          </Link>
          <Link to="/collections/all?gender=Women" className='text-gray-600 hover:text-black text-sm font-medium uppercase'>
            Women
          </Link>
          <Link to="/collections/all?category=Top Wear" className='text-gray-600 hover:text-black text-sm font-medium uppercase'>
            Top Wear
          </Link>
          <Link to="/collections/all?category=Bottom Wear" className='text-gray-600 hover:text-black text-sm font-medium uppercase'>
            Bottom Wear
          </Link>
          <Link to="/offers" className='text-gray-900 hover:text-black text-sm font-bold uppercase'>
            🔥 Offers
          </Link>
        </div>

        {/* Right - Icons */}
        <div className='flex items-center space-x-4'>
          {user && user.role === "admin" && (
            <Link
              to='/admin'
              className='block bg-black py-1 px-2 rounded text-sm text-white'
            >
              Admin
            </Link>
          )}
          <Link
            to="/profile"
            className='hover:text-black'
          >
            <HiOutlineUser className='h-6 w-6 text-gray-700' />
          </Link>
          <button onClick={togglCartDrawer} className='relative hover:text-black'>
            <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
            {cartItemCount > 0 && (
              <span className='absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-1 p-0.5'>
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search */}
          <div className='overflow-hidden'>
            <SearchBar />
          </div>
          <div
            onClick={handleChatBoxToggle}
            className="relative cursor-pointer text-white rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition duration-300 shadow-lg hover:shadow-xl"
          >
            <IoChatbubblesOutline size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={toggleNavDrawer} className='md:hidden'>
            <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} togglCartDrawer={togglCartDrawer} />
      <ChatBox chatBoxOpen={chatBoxOpen} setChatBoxOpen={setChatBoxOpen} />

      {/* Mobile Navigation */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg 
        transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='flex justify-end p-4'>
          <button onClick={toggleNavDrawer}>
            <IoMdClose className='h-6 w-6 text-gray-600' />
          </button>
        </div>
        <div className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Menu</h2>
          <nav className='space-y-4'>
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className='block text-gray-600 hover:text-black'
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className='block text-gray-600 hover:text-black'
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className='block text-gray-600 hover:text-black'
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className='block text-gray-600 hover:text-black'
            >
              Bottom Wear
            </Link>
            <Link
              to="/offers"
              onClick={toggleNavDrawer}
              className='block text-gray-600 hover:text-black'
            >
              🔥 Offers
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
};


export default Navbar;