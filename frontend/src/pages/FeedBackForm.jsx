import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const FeedbackForm = () => {
    const { orderId, productId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/reviews`,
                { rating, comment, orderId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
            );
            alert("Review submitted!");
            navigate(-1);
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting review");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-r from-gray-50 to-gray-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Leave Your Feedback
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Rating with stars */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating:
                        </label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    type="button"
                                    key={num}
                                    onClick={() => setRating(num)}
                                    onMouseEnter={() => setHover(num)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        size={28}
                                        className={`transition-colors ${(hover || rating) >= num
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment box */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comment:
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                            rows="4"
                            placeholder="Write your thoughts..."
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
                    >
                        Submit Feedback
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default FeedbackForm;