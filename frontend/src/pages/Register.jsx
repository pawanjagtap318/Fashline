import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import register from "../assets/register.webp"
import { registerUser } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';

function Register() {
    const [name, setName] = useState("");
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
        dispatch(registerUser({ name, email, password }));
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-gray-50">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border"
                >
                    {/* Heading */}
                    <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
                        Hey there! 👋🏻
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Enter your name, email and password to register.
                    </p>

                    {/* Name */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-800 text-white py-3 px-4 rounded-lg font-semibold shadow-md transition"
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>

                    {/* Login Redirect */}
                    <p className="mt-6 text-center text-sm text-gray-700">
                        Already have an account?{" "}
                        <Link
                            to={`/login?redirect=${encodeURIComponent(redirect)}`}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right: Image */}
            <div className="hidden md:block w-1/2">
                <img
                    src={register}
                    alt="Register"
                    className="h-full w-full object-cover rounded-l-2xl"
                />
            </div>
        </div>
    )
}

export default Register;
