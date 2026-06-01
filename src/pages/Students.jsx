import { useState, useEffect } from "react";

import { Users, UserPlus, Pencil, Trash2, Check } from "lucide-react";

import Select from "react-select";

import toast from "react-hot-toast";

import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveStudent,
  getStudents,
  deleteStudent,
  updateStudent,
  getCourses,
} from "../utils/Storage";

function Students() {
  const [students, setStudents] = useState([]);

  const [courses, setCourses] = useState([]);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({
    studentId: "",
    name: "",
    contact: "",
    enrolledCourses: [],
    notes: "",
    status: "Active",
  });

  const [studentData, setStudentData] = useState({
    studentId: "",
    name: "",
    contact: "",
    enrolledCourses: [],
    notes: "",
    status: "Active",
  });

  useEffect(() => {
    loadStudents();

    loadCourses();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getCourses();

      setCourses(Array.isArray(data) ? data : []);
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
      toast.error("Please fill all fields");

      return;
    }

    try {
      setSaving(true);

      await saveStudent(studentData);

      toast.success("Student added");

      await loadStudents();

      setStudentData({
        studentId: "",
        name: "",
        contact: "",
        enrolledCourses: [],
        notes: "",
        status: "Active",
      });
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    const result = await Swal.fire({
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

    if (!result.isConfirmed) return;

    try {
      await deleteStudent(id);

      toast.success("Student deleted");

      await loadStudents();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete student");
    }
  };

  const handleEditStudent = (student, index) => {
    setEditIndex(index);

    setEditData({
      ...student,
      enrolledCourses: student.enrolledCourses || [],
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateStudent(editData._id, editData);

      toast.success("Student updated");

      await loadStudents();

      setEditIndex(null);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update student");
    }
  };

  const searchText = search.toLowerCase();

const filteredStudents = students.filter((student) => {
  return (
    student.studentId?.toLowerCase().includes(searchText) ||
    student.name?.toLowerCase().includes(searchText) ||
    student.contact?.toLowerCase().includes(searchText) ||
    student.enrolledCourses?.some((course) =>
      course.toLowerCase().includes(searchText)
    )
  );
});

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

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Students
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-950">
                {students.length}
              </h2>
            </div>
          </div>

          {/* FORM */}

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

              {/* COURSES */}

              <Select
                isMulti
                options={courses.map((course) => ({
                  value: course.courseName,
                  label: course.courseName,
                }))}
                value={studentData.enrolledCourses.map((course) => ({
                  value: course,
                  label: course,
                }))}
                onChange={(selectedOptions) => {
                  setStudentData({
                    ...studentData,
                    enrolledCourses: selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : [],
                  });
                }}
                placeholder="Select Courses"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "48px",
                    borderRadius: "12px",
                    borderColor: "#e2e8f0",
                    backgroundColor: "#f8fafc",
                    boxShadow: "none",
                    paddingLeft: "4px",
                  }),

                  multiValue: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    backgroundColor: "#dbeafe",
                  }),

                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#1e40af",
                    fontWeight: 800,
                    fontSize: "14px",
                  }),

                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#1e40af",
                    fontWeight: 800,
                    fontSize: "14px",
                  }),

                  placeholder: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#94a3b8",
                  }),

                  input: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0f172a",
                  }),

                  singleValue: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0f172a",
                  }),
                }}
              />

              <button
                onClick={handleAddStudent}
                disabled={saving}
                className={`rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all

                ${
                  saving
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-slate-900 hover:bg-slate-800 hover:shadow-lg"
                }`}
              >
                {saving ? "Adding..." : "Add Student"}
              </button>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              placeholder="🔍 Search Student ID, Name, Contact or Course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputStyle}
            />
          </div>

          {/* TABLE */}

          {filteredStudents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                No students found.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* HEADER */}

              <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 lg:block">
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1.2fr_1.2fr_0.8fr] lg:grid-cols-[0.8fr_1fr_1fr_1.8fr_1.5fr_0.8fr] gap-4 text-sm font-semibold text-slate-500">
                  <p>Student ID</p>

                  <p>Student Name</p>

                  <p>Contact</p>

                  <p>Courses</p>

                  <p className="text-center">Actions</p>
                </div>
              </div>

              {/* ROWS */}

              <div>
                {filteredStudents.map((student, index) => (
                  <div
                    key={student._id || index}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <div className="grid gap-4 px-6 py-5 lg:grid-cols-[0.8fr_1fr_1fr_1.8fr_1.5fr_0.8fr] lg:items-center">
                      {/* ID */}

                      <p className="font-semibold text-slate-700">
                        {student.studentId}
                      </p>

                      {/* NAME */}

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
                        <p className="font-semibold text-slate-900">
                          {student.name}
                        </p>
                      )}

                      {/* CONTACT */}

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
                        <p className="text-sm font-medium text-slate-600">
                          {student.contact}
                        </p>
                      )}

                      {/* COURSES */}

                      {editIndex === index ? (
                        <Select
                          isMulti
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          options={courses.map((course) => ({
                            value: course.courseName,
                            label: course.courseName,
                          }))}
                          value={(editData.enrolledCourses || []).map(
                            (course) => ({
                              value: course,
                              label: course,
                            }),
                          )}
                          onChange={(selectedOptions) => {
                            setEditData({
                              ...editData,

                              enrolledCourses: selectedOptions
                                ? selectedOptions.map((option) => option.value)
                                : [],
                            });
                          }}
                          className="text-sm"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "48px",
                              borderRadius: "12px",
                              borderColor: "#e2e8f0",
                              backgroundColor: "#f8fafc",
                              boxShadow: "none",
                            }),

                            multiValue: (base) => ({
                              ...base,
                              borderRadius: "8px",
                              backgroundColor: "#dbeafe",
                            }),

                            multiValueLabel: (base) => ({
                              ...base,
                              color: "#1e40af",
                              fontWeight: 500,
                              fontSize: "14px",
                            }),

                            placeholder: (base) => ({
                              ...base,
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#94a3b8",
                            }),

                            input: (base) => ({
                              ...base,
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#0f172a",
                            }),

                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                      ) : (
                        <p className="text-sm text-slate-700">
                          {student.enrolledCourses?.length > 0
                            ? student.enrolledCourses.join(", ")
                            : "No Courses"}
                        </p>
                      )}

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center justify-center gap-2">
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
