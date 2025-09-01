import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterLine } from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi";

export default function Topbar() {
  return (
    <div className="bg-gradient-to-r from-[#ea2e0e] to-[#ff5733] text-white text-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between py-2 px-4 space-y-2 sm:space-y-0">

        {/* Left - Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition transform duration-200"
          >
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition transform duration-200"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition transform duration-200"
          >
            <RiTwitterLine className="h-5 w-5" />
          </a>
        </div>

        {/* Center - Message */}
        <div className="text-center font-medium tracking-tight">
          🌍 We ship worldwide - <span className="font-semibold">Fast & Reliable!</span>
        </div>

        {/* Right - Phone */}
        <div className="flex items-center space-x-2">
          <FiPhoneCall className="h-4 w-4" />
          <a
            href="tel:+1234567890"
            className="hover:text-gray-200 transition"
          >
            1+ (234) 567-890
          </a>
        </div>
      </div>
    </div>
  )
};