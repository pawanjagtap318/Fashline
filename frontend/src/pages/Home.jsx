import { useEffect, useState } from 'react'
import Hero from "./../components/Layout/Hero"
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import { motion } from "framer-motion"


function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
  }, [dispatch]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Gender Collection */}
      <motion.section
        className="max-w-7xl mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <GenderCollectionSection />
      </motion.section>

      {/* New Arrivals */}
      <motion.section
        className="max-w-7xl mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <NewArrivals />
      </motion.section>

      {/* Product Grid */}
      <motion.section
        className="max-w-7xl mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </motion.section>

      {/* Featured Collection */}
      <motion.section
        className="max-w-7xl mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <FeaturedCollection />
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="max-w-7xl mx-auto py-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <FeaturesSection />
      </motion.section>
    </div>
  )
}

export default Home;
