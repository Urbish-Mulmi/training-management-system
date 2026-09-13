import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0">

        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">
            Student Dashboard
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            Access your enrolled courses, classrooms, and learning resources.
          </p>
        </div>

        <nav className="p-4 space-y-1">

          <NavLink
            to="/student/my-courses"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            My Courses
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

export default StudentLayout;