import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../useContext/AuthContext.jsx";


const Navbar = () => {
  const { user } = useAuth();

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  const dashboardStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 relative flex items-center justify-between">

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

        {/* Center - Main Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-7">
          <NavLink to="/" className={navLinkStyle} >
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
            <NavLink to="/admin" className={dashboardStyle}>
              Admin Dashboard
            </NavLink>
          )}

          {user?.role === "instructor" && (
            <NavLink to="/instructor" className={dashboardStyle}>
              Instructor Dashboard
            </NavLink>
          )}

          {user?.role === "student" && (
            <NavLink to="/student" className={dashboardStyle}>
              Student Dashboard
            </NavLink>
          )}
        </div>

        {/* Right - User Actions */}
        <div className="flex items-center gap-5 ml-auto">
          {user ? (
            <>
              <NavLink
                to="/get-me"
                className="flex items-center gap-2 group"
              >
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
                className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-md hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
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
                className="text-sm font-medium text-blue-600 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;