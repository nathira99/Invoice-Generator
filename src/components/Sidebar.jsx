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

    <aside className="w-64 bg-white border-r min-h-screen p-6">

      <h1 className="text-3xl font-bold text-blue-900">
        Ilmul Jannah
      </h1>

      <div className="mt-10 space-y-3">

        {menu.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-blue-900 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.name}
          </Link>


        ))}

      </div>

    </aside>

  );

}

export default Sidebar;