import { useState, useEffect } from "react";

import { Users, UserPlus, Pencil, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveStudent,
  getStudents,
  deleteStudent,
  updateStudent,
} from "../utils/Storage";

function Students() {
  const [students, setStudents] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({
    studentId: "",
    name: "",
    contact: "",
  });

  const [studentData, setStudentData] = useState({
    studentId: "",
    name: "",
    contact: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async () => {
    if (!studentData.studentId || !studentData.name || !studentData.contact) {
      toast.error("Please fill all fields.");

      return;
    }

    try {
      await saveStudent(studentData);

      await loadStudents();

      setStudentData({
        studentId: "",
        name: "",
        contact: "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to add student");
    }
  };

  const handleDeleteStudent = async (id) => {
    const result =
  await Swal.fire({
    title: "Delete student?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    borderRadius: "20px",
  });

if (!result.isConfirmed)
  return;

    try {
      await deleteStudent(id);

      await loadStudents();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete student");
    }
  };

  const handleEditStudent = (student, index) => {
    setEditIndex(index);

    setEditData(student);
  };

  const handleSaveEdit = async () => {
    try {
      await updateStudent(editData._id, editData);

      await loadStudents();

      setEditIndex(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update student");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <Header />

        <div className="pt-28 p-4 lg:p-8 lg:pt-8">
          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Users size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Students
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Manage all registered students
                </p>
              </div>
            </div>

            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Students
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-950">
                {students.length}
              </h2>
            </div>
          </div>

          {/* ADD FORM */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <UserPlus size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Student
                </h2>

                <p className="text-sm text-slate-500">
                  Create a new student profile
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <input
                type="text"
                name="studentId"
                value={studentData.studentId}
                onChange={handleChange}
                placeholder="Student ID"
                className={inputStyle}
              />

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
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* TABLE */}

          {students.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                No students found.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* TABLE HEADER */}

              <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 lg:block">
                <div className="grid grid-cols-[1fr_1.2fr_1fr_0.8fr] gap-4 text-sm font-semibold text-slate-500">
                  <p>Student ID</p>

                  <p>Student Name</p>

                  <p>Contact Number</p>

                  <p className="text-center">Actions</p>
                </div>
              </div>

              {/* ROWS */}

              <div>
                {students.map((student, index) => (
                  <div
                    key={student._id || index}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_1.2fr_1fr_0.8fr] lg:items-center">
                      {/* STUDENT ID */}

<div>

  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
    Student ID
  </p>

  {editIndex === index ? (

    <input
      type="text"
      value={editData.studentId}
      onChange={(e) =>
        setEditData({
          ...editData,
          studentId:
            e.target.value,
        })
      }
      className={`${inputStyle} mt-2`}
    />

  ) : (

    <p className="mt-1 font-semibold text-slate-700">
      {student.studentId}
    </p>

  )}

</div>
                      
                      {/* NAME */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Student
                        </p>

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
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <p className="mt-1 font-semibold text-slate-900">
                            {student.name}
                          </p>
                        )}
                      </div>

                      {/* CONTACT */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Contact
                        </p>

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
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {student.contact}
                          </p>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 items-center justify-start gap-1 lg:justify-center">
                        {editIndex === index ? (
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <Check size={15} />
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditStudent(student, index)}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteStudent(student._id)}
                          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Students;
