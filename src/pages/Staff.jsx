import {
  useState,
  useEffect,
} from "react";

import {
  ShieldCheck,
  UserPlus,
  Pencil,
  Trash2,
  Check,
  Mail,
  Phone,
  CalendarDays,
  Search,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Staff() {

  const [staffs, setStaffs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    editIndex,
    setEditIndex,
  ] = useState(null);

  const [
    editData,
    setEditData,
  ] = useState({

    name: "",

    role: "Admin",

    contact: "",

    email: "",

    joiningDate: "",

    status: "Active",

  });

  const [
    staffData,
    setStaffData,
  ] = useState({

    name: "",

    role: "Admin",

    contact: "",

    email: "",

    joiningDate:
      new Date()
        .toISOString()
        .split("T")[0],

    status: "Active",

  });

  useEffect(() => {

    const storedStaffs =
      JSON.parse(
        localStorage.getItem(
          "staffs"
        )
      ) || [];

    setStaffs(
      storedStaffs
    );

  }, []);

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const saveStaffs =
    (
      updatedStaffs
    ) => {

      localStorage.setItem(
        "staffs",
        JSON.stringify(
          updatedStaffs
        )
      );

      setStaffs(
        updatedStaffs
      );

    };

  const handleChange =
    (e) => {

      setStaffData({
        ...staffData,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleAddStaff =
    () => {

      if (
        !staffData.name ||
        !staffData.contact ||
        !staffData.email
      ) {

        alert(
          "Please fill all fields."
        );

        return;

      }

      const updatedStaffs =
        [
          ...staffs,
          staffData,
        ];

      saveStaffs(
        updatedStaffs
      );

      setStaffData({

        name: "",

        role: "Admin",

        contact: "",

        email: "",

        joiningDate:
          new Date()
            .toISOString()
            .split("T")[0],

        status: "Active",

      });

    };

  const handleDeleteStaff =
    (index) => {

      const confirmDelete =
        window.confirm(
          "Delete this staff?"
        );

      if (!confirmDelete)
        return;

      const updatedStaffs =
        staffs.filter(
          (_, i) =>
            i !== index
        );

      saveStaffs(
        updatedStaffs
      );

    };

  const handleEditStaff =
    (
      staff,
      index
    ) => {

      setEditIndex(index);

      setEditData(staff);

    };

  const handleSaveEdit =
    () => {

      if (
        !editData.name ||
        !editData.contact ||
        !editData.email
      ) {

        alert(
          "Please fill all fields."
        );

        return;

      }

      const updatedStaffs =
        [...staffs];

      updatedStaffs[
        editIndex
      ] = editData;

      saveStaffs(
        updatedStaffs
      );

      setEditIndex(null);

    };

  const filteredStaffs =
    staffs.filter(
      (staff) =>

        staff.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        staff.role
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <div className="min-h-screen bg-slate-50 lg:flex">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        <Header />

        <div className="p-4 lg:p-8">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">

                <ShieldCheck
                  size={28}
                />

              </div>

              <div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Staff Management
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Manage institute admins and staff
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

              {/* SEARCH */}

              <div className="relative w-full lg:w-72">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* TOTAL */}

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Staff
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-950">
                  {staffs.length}
                </h2>

              </div>

            </div>

          </div>

          {/* ADD FORM */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">

                <UserPlus
                  size={22}
                />

              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Add Staff
                </h2>

                <p className="text-sm text-slate-500">
                  Create staff member profile
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">

              <input
                type="text"
                name="name"
                value={
                  staffData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Staff Name"
                className={
                  inputStyle
                }
              />

              <select
                name="role"
                value={
                  staffData.role
                }
                onChange={
                  handleChange
                }
                className={
                  inputStyle
                }
              >

                <option value="Admin">
                  Admin
                </option>

                <option value="Accountant">
                  Accountant
                </option>

                <option value="Receptionist">
                  Receptionist
                </option>

                <option value="Staff">
                  Staff
                </option>

              </select>

              <input
                type="text"
                name="contact"
                value={
                  staffData.contact
                }
                onChange={
                  handleChange
                }
                placeholder="Contact Number"
                className={
                  inputStyle
                }
              />

              <input
                type="email"
                name="email"
                value={
                  staffData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Email Address"
                className={
                  inputStyle
                }
              />

              <input
                type="date"
                name="joiningDate"
                value={
                  staffData.joiningDate
                }
                onChange={
                  handleChange
                }
                className={
                  inputStyle
                }
              />

              <button
                onClick={
                  handleAddStaff
                }
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Add Staff
              </button>

            </div>

          </div>

          {/* STAFF CARDS */}

          {filteredStaffs.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

              <p className="text-sm font-medium text-slate-500">
                No staff found.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

              {filteredStaffs.map(
                (
                  staff,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-4">

                        {/* AVATAR */}

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">

                          {staff.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        {/* INFO */}

                        <div>

                          {editIndex ===
                          index ? (

                            <input
                              type="text"
                              value={
                                editData.name
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name:
                                    e.target
                                      .value,
                                })
                              }
                              className={
                                inputStyle
                              }
                            />

                          ) : (

                            <h2 className="text-lg font-bold text-slate-900">
                              {
                                staff.name
                              }
                            </h2>

                          )}

                          <div className="mt-2">

                            {editIndex ===
                            index ? (

                              <select
                                value={
                                  editData.role
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    role:
                                      e.target
                                        .value,
                                  })
                                }
                                className={
                                  inputStyle
                                }
                              >

                                <option value="Admin">
                                  Admin
                                </option>

                                <option value="Accountant">
                                  Accountant
                                </option>

                                <option value="Receptionist">
                                  Receptionist
                                </option>

                                <option value="Staff">
                                  Staff
                                </option>

                              </select>

                            ) : (

                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                                {
                                  staff.role
                                }

                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                      {/* STATUS */}

                      <div>

                        {editIndex ===
                        index ? (

                          <select
                            value={
                              editData.status
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status:
                                  e.target
                                    .value,
                              })
                            }
                            className={
                              inputStyle
                            }
                          >

                            <option value="Active">
                              Active
                            </option>

                            <option value="Inactive">
                              Inactive
                            </option>

                          </select>

                        ) : (

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold

                            ${
                              staff.status ===
                              "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >

                            {
                              staff.status
                            }

                          </span>

                        )}

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-6 space-y-4">

                      {/* CONTACT */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                          <Phone
                            size={18}
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Contact
                          </p>

                          {editIndex ===
                          index ? (

                            <input
                              type="text"
                              value={
                                editData.contact
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  contact:
                                    e.target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            />

                          ) : (

                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {
                                staff.contact
                              }
                            </p>

                          )}

                        </div>

                      </div>

                      {/* EMAIL */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                          <Mail
                            size={18}
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Email
                          </p>

                          {editIndex ===
                          index ? (

                            <input
                              type="email"
                              value={
                                editData.email
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  email:
                                    e.target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            />

                          ) : (

                            <p className="mt-1 truncate text-sm font-medium text-slate-700">
                              {
                                staff.email
                              }
                            </p>

                          )}

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                          <CalendarDays
                            size={18}
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Joining Date
                          </p>

                          {editIndex ===
                          index ? (

                            <input
                              type="date"
                              value={
                                editData.joiningDate
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  joiningDate:
                                    e.target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            />

                          ) : (

                            <p className="mt-1 text-sm font-medium text-slate-700">

                              {new Date(
                                staff.joiningDate
                              ).toLocaleDateString(
                                "en-GB"
                              )}

                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {editIndex ===
                      index ? (

                        <button
                          onClick={
                            handleSaveEdit
                          }
                          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >

                          <Check
                            size={15}
                          />

                          Save

                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            handleEditStaff(
                              staff,
                              index
                            )
                          }
                          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >

                          <Pencil
                            size={15}
                          />

                          Edit

                        </button>

                      )}

                      <button
                        onClick={() =>
                          handleDeleteStaff(
                            index
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                      >

                        <Trash2
                          size={15}
                        />

                        Delete

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </main>

    </div>

  );

}

export default Staff;