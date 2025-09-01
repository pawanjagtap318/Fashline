import { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 text-gray-900">
            {/* Top Navbar for Mobile */}
            <div className="flex md:hidden items-center justify-between p-4 bg-gray-900 text-white shadow-lg z-30">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-700 transition"
                >
                    <FaBars size={22} />
                </button>
                <h1 className="ml-4 text-lg font-semibold tracking-wide">
                    Admin Dashboard
                </h1>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className={`fixed inset-0 bg-opacity-40 md:hidden backdrop-blur-xs transition-opacity duration-300 z-10 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-gray-900 to-gray-800 w-64 min-h-screen text-white 
          absolute md:relative transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:block shadow-lg z-20 mt-14 md:mt-0`}
            >
                <AdminSidebar toggleSidebar={toggleSidebar} />
            </div>

            {/* Main Content */}
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="bg-white shadow-md rounded-2xl p-6 min-h-[85vh]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
