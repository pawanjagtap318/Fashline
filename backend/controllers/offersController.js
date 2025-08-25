const Product = require("../models/Product");

const getOffers = async (req, res) => {
  try {
    const now = new Date();

    let activeOffers = await Product.find({
      isOnDeal: true,
      discountEndDate: { $gte: now },
    }).limit(5);

    if (activeOffers.length === 0) {
      // Clear old offers
      await Product.updateMany({}, { $set: { isOnDeal: false, discountPercentage: 0, discountPrice: null } });

      // Pick 5 random products
      const randomProducts = await Product.aggregate([{ $sample: { size: 5 } }]);

      // Assign random discounts between 5%–25%
      const tenDaysLater = new Date();
      tenDaysLater.setDate(now.getDate() + 10);

      const updatedOffers = [];
      for (let prod of randomProducts) {
        const discount = Math.floor(Math.random() * 21) + 5; // random 5–25
        const discountedPrice = prod.price - (prod.price * discount) / 100;

        const updated = await Product.findByIdAndUpdate(
          prod._id,
          {
            $set: {
              discountPercentage: discount,
              discountPrice: discountedPrice,
              discountStartDate: now,
              discountEndDate: tenDaysLater,
              isOnDeal: true,
            },
          },
          { new: true }
        );
        updatedOffers.push(updated);
      }

      activeOffers = updatedOffers;
    }

    res.json(activeOffers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getOffers };
