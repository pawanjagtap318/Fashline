const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const userContext = {};

router.post("/", async (req, res) => {
    try {
        const { prompt, userId = "guest" } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Missing GEMINI_API_KEY in backend .env" });
        }

        const context = userContext[userId] || {};

        // Step 1: User says yes to comparison
        if (context.awaitingComparison && /^yes$/i.test(prompt.trim())) {
            userContext[userId].awaitingComparison = false;
            userContext[userId].awaitingSecondProduct = true;
            return res.json({ reply: "Great! Please provide the name of the second product for comparison." });
        }

        // Step 2: User says no
        if (context.awaitingComparison && /^no$/i.test(prompt.trim())) {
            userContext[userId].awaitingComparison = false;
            return res.json({ reply: "Alright! Let me know if you need help with anything else." });
        }

        // Step 3: Awaiting second product name
        if (context.awaitingSecondProduct) {
            const secondProduct = await Product.findOne({
                name: new RegExp(prompt.trim(), "i")
            });
            if (!secondProduct) {
                return res.json({ reply: `Sorry, I couldn't find "${prompt}". Please try another product name.` });
            }

            const firstProduct = await Product.findById(context.firstProductId);
            userContext[userId] = {}; // reset context

            if (!firstProduct) {
                return res.json({ reply: "Sorry, the first product is no longer available." });
            }

            const comparison = [
                `Comparison between **${firstProduct.name}** 🙵 **${secondProduct.name}**:`,
                `Gender: ${firstProduct.gender} 🆚 ${secondProduct.gender}`,
                `Price: ₹${firstProduct.price} 🆚 ₹${secondProduct.price}`,
                `Category: ${firstProduct.category} 🆚 ${secondProduct.category}`,
                `Rating: ${firstProduct.rating} 🆚 ${secondProduct.rating}`,
                `Colors: ${firstProduct.colors.join(", ")} 🆚 ${secondProduct.colors.join(", ")}`,
                `Sizes: ${firstProduct.sizes.join(", ")} 🆚 ${secondProduct.sizes.join(", ")}`,
            ];

            return res.json({ reply: comparison.join("\n") });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(`
            You are a professional, friendly AI assistant.

            You can handle:
            - Shopping/product queries
            - General AI tasks (documents, explanations, casual chat, coding help, etc.)

            Step 1: If the user's input is ONLY a greeting or small talk, respond with:
            {
              "type": "greeting",
              "message": "Hello! How can I assist you today?"
            }
            and stop.

            Step 2: If the user's input contains shopping intent 
            (e.g., mentions product names, prices, sizes, colors, brands, "gender", "rating", "show_product", "all", "images", categories like tshirts, jeans, order, buy, cost, discount, etc.), 
            then respond with:
            {
              "type": "product_query",
              "product_name": "<full product name or null if follow-up>",
              "requested_fields": ["name", "description", "colors", "sizes", "price", "discountPrice", "material", "collections", "category", "brand", "gender", "rating", "show_product", "all", "images"]
            }

            Step 3: If the input is not shopping-related, then it is a general AI request. Respond with:
            {
              "type": "general_ai",
              "task": "<short summary of what the user wants>",
              "response": "<your helpful answer>"
            }

            Respond with ONLY valid JSON — no backticks, no extra text.

            User: ${prompt}
        `);

        let text = result.response.text().trim().replace(/```json|```/gi, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            console.error("❌ JSON parse error:", err, "\nReceived text:", text);
            return res.json({ reply: "Sorry, I couldn't understand your request." });
        }

        if (parsed.type === "greeting") {
            return res.json({ reply: parsed.message });
        }

        if (parsed.type === "general_ai") {
            return res.json({ reply: parsed.response });
        }

        if (parsed.type === "product_query") {
            let product;
            if (parsed.product_name) {
                product = await Product.findOne({ name: new RegExp(parsed.product_name.trim(), "i") });
                if (!product) return res.json({ reply: `Sorry, no matching product found for "${parsed.product_name}".` });
                userContext[userId] = { lastProductId: product._id }; // store
            } else {
                if (!context.lastProductId) return res.json({ reply: "Please mention the product name first." });
                product = await Product.findById(context.lastProductId);
            }

            if (!product) return res.json({ reply: "Product not found." });

            const replyParts = [];

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("name")) {
                if (product.name) replyParts.push(`Product Name: ${product.name}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("colors")) {
                if (product.colors?.length) replyParts.push(`Available colors: ${product.colors.join(", ")}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("sizes")) {
                if (product.sizes?.length) replyParts.push(`Available sizes: ${product.sizes.join(", ")}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("price")) {
                replyParts.push(`Price: ₹${product.price}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("discountPrice")) {
                if (product.discountPrice) replyParts.push(`Discounted Price: ₹${product.discountPrice}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("description")) {
                if (product.description) replyParts.push(`Description: ${product.description}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("material")) {
                if (product.material) replyParts.push(`Material: ${product.material}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("collections")) {
                if (product.collections) replyParts.push(`Collections: ${product.collections}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("category")) {
                if (product.category) replyParts.push(`Category: ${product.category}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("brand")) {
                if (product.brand) replyParts.push(`Brand: ${product.brand}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("gender")) {
                if (product.gender) replyParts.push(`Gender: ${product.gender}`);
            }

            if (parsed.requested_fields.includes("all") || parsed.requested_fields.includes("rating")) {
                if (product.rating) replyParts.push(`Rating: ${product.rating}`);
            }

            if (parsed.requested_fields.includes("images")) {
                if (product.images) replyParts.push(["redirect", product._id]);
            }

            // If no requested fields matched, send a fallback
            if (replyParts.length === 0) {
                replyParts.push("I found the product, but no matching details were requested.");
            }

            const similarProducts = await Product.find({
                _id: { $ne: product._id },
                gender: product.gender,
                category: product.category
            }).limit(4);

            if (similarProducts.length) {
                replyParts.push("\nYou might also like:");
                similarProducts.forEach(sp => {
                    replyParts.push(`- ${sp.name} (₹${sp.price})`);
                });
            }

            // Ask for comparison
            userContext[userId] = {
                ...userContext[userId],
                awaitingComparison: true,
                firstProductId: product._id
            };
            replyParts.push("\nWould you like to compare this product with another? (yes/no)");

            return res.json({ reply: replyParts.join("\n") });
        }

    } catch (error) {
        console.error("🔥 Gemini API error:", error);
        res.status(500).json({
            error: "Gemini API request failed",
            details: error.message || error.toString(),
        });
    }
});

module.exports = router;
