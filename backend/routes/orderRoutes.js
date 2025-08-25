const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");


// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({ 
            user: req.user._id}).sort({ 
                createdAt: -1, 
            });
            res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user", "name email"
        );

        if (!order) return res.status(404).json({message: "Order not Found."});

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


module.exports = router;