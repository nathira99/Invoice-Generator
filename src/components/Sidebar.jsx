import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  History,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Briefcase,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Invoices",
      path: "/invoice-history",
      icon: History,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Teachers",
      path: "/teachers",
      icon: GraduationCap,
    },
    {
      name: "Staff",
      path: "/staff",
      icon: Briefcase,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* MOBILE TOPBAR */}

      <aside className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm lg:hidden">
        {/* TOP */}

        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-11 w-11 rounded-xl object-contain"
          />

          <div>
            <h1 className="text-lg font-bold text-blue-900">Ilmul Jannah</h1>

            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* MENU */}

        <nav className="mt-4 grid grid-cols-2 gap-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition-all

                ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* DESKTOP SIDEBAR */}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 shadow-sm lg:flex">
        {/* LOGO */}

        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-14 w-14 rounded-2xl object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-blue-900">
                Ilmul Jannah
              </h1>

              <p className="mt-1 text-sm text-gray-500">Institute Panel</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="mt-8 flex flex-col gap-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all

                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ADMIN */}

        <div className="mt-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-800">Admin</p>

          <p className="mt-1 text-xs text-green-600">Online</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
