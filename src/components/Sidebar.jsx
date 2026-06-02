import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  History,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Briefcase,
  Sparkles,
  LogOut,
  Trash2,
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
    {
  name: "Trash",
  path: "/trash",
  icon: Trash2,
},
  ];

  const { logout } = useAuth();

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* MOBILE NAVBAR */}

      <aside className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur lg:hidden">
        {/* TOP */}

        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            {/* LOGO */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center  shadow-sm">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-slate-950 text-slate-950">
                Ilmul Jannah
              </h1>

              <p className="text-[11px] font-medium text-slate-500">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* RIGHT ICON */}

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Sparkles size={16} />
          </div>
        </div>

        {/* MOBILE MENU */}

        <nav className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200

                ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                }`}
              >
                <Icon size={16} strokeWidth={2.2} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* DESKTOP SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200/70 bg-white lg:flex lg:flex-col">
        {/* HEADER */}

        <div className="border-b border-slate-100 px-5 py-5">
          <Link to="/" className="flex items-center gap-4">
            {/* LOGO */}

            <div className="flex h-14 w-14 shrink-0 items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-[52px] w-[52px] object-contain drop-shadow-sm"
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-950">
                Ilmul Jannah
              </h1>

              <p className="mt-0.5 text-sm font-medium text-slate-500">
                Institute Admin
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </p>

          <nav className="mt-4 flex flex-col gap-1.5">
            {menu.map((item) => {
              const Icon = item.icon;

              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200

                  ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {/* ACTIVE BAR */}

                  <span
                    className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-all

                    ${isActive ? "bg-blue-500 opacity-100" : "opacity-0"}`}
                  />

                  {/* ICON */}

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200

                    ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900"
                    }`}
                  >
                    <Icon size={17} strokeWidth={2.2} />
                  </span>

                  {/* TEXT */}

                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}

        {/* FOOTER */}

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {/* USER */}

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  Administrator
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <p className="text-xs font-medium text-slate-500">
                    System Online
                  </p>
                </div>
              </div>
            </div>

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
