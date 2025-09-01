import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'
import { motion } from "framer-motion"

function FeaturesSection() {
    const features = [
        {
            icon: <HiShoppingBag className="w-8 h-8 text-indigo-600" />,
            title: "FREE INTERNATIONAL SHIPPING",
            desc: "On all orders over $100.00",
        },
        {
            icon: <HiArrowPathRoundedSquare className="w-8 h-8 text-indigo-600" />,
            title: "45 DAYS RETURN",
            desc: "Money back guarantee",
        },
        {
            icon: <HiOutlineCreditCard className="w-8 h-8 text-indigo-600" />,
            title: "SECURE CHECKOUT",
            desc: "100% secured checkout process",
        },
    ];

    return (
        <section className="py-2 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 flex flex-col items-center text-center"
                    >
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                            {feature.icon}
                        </div>
                        <h4 className="text-lg font-semibold tracking-tight mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default FeaturesSection;