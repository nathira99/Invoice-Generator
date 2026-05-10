import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveStudent,
  getStudents,
  deleteStudent,
  updateStudent,
} from "../utils/localStorage";

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
    const confirmDelete = window.confirm("Delete this student?");

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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <Header />

        <div className="m-4 lg:m-8">
          <div className="w-full max-w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            {/* TOP */}

            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold sm:text-3xl">Students</h1>
            </div>

            {/* FORM */}

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                placeholder="Student Name"
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                type="text"
                name="contact"
                value={studentData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full rounded-xl border px-4 py-3"
              />

              <button
                onClick={handleAddStudent}
                className="rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white"
              >
                Add Student
              </button>
            </div>

            {/* TABLE */}

            {students.length === 0 ? (
              <div className="text-gray-500">No students found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  {/* HEADER */}

                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-4">Student Name</th>

                      <th>Contact Number</th>

                      <th>Actions</th>
                    </tr>
                  </thead>

                  {/* BODY */}

                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index} className="border-b">
                        {/* NAME */}

                        <td className="py-4 pr-4">
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
                              className="w-full rounded-lg border px-3 py-2"
                            />
                          ) : (
                            student.name
                          )}
                        </td>

                        {/* CONTACT */}

                        <td className="pr-4">
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
                              className="w-full rounded-lg border px-3 py-2"
                            />
                          ) : (
                            student.contact
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="py-3">
                          <div className="flex flex-wrap gap-3">
                            {editIndex === index ? (
                              <button
                                onClick={handleSaveEdit}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditStudent(student, index)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteStudent(index)}
                              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
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
