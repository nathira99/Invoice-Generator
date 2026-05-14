import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Staff() {

  const [staffs, setStaffs] =
    useState(
      JSON.parse(
        localStorage.getItem("staffs")
      ) || []
    );

  const [staffData, setStaffData] =
    useState({
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

  const [editIndex, setEditIndex] =
    useState(null);

  const [editData, setEditData] =
    useState({
      name: "",
      role: "Admin",
      contact: "",
      email: "",
      joiningDate: "",
      status: "Active",
    });

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const saveStaffs = (
    updatedStaffs
  ) => {

    localStorage.setItem(
      "staffs",
      JSON.stringify(updatedStaffs)
    );

    setStaffs(updatedStaffs);

  };

  const handleChange = (e) => {

    setStaffData({
      ...staffData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleAddStaff = () => {

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

    const updatedStaffs = [
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

  const handleDeleteStaff = (
    index
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this staff?"
      );

    if (!confirmDelete)
      return;

    const updatedStaffs =
      staffs.filter(
        (_, i) => i !== index
      );

    saveStaffs(
      updatedStaffs
    );

  };

  const handleEditStaff = (
    staff,
    index
  ) => {

    setEditIndex(index);

    setEditData(staff);

  };

  const handleSaveEdit = () => {

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

    updatedStaffs[editIndex] =
      editData;

    saveStaffs(
      updatedStaffs
    );

    setEditIndex(null);

  };

  return (

    <div className="min-h-screen bg-gray-100 lg:flex">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">

        <Header />

        <div className="p-4 lg:p-8">

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">

            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Staff Management
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage institute staff and admins
                </p>

              </div>

              <div className="rounded-2xl bg-blue-50 px-5 py-4">

                <p className="text-sm text-blue-600">
                  Total Staff
                </p>

                <h2 className="mt-1 text-2xl font-bold text-blue-900">
                  {staffs.length}
                </h2>

              </div>

            </div>

            {/* FORM */}

            <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-6">

              {/* NAME */}

              <input
                type="text"
                name="name"
                value={staffData.name}
                onChange={handleChange}
                placeholder="Staff Name"
                className={inputStyle}
              />

              {/* ROLE */}

              <select
                name="role"
                value={staffData.role}
                onChange={handleChange}
                className={inputStyle}
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

              {/* CONTACT */}

              <input
                type="text"
                name="contact"
                value={staffData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className={inputStyle}
              />

              {/* EMAIL */}

              <input
                type="email"
                name="email"
                value={staffData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={inputStyle}
              />

              {/* JOINING DATE */}

              <input
                type="date"
                name="joiningDate"
                value={
                  staffData.joiningDate
                }
                onChange={handleChange}
                className={inputStyle}
              />

              {/* BUTTON */}

              <button
                onClick={
                  handleAddStaff
                }
                className="rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-lg"
              >
                Add Staff
              </button>

            </div>

            {/* TABLE */}

            {staffs.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-gray-500">

                No staff found.

              </div>

            ) : (

              <div className="overflow-x-auto rounded-2xl border border-gray-100">

                <table className="w-full min-w-[1200px]">

                  {/* HEADER */}

                  <thead className="bg-gray-50">

                    <tr className="text-left text-sm font-semibold text-gray-600">

                      <th className="px-6 py-5">
                        Name
                      </th>

                      <th className="px-6 py-5">
                        Role
                      </th>

                      <th className="px-6 py-5">
                        Contact
                      </th>

                      <th className="px-6 py-5">
                        Email
                      </th>

                      <th className="px-6 py-5">
                        Joining Date
                      </th>

                      <th className="px-6 py-5">
                        Status
                      </th>

                      <th className="px-6 py-5 text-center">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  {/* BODY */}

                  <tbody>

                    {staffs.map(
                      (
                        staff,
                        index
                      ) => (

                        <tr
                          key={index}
                          className="border-t border-gray-100 transition hover:bg-gray-50"
                        >

                          {/* NAME */}

                          <td className="px-6 py-5">

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

                              <p className="font-medium text-gray-900">
                                {
                                  staff.name
                                }
                              </p>

                            )}

                          </td>

                          {/* ROLE */}

                          <td className="px-6 py-5">

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

                          </td>

                          {/* CONTACT */}

                          <td className="px-6 py-5 text-gray-700">

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
                                className={
                                  inputStyle
                                }
                              />

                            ) : (

                              staff.contact

                            )}

                          </td>

                          {/* EMAIL */}

                          <td className="px-6 py-5 text-gray-700">

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
                                className={
                                  inputStyle
                                }
                              />

                            ) : (

                              staff.email

                            )}

                          </td>

                          {/* DATE */}

                          <td className="px-6 py-5 text-gray-700">

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
                                className={
                                  inputStyle
                                }
                              />

                            ) : (

                              new Date(
                                staff.joiningDate
                              ).toLocaleDateString(
                                "en-GB"
                              )

                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

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
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  staff.status ===
                                  "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {
                                  staff.status
                                }
                              </span>

                            )}

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-center gap-3">

                              {editIndex ===
                              index ? (

                                <button
                                  onClick={
                                    handleSaveEdit
                                  }
                                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                >
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
                                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                  Edit
                                </button>

                              )}

                              <button
                                onClick={() =>
                                  handleDeleteStaff(
                                    staff._id
                                  )
                                }
                                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>

  );

}

export default Staff;