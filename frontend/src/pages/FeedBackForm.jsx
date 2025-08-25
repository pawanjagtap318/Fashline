import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FeedbackForm = () => {
    const { orderId, productId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
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
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Leave Feedback</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}

            <form onSubmit={handleSubmit}>
                <label className="block mb-2">Rating:</label>
                <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                >
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    rows="4"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;