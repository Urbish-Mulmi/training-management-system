import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const InstructorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">
            Instructor Dashboard
          </h1>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink
            to="/instructor/students"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            My Student Management
          </NavLink>

          <NavLink
            to="/instructor/courses"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            My Course Management
          </NavLink>

          <NavLink
            to="/instructor/assignments"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            My Assignment Management
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};

export default InstructorLayout;