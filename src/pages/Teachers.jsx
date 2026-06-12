import { useState, useEffect } from "react";
import Select from "react-select";
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
      const year = new Date().getFullYear();

      const employeeId = `TCH-${year}-${String(teachers.length + 1).padStart(
        3,
        "0",
      )}`;
      const teacherPayload = {
        employeeId,
        ...teacherData,
      };

      await saveTeacher(teacherPayload);

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

    setTeacherData({
      teacherName: teacher.teacherName || "",
      contact: teacher.contact || "",
      course: teacher.course || "",
      joiningDate: teacher.joiningDate ? teacher.joiningDate.split("T")[0] : "",
      status: teacher.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateTeacher(editId, teacherData);

      await loadTeachers();

      setEditId(null);

      setTeacherData({
        teacherName: "",
        contact: "",
        course: "",
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });

      toast.success("Teacher updated successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update teacher");
    }
  };

  const courseOptions = courses.map((course) => ({
    value: course.courseName,
    label: course.courseName,
  }));

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Break", label: "Break" },
    { value: "Inactive", label: "Inactive" },
  ];

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

              <div className="relative w-full xs:w-72">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search teacher..."
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

              <Select
                options={courseOptions}
                value={
                  teacherData.course
                    ? {
                        value: teacherData.course,
                        label: teacherData.course,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setTeacherData({
                    ...teacherData,
                    course: selectedOption?.value || "",
                  })
                }
                placeholder="Select Course"
                isSearchable
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

                  placeholder: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#94a3b8",
                  }),

                  singleValue: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }),

                  menu: (base) => ({
                    ...base,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }),

                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#0f172a"
                      : state.isFocused
                        ? "#f1f5f9"
                        : "#fff",
                    color: state.isSelected ? "#fff" : "#0f172a",
                    cursor: "pointer",
                  }),
                }}
              />

              <input
                type="date"
                name="joiningDate"
                value={teacherData.joiningDate}
                onChange={handleChange}
                className={inputStyle}
              />

              <Select
                options={statusOptions}
                value={
                  teacherData.status
                    ? {
                        value: teacherData.status,
                        label: teacherData.status,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setTeacherData({
                    ...teacherData,
                    status: selectedOption?.value || "",
                  })
                }
                placeholder="Select Status"
                isSearchable
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

                  placeholder: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#94a3b8",
                  }),

                  singleValue: (base) => ({
                    ...base,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }),

                  menu: (base) => ({
                    ...base,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }),

                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#0f172a"
                      : state.isFocused
                        ? "#f1f5f9"
                        : "#fff",
                    color: state.isSelected ? "#fff" : "#0f172a",
                    cursor: "pointer",
                  }),
                }}
              />

              <button
                onClick={editId ? handleSaveEdit : handleAddTeacher}
                className={`rounded-xl px-6 py-3 text-sm font-semibold text-white ${
                  editId
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-900"
                }`}
              >
                {editId ? "Update Teacher" : "Add Teacher"}
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

              <div>
                <h2>{editId ? "Edit Teacher" : "Add Teacher"}</h2>

                <p>
                  {editId
                    ? "Update teacher information"
                    : "Create a new teacher profile"}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[1100px] w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Teacher</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Course</th>
                    <th className="px-4 py-3 text-left">Joining Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      {/* ID */}
                      <td className="px-4 py-4">{teacher.employeeId}</td>

                      {/* TEACHER */}

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">
                          {teacher.teacherName}
                        </p>
                      </td>

                      {/* CONTACT */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-600">
                          {teacher.contact}
                        </p>
                      </td>

                      {/* COURSE */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">
                          {teacher.course}
                        </p>
                      </td>

                      {/* DATE */}
                      <td className="px-4 py-4">
                        {new Date(teacher.joiningDate).toLocaleDateString(
                          "en-IN",
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3  text-center ">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        teacher.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : teacher.status === "Break"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => handleDeleteTeacher(teacher._id)}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                          >
                            <Trash2 size={15} />
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
      </main>
    </div>
  );
}

export default Teachers;
