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
      <nav className='container mx-auto flex items-center justify-between py-1 px-6'>

        {/* Left - Logo */}
        <div className="hover:bg-gray-100 hover:scale-105 hover:rounded-2xl">
          <Link to='/' className='flex items-center hover:scale-105 transition-transform'>
            <img
              src={Logo}
              alt="Fashline Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Center - Navigation Link */}
        <div className='hidden md:flex space-x-6'>
          <Link to="/collections/all?gender=Men" className='text-gray-600 hover:text-black text-sm font-medium uppercase hover:bg-gray-100 hover:scale-105 hover:rounded-2xl'>
            Men
          </Link>
          <Link to="/collections/all?gender=Women" className='text-gray-600 hover:text-black text-sm font-medium uppercase hover:bg-gray-100 hover:scale-105 hover:rounded-2xl'>
            Women
          </Link>
          <Link to="/collections/all?category=Top Wear" className='text-gray-600 hover:text-black text-sm font-medium uppercase hover:bg-gray-100 hover:scale-105 hover:rounded-2xl'>
            Top Wear
          </Link>
          <Link to="/collections/all?category=Bottom Wear" className='text-gray-600 hover:text-black text-sm font-medium uppercase hover:bg-gray-100 hover:scale-105 hover:rounded-2xl'>
            Bottom Wear
          </Link>
          <Link to="/offers" className='text-gray-900 hover:text-black text-sm font-bold uppercase hover:bg-gray-100 hover:scale-105 hover:rounded-2xl'>
            🔥 Offers
          </Link>
        </div>

        {/* Right - Icons */}
        <div className='flex items-center space-x-6'>
          {user && user.role === "admin" && (
            <Link
              to='/admin'
              className='block bg-black py-1 px-2 rounded text-sm text-white hover:scale-110'
            >
              Admin
            </Link>
          )}
          <Link
            to="/profile"
            className='hover:text-black'
          >
            <HiOutlineUser className='h-6 w-6 mx-1 text-gray-700 hover:bg-gray-200 hover:scale-170 hover:rounded-2xl hover:p-1' />
          </Link>
          <button onClick={togglCartDrawer} className='relative hover:text-black'>
            <HiOutlineShoppingBag className='h-6 w-6 text-gray-700 hover:bg-gray-200 hover:scale-170 hover:rounded-2xl hover:p-1' />
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
            className="relative cursor-pointer text-white rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition duration-300 shadow-lg hover:shadow-xl hover:scale-125 hover:rounded-2xl"
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

      {/* Backdrop Overlay */}
      {navDrawerOpen && (
        <div
          onClick={toggleNavDrawer}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity duration-300"
        ></div>
      )}

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white/90 backdrop-blur-md shadow-2xl
    transform transition-transform duration-300 ease-in-out z-50 
    ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleNavDrawer}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <IoMdClose className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Menu */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">✨ Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="flex items-center gap-3 text-gray-700 hover:text-black hover:translate-x-2 transform transition-all duration-200"
            >
              👔 <span>Men</span>
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="flex items-center gap-3 text-gray-700 hover:text-black hover:translate-x-2 transform transition-all duration-200"
            >
              👗 <span>Women</span>
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="flex items-center gap-3 text-gray-700 hover:text-black hover:translate-x-2 transform transition-all duration-200"
            >
              👕 <span>Top Wear</span>
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="flex items-center gap-3 text-gray-700 hover:text-black hover:translate-x-2 transform transition-all duration-200"
            >
              👖 <span>Bottom Wear</span>
            </Link>
            <Link
              to="/offers"
              onClick={toggleNavDrawer}
              className="flex items-center gap-3 text-red-600 font-semibold hover:text-red-700 hover:translate-x-2 transform transition-all duration-200"
            >
              🔥 <span>Offers</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
};


export default Navbar;