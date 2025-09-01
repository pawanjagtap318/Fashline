import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import login from "../assets/login.webp"
import { loginUser } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    // Get redirect paramater and check if it's checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
            {/* Left Section - Login Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center px-6 md:px-12">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md backdrop-blur-md bg-white/80 p-10 rounded-2xl shadow-2xl"
                >
                    <h2 className="text-3xl font-extrabold text-center mb-4 text-gray-900">
                        Welcome Back 👋
                    </h2>
                    <p className="text-center text-gray-600 mb-8">
                        Enter your email and password to continue.
                    </p>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg 
            hover:bg-gray-900 transform hover:scale-[1.02] transition-all"
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-gray-700">
                        Don’t have an account?{" "}
                        <Link
                            to={`/register?redirect=${encodeURIComponent(redirect)}`}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Section - Image */}
            <div className="hidden md:block w-1/2 relative">
                <img
                    src={login}
                    alt="Login to Account"
                    className="h-full w-full object-cover rounded-l-3xl shadow-2xl"
                />
                {/* Overlay for dark effect */}
                <div className="absolute inset-0 bg-black/20 rounded-l-3xl"></div>
            </div>
        </div>
    )
}

export default Login
