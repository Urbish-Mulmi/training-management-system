import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../useContext/AuthContext.jsx";

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background body scrolling when the side drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
    }`;

  const mobileNavLinkStyle = ({ isActive }) =>
    `block text-base font-medium transition-colors duration-200 py-2.5 px-4 rounded-lg ${
      isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left - Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold group-hover:bg-blue-700 transition-colors">
            T
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight text-gray-900 leading-none">
              TMS
            </p>
            <p className="text-[9px] text-gray-400 tracking-widest mt-0.5">
              LEARN. GROW. ACHIEVE.
            </p>
          </div>
        </NavLink>

        {/* Center - Desktop Navigation Links (> 964px) */}
        <div className="hidden min-[965px]:flex items-center gap-6 lg:gap-7">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/blogs" className={navLinkStyle}>
            Blogs
          </NavLink>

          <NavLink to="/job-placement" className={navLinkStyle}>
            Job Placement
          </NavLink>

          <NavLink to="/contact" className={navLinkStyle}>
            Contact
          </NavLink>

          <NavLink to="/testimonials" className={navLinkStyle}>
            Testimonials
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkStyle}>
              Admin Dashboard
            </NavLink>
          )}

          {user?.role === "instructor" && (
            <NavLink to="/instructor" className={navLinkStyle}>
              Instructor Dashboard
            </NavLink>
          )}

          {user?.role === "student" && (
            <NavLink to="/student" className={navLinkStyle}>
              Student Dashboard
            </NavLink>
          )}
        </div>

        {/* Right - Desktop User Actions (> 964px) */}
        <div className="hidden min-[965px]:flex items-center gap-4">
          {user ? (
            <>
              <NavLink to="/get-me" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 group-hover:bg-blue-100 transition">
                  {user?.fullname?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900 leading-none">
                    {user?.fullname}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize mt-1">
                    {user?.role}
                  </p>
                </div>
              </NavLink>

              <NavLink
                to="/logout"
                className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                Logout
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/login"
                className="text-sm font-medium text-blue-600 border border-blue-200 px-4 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
              >
                Login
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button (<= 964px) */}
        <button
          onClick={() => setIsOpen(true)}
          className="min-[965px]:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Backdrop Overlay with smooth transition */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 min-[965px]:hidden backdrop-blur-xs ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Right Side Sliding Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col min-[965px]:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900 tracking-wide">Menu</p>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Panel Body Links (Scrollable if content overflows) */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/blogs" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
            Blogs
          </NavLink>

          <NavLink to="/job-placement" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
            Job Placement
          </NavLink>

          <NavLink to="/contact" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
            Contact
          </NavLink>

          <NavLink to="/testimonials" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
            Testimonials
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
              Admin Dashboard
            </NavLink>
          )}

          {user?.role === "instructor" && (
            <NavLink to="/instructor" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
              Instructor Dashboard
            </NavLink>
          )}

          {user?.role === "student" && (
            <NavLink to="/student" onClick={() => setIsOpen(false)} className={mobileNavLinkStyle}>
              Student Dashboard
            </NavLink>
          )}
        </div>

        {/* Panel Footer / User Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          {user ? (
            <div className="space-y-4">
              <NavLink to="/get-me" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                  {user?.fullname?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 leading-none">
                    {user?.fullname}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize mt-1">
                    {user?.role}
                  </p>
                </div>
              </NavLink>

              <NavLink
                to="/logout"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-red-600 border border-red-200 py-2.5 rounded-lg bg-white shadow-sm hover:bg-red-50 transition"
              >
                Logout
              </NavLink>
            </div>
          ) : (
            <div className="flex gap-3">
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-lg bg-white hover:bg-gray-50 transition"
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-sm font-medium text-white bg-blue-600 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition"
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;