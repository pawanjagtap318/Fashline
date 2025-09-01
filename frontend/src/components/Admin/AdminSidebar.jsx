import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import Logo from '../../assets/Logo.png';

function AdminSidebar({ toggleSidebar }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
        if (typeof toggleSidebar === "function") toggleSidebar();
    };

    const navItemClass = ({ isActive }) =>
        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`;


    return (
        <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="mb-6 text-center">
                <Link to="/admin" onClick={toggleSidebar} className="flex justify-center hover:scale-105 transition-transform">
                    <img src={Logo} alt="Fashline Logo" className="h-12 w-auto object-contain" />
                </Link>
                <h2 className="mt-3 text-sm font-medium text-gray-400 uppercase tracking-widest">
                    Admin Panel
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-2">
                <NavLink to="/admin/users" onClick={toggleSidebar} className={navItemClass}>
                    <FaUser />
                    <span>Users</span>
                </NavLink>

                <NavLink to="/admin/products" onClick={toggleSidebar} className={navItemClass}>
                    <FaBoxOpen />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/admin/orders" onClick={toggleSidebar} className={navItemClass}>
                    <FaClipboardList />
                    <span>Orders</span>
                </NavLink>

                <NavLink to="/" onClick={toggleSidebar} className={navItemClass}>
                    <FaStore />
                    <span>Shop</span>
                </NavLink>

                {/* Logout right under Shop */}
                <div className="mt-3">
                    <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-shadow duration-200 shadow-sm hover:shadow-md"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default AdminSidebar
