import React from "react";
import logo from "../assets/logo1.png";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white px-4 md:px-10 py-10 mt-30 border-t text-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-30 items-start">
        {/* Left: Logo and description */}
        <div className="space-y-1">
          <img src={logo} alt="MedLink Logo" className="w-32" />
          <p className="text-sm leading-5 text-gray-600 max-w-sm">
            Connecting patients with trusted healthcare professionals anytime,
            anywhere. Our telemedicine platform ensures conveniency, and
            security, for better health outcomes.
          </p>
          {/* Social Media Icons */}
          <div className="flex gap-3 mt-3 text-blue-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF
                className="hover:text-blue-700 transition"
                size={18}
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="hover:text-blue-700 transition" size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn
                className="hover:text-blue-700 transition"
                size={18}
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="hover:text-blue-700 transition"
                size={18}
              />
            </a>
          </div>
        </div>

        {/* Middle: Company links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-blue-500 cursor-pointer">Home</li>
            <li className="hover:text-blue-500 cursor-pointer">About Us</li>
            <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-500 cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Right: Contact info */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="tel:+2347013963735" className="hover:text-blue-500">
                +234 701 396 3735
              </a>
            </li>
            <li>
              <a
                href="mailto:raphealpeace85@gmail.com"
                className="hover:text-blue-500"
              >
                raphealpeace85@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider and copyright */}
      <div className="mt-10 border-t pt-5 text-center text-xs text-gray-500">
        © 2025 MedLink. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
