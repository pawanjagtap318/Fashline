const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const { protect } = require("../middleware/authMiddleware");

dotenv.config();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    try {
        // Registration Login
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({message: "User already exits."});

        user = new User({ name, email, password });
        await user.save();

        // Create JWT Payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and Return the token along with the user data
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "40h"},
            (err, token) => {
                if(err) throw err;

                // Send the user and token in response
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            }
        );
    } catch(error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });

        if(!user) return res.status(400).json({message: "Invalid Credentials"});

        const isMatch = await user.matchPassword(password);

        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        // Create JWT Payload
        const payload = {user: {id: user._id, role: user.role}};

        // Sign and Return the token along with the user data
        jwt.sign(
            payload, 
            process.env.JWT_SECRET,
            {expiresIn: "40h"},
            (err, token) => {
                if(err) throw err;

                // Send the user and token in response
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route /api/users/profile
// @route GET logged-in user's profile (Protected Route)
// @access Private
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});


module.exports = router;