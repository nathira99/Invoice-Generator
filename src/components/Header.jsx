function Header() {

  return (

    <div className="bg-white border-b px-8 py-5 flex justify-between items-center">

      <input
        type="text"
        placeholder="Search..."
        className="border rounded-xl px-4 py-2 w-80"
      />

      <div className="font-semibold text-gray-700">
        Admin Panel
      </div>

    </div>

  );

}

export default Header;