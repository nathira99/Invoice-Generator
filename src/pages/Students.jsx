import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveStudent,
  getStudents,
  deleteStudent,
  updateStudent,
} from "../utils/Storage";

function Students() {
  const [students, setStudents] = useState(getStudents());

  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    contact: "",
  });

  const [studentData, setStudentData] = useState({
    name: "",
    contact: "",
  });

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = () => {
    if (!studentData.name || !studentData.contact) {
      alert("Please fill all fields.");

      return;
    }

    saveStudent(studentData);

    setStudents(getStudents());

    setStudentData({
      name: "",
      contact: "",
    });
  };

  const handleDeleteStudent = (index) => {
    const confirmDelete = window.confirm(
      "Delete this student?"
    );

    if (!confirmDelete) return;

    deleteStudent(index);

    setStudents(getStudents());
  };

  const handleEditStudent = (student, index) => {
    setEditIndex(index);

    setEditData(student);
  };

  const handleSaveEdit = () => {
    if (!editData.name || !editData.contact) {
      alert("Please fill all fields.");

      return;
    }

    updateStudent(editIndex, editData);

    setStudents(getStudents());

    setEditIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-4 lg:p-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Students
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage all student details
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 px-5 py-4">
                <p className="text-sm text-blue-600">
                  Total Students
                </p>

                <h2 className="mt-1 text-2xl font-bold text-blue-900">
                  {students.length}
                </h2>
              </div>
            </div>

            {/* FORM */}

            <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                placeholder="Student Name"
                className={inputStyle}
              />

              <input
                type="text"
                name="contact"
                value={studentData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className={inputStyle}
              />

              <button
                onClick={handleAddStudent}
                className="rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-lg"
              >
                Add Student
              </button>
            </div>

            {/* TABLE */}

            {students.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-gray-500">
                No students found.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[700px]">
                  {/* HEADER */}

                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm font-semibold text-gray-600">
                      <th className="px-6 py-5">
                        Student Name
                      </th>

                      <th className="px-6 py-5">
                        Contact Number
                      </th>

                      <th className="px-6 py-5 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}

                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* NAME */}

                        <td className="px-6 py-5">
                          {editIndex === index ? (
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                              className={inputStyle}
                            />
                          ) : (
                            <div>
                              <p className="font-medium text-gray-900">
                                {student.name}
                              </p>
                            </div>
                          )}
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-5 text-gray-600">
                          {editIndex === index ? (
                            <input
                              type="text"
                              value={editData.contact}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  contact: e.target.value,
                                })
                              }
                              className={inputStyle}
                            />
                          ) : (
                            student.contact
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3">
                            {editIndex === index ? (
                              <button
                                onClick={handleSaveEdit}
                                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleEditStudent(
                                    student,
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
                                handleDeleteStudent(index)
                              }
                              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default Students;