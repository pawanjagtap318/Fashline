import { useEffect } from 'react'
import MyOrdersPage from './MyOrdersPage'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

export default function Profile() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/login");
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section: Profile Card */}
                    <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-md mb-4">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                            {user?.name}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base mb-6 text-center">
                            {user?.email}
                        </p>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium shadow-md transition"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Right Section: Orders */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <div className="bg-white shadow-lg rounded-2xl p-4 md:p-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 border-b pb-3">
                                My Orders
                            </h2>
                            <MyOrdersPage />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
