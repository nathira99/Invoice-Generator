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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* TOP */}

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Students</h1>
            </div>

            {/* FORM */}

            <div className="grid grid-cols-3 gap-4 mb-8">
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                placeholder="Student Name"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                name="contact"
                value={studentData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="border rounded-xl px-4 py-3"
              />

              <button
                onClick={handleAddStudent}
                className="bg-blue-900 text-white rounded-xl px-5 py-3"
              >
                Add Student
              </button>
            </div>

            {/* TABLE */}

            {students.length === 0 ? (
              <div className="text-gray-500">No students found.</div>
            ) : (
              <table className="w-full">
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

                      <td className="py-4">
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
                            className="border rounded-lg px-3 py-2"
                          />
                        ) : (
                          student.name
                        )}
                      </td>

                      {/* CONTACT */}

                      <td>
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
                            className="border rounded-lg px-3 py-2"
                          />
                        ) : (
                          student.contact
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="py-3 flex gap-3">
                        {editIndex === index ? (
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditStudent(student, index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteStudent(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Students;
