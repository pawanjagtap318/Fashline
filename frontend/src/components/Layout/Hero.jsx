import React from 'react'
import heroImg from "../../assets/fashline-hero.webp"
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className='relative'>
      <img
        src={heroImg}
        alt="Fashline"
        className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover z-0'
      />
      <div className='absolute inset-0 bg-opacity-10 flex items-center justify-center pointer-events-none'>
        <div className='text-center text-white p-6 pointer-events-auto'>
          <h1 className='text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4'>
            Vacation <br /> Ready
          </h1>
          <p className='text-sm tracking-tighter md:text-lg mb-6'>
            Explore our vacation-ready outfits with fast worldwide shipping.
          </p>
          <Link to="#" className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg'>
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
