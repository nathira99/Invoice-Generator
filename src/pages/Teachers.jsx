import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
  GraduationCap,
  UserPlus,
  Pencil,
  Trash2,
  Check,
  Search,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getCourses,
  getTeachers,
  saveTeacher,
  updateTeacher,
  deleteTeacher,
} from "../utils/Storage";

function Teachers() {
  const [teachers, setTeachers] = useState([]);

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  const [teacherData, setTeacherData] = useState({
    teacherName: "",
    contact: "",
    course: "",
    joiningDate: new Date().toISOString().split("T")[0],
    status: "Active",
  });

  const [editData, setEditData] = useState({
    teacherName: "",
    contact: "",
    course: "",
    joiningDate: "",
    status: "Active",
  });

  useEffect(() => {
    loadTeachers();

    loadCourses();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);

      const data = await getTeachers();

      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);

      const data = await getCourses();

      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.teacherName?.toLowerCase().includes(search.toLowerCase()),
  );

  const inputStyle =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleAddTeacher = async () => {
    if (
      !teacherData.teacherName ||
      !teacherData.contact ||
      !teacherData.course
    ) {
      toast.error("Please fill all fields");

      return;
    }

    if (!validatePhone(teacherData.contact)) {
      toast.error("Enter valid 10 digit phone number");

      return;
    }

    const alreadyExists = teachers.some(
      (teacher) =>
        teacher.teacherName.toLowerCase() ===
        teacherData.teacherName.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("Teacher already exists");

      return;
    }

    try {
      await saveTeacher(teacherData);

      await loadTeachers();

      setTeacherData({
        teacherName: "",
        contact: "",
        course: "",
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });

      toast.success("Teacher added successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to add teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    const result = await Swal.fire({
      title: "Delete teacher?",
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
      await deleteTeacher(id);

      await loadTeachers();

      toast.success("Teacher deleted");
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete teacher");
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditId(teacher._id);

    setEditData(teacher);
  };

  const handleSaveEdit = async () => {
    if (!editData.teacherName || !editData.contact || !editData.course) {
      toast.error("Please fill all fields");

      return;
    }

    try {
      await updateTeacher(editData._id, editData);

      await loadTeachers();

      setEditId(null);

      toast.success("Teacher updated");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update teacher");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <Header />

        <div className="p-4 pt-28 lg:p-8 lg:pt-8">
          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT */}

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <GraduationCap size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Teachers
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Manage all institute teachers
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* SEARCH */}

              <div className="relative w-full sm:w-72">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="🔍 Search teacher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* TOTAL */}

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Teachers
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-950">
                  {teachers.length}
                </h2>
              </div>
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
                  Add Teacher
                </h2>

                <p className="text-sm text-slate-500">
                  Create a new teacher profile
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
              <input
                type="text"
                name="teacherName"
                value={teacherData.teacherName}
                onChange={handleChange}
                placeholder="Teacher Name"
                className={inputStyle}
              />

              <input
                type="text"
                name="contact"
                value={teacherData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className={inputStyle}
              />

              <select
                name="course"
                value={teacherData.course}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select Course</option>

                {courses.map((course, index) => (
                  <option key={index} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="joiningDate"
                value={teacherData.joiningDate}
                onChange={handleChange}
                className={inputStyle}
              />

              <button
                onClick={handleAddTeacher}
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Add Teacher
              </button>
            </div>
          </div>

          {/* TABLE */}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Loading teachers...
              </p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <GraduationCap size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No teachers found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first teacher to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* HEADER */}

              <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 lg:block">
                <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_1fr] gap-4 text-sm font-semibold text-slate-500">
                  <p>Teacher</p>

                  <p>Contact</p>

                  <p>Course</p>

                  <p>Joining Date</p>

                  <p>Status</p>

                  <p className="text-center">Actions</p>
                </div>
              </div>

              {/* ROWS */}

              <div>
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_1fr] lg:items-center">
                      {/* NAME */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Teacher
                        </p>

                        {editId === teacher._id ? (
                          <input
                            type="text"
                            value={editData.teacherName}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                teacherName: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <p className="mt-1 font-semibold text-slate-900">
                            {teacher.teacherName}
                          </p>
                        )}
                      </div>

                      {/* CONTACT */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Contact
                        </p>

                        {editId === teacher._id ? (
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
                            {teacher.contact}
                          </p>
                        )}
                      </div>

                      {/* COURSE */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Course
                        </p>

                        {editId === teacher._id ? (
                          <select
                            value={editData.course}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                course: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          >
                            {courses.map((course, index) => (
                              <option key={index} value={course.courseName}>
                                {course.courseName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {teacher.course}
                          </p>
                        )}
                      </div>

                      {/* DATE */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Joining Date
                        </p>

                        {editId === teacher._id ? (
                          <input
                            type="date"
                            value={editData.joiningDate}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                joiningDate: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {new Date(teacher.joiningDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "Asia/Kolkata",
                              },
                            )}
                          </p>
                        )}
                      </div>

                      {/* STATUS */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Status
                        </p>

                        {editId === teacher._id ? (
                          <select
                            value={editData.status}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          >
                            <option value="Active">Active</option>

                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              teacher.status === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {teacher.status}
                          </span>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-center">
                        {editId === teacher._id ? (
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <Check size={15} />
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteTeacher(teacher._id)}
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

export default Teachers;
