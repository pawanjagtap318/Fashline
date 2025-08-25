const Product = require("../models/Product");
const Order = require("../models/Order");

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).lean();

        for (let order of orders) {
            for (let item of order.orderItems) {
                const hasFeedback = await Product.exists({
                    _id: item.productId,
                    "reviews.user": req.user._id,
                    "reviews.order": order._id,
                });

                item.hasFeedback = !!hasFeedback;
                item.orderId = order._id;
            }
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const addProductReview = async (req, res) => {
    try {
        const { rating, comment, orderId } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingReview = product.reviews.find(
            (r) =>
                r.user.toString() === req.user._id.toString() &&
                r.order.toString() === orderId
        );

        if (existingReview) {
            existingReview.rating = Number(rating);
            existingReview.comment = comment;
        } else {
            product.reviews.push({
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
                order: orderId,
                product: req.params.id,
            });
        }

        // Recalculate average rating and number of reviews
        product.numOfReviews = product.reviews.length;
        const avgRating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            product.reviews.length;

        product.rating = Math.round(avgRating * 10) / 10;

        await product.save();

        res.status(201).json({
            message: existingReview
                ? "Review updated successfully"
                : "Review added successfully",
        });
    } catch (error) {
        console.error("Error in addProductReview:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUserOrders, addProductReview };
