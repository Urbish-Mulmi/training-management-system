import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const navItems = [
    { to: "/admin/users", label: "Users" },
    { to: "/admin/courses", label: "Courses" },
    { to: "/admin/batches", label: "Batches" },
    { to: "/admin/blogs", label: "Blogs" },
    { to: "/admin/jobs", label: "Jobs" },
    { to: "/admin/testimonials", label: "Testimonials" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0">
        <div className="h-16 px-6 flex items-center border-b border-gray-200">
          <div>
            <h1 className="text-lg font-bold text-gray-900">TMS</h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Management
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="px-3 py-3 rounded-lg bg-gray-50">
            <p className="text-xs font-semibold text-gray-900">Administrator</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Management Portal</p>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="ml-64 flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="text-xs text-gray-400">
              Manage your training platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-900">Admin</p>
              <p className="text-[10px] text-gray-400">Administrator</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;