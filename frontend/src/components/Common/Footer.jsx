import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { Link } from "react-router-dom"
import { FiPhoneCall } from "react-icons/fi"

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 pt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6">

        {/* Newsletter */}
        <div className="p-6 rounded-2xl bg-white/60 shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Newsletter</h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            Be the first to hear about new products, exclusive events and online offers.
          </p>
          <p className="text-gray-700 text-sm font-medium mb-5">
            Sign up and get <span className="text-indigo-600 font-semibold">10% off</span> your first order.
          </p>

          {/* Newsletter Form */}
          <div className="flex flex-col w-full gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 text-gray-700 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
            <button className="place-self-center text-center bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-white font-semibold rounded-full transition-all text-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Shop Links */}
        <div className="p-6 rounded-2xl bg-white/60 shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Shop</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <Link
                to="/collections/all?category=Top+Wear&gender=Men"
                className="hover:text-indigo-600 transition-colors"
              >
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Top+Wear&gender=Women"
                className="hover:text-indigo-600 transition-colors"
              >
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Bottom+Wear&gender=Men"
                className="hover:text-indigo-600 transition-colors"
              >
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link
                to="/collections/all?category=Bottom+Wear&gender=Women"
                className="hover:text-indigo-600 transition-colors"
              >
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="p-6 rounded-2xl bg-white/60 shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Support</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <Link to="#" className="hover:text-indigo-600 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-indigo-600 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-indigo-600 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-indigo-600 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="p-6 rounded-2xl bg-white/60 shadow-md backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <TbBrandMeta className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              <IoLogoInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-sky-500 transition-colors"
            >
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>
          <p className="text-gray-500 text-sm">Call Us</p>
          <p className="flex items-center font-medium text-gray-700">
            <FiPhoneCall className="inline-block mr-2" /> 0123-456-789
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 border-t border-gray-300 py-6 px-6">
        <p className="text-gray-600 text-sm text-center">
          © 2025 <span className="font-semibold text-indigo-600">CompileTab</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;