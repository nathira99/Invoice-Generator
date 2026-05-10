import { Link, useLocation } from "react-router-dom";

function Sidebar() {

  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Students",
      path: "/students",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Invoice History",
      path: "/invoice-history",
    },
  ];

  return (
    <aside className="w-full border-b bg-white px-3 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:p-6">
      <div className="grid gap-3 lg:flex lg:flex-1 lg:flex-col">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:block">
          <div className="flex min-w-0 items-center gap-2 lg:flex-col lg:items-center lg:gap-4 lg:pt-2">
            <img
              src="/logo.png"
              alt="Ilmul Jannah logo"
              className="h-9 w-9 shrink-0 object-contain lg:h-20 lg:w-20"
            />

            <h1 className="min-w-0 truncate text-xl font-bold text-blue-900 sm:text-2xl lg:text-center lg:text-3xl">
              Ilmul Jannah
            </h1>
          </div>

          <div className="inline-flex w-fit max-w-full items-center rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 sm:px-3 sm:text-sm lg:hidden">
            Admin Panel
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:mt-8 lg:block lg:space-y-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl px-2 py-2 text-center text-[11px] transition-all sm:px-3 sm:text-sm lg:px-4 lg:py-3 lg:text-left lg:text-base ${
                location.pathname === item.path
                  ? "bg-blue-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:mt-auto lg:inline-flex lg:w-full lg:items-center lg:justify-center lg:rounded-full lg:border lg:border-gray-200 lg:px-3 lg:py-2 lg:text-sm lg:font-semibold lg:text-gray-700">
          Admin Panel
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
