import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-xl font-bold text-blue-400">TMS</h2>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Training Management System providing quality training,
              learning opportunities, and career support.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

            <div className="flex flex-col gap-3 text-gray-400">
              <NavLink to="/" className="hover:text-white">
                Home
              </NavLink>

              <NavLink to="/blogs" className="hover:text-white">
                Blogs
              </NavLink>

              <NavLink to="/job-placement" className="hover:text-white">
                Job Placement
              </NavLink>

              <NavLink to="/contact" className="hover:text-white">
                Contact
              </NavLink>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>

            <div className="space-y-3 text-gray-400">
              <p>Kathmandu, Nepal</p>
              <p>inquiryproject112@gmail.com</p>
              <p>+977 9800000000</p>
            </div>

            <div className="flex gap-4 mt-5">
              <a
                href="#"
                className="text-gray-400 hover:text-white"
              >
                Facebook
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white"
              >
                Instagram
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} TMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;