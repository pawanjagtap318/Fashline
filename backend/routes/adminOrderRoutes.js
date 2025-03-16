const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");


// @route GET /api/admin/orders
// @desc Get all orders
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error.");
    }
});


// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");

        if(order) {
            order.status = req.body.status || order.status;
            if (order.status === "Delivered") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else {
                order.isDelivered = false;
                order.deliveredAt = null;
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({message: "Order not Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error.");
    }
});


// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(order) {
            await order.deleteOne();
            res.json({message: "Order deleted successfully."});
        } else {
            res.status(404).json({message: "Order not found."});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error.");
    }
});


module.exports = router; 