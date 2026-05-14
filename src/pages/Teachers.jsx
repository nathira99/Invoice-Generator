import { useState, useEffect } from "react";
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

  const [teacherData, setTeacherData] = useState({
    teacherName: "",
    contact: "",
    course: "",
    joiningDate: new Date().toISOString().split("T")[0],
    status: "Active",
  });

  const [editIndex, setEditIndex] = useState(null);

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
      const data = await getTeachers();

      setTeachers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getCourses();

      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTeacher = async () => {
    if (
      !teacherData.teacherName ||
      !teacherData.contact ||
      !teacherData.course
    ) {
      alert("Please fill all fields.");

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
    } catch (error) {
      console.error(error);

      alert("Failed to add teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    const confirmDelete = window.confirm("Delete this teacher?");

    if (!confirmDelete) return;

    try {
      await deleteTeacher(id);

      await loadTeachers();
    } catch (error) {
      console.error(error);

      alert("Failed to delete teacher");
    }
  };
  const handleEditTeacher = (teacher, index) => {
    setEditIndex(index);

    setEditData(teacher);
  };

  const handleSaveEdit = async () => {
    try {
      await updateTeacher(editData._id, editData);

      await loadTeachers();

      setEditIndex(null);
    } catch (error) {
      console.error(error);

      alert("Failed to update teacher");
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>

                <p className="mt-2 text-gray-500">Manage all teacher details</p>
              </div>

              <div className="rounded-2xl bg-blue-50 px-5 py-4">
                <p className="text-sm text-blue-600">Total Teachers</p>

                <h2 className="mt-1 text-2xl font-bold text-blue-900">
                  {teachers.length}
                </h2>
              </div>
            </div>

            {/* FORM */}

            <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-5">
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
                className="rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-lg"
              >
                Add Teacher
              </button>
            </div>

            {/* TABLE */}

            {teachers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-gray-500">
                No teachers found.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[1000px]">
                  {/* HEADER */}

                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm font-semibold text-gray-600">
                      <th className="px-6 py-5">Teacher Name</th>

                      <th className="px-6 py-5">Contact</th>

                      <th className="px-6 py-5">Course</th>

                      <th className="px-6 py-5">Joining Date</th>

                      <th className="px-6 py-5">Status</th>

                      <th className="px-6 py-5 text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* BODY */}

                  <tbody>
                    {teachers.map((teacher, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* NAME */}

                        <td className="px-6 py-5">
                          {editIndex === index ? (
                            <input
                              type="text"
                              value={editData.teacherName}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  teacherName: e.target.value,
                                })
                              }
                              className={inputStyle}
                            />
                          ) : (
                            <p className="font-medium text-gray-900">
                              {teacher.teacherName}
                            </p>
                          )}
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-5 text-gray-700">
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
                            teacher.contact
                          )}
                        </td>

                        {/* COURSE */}

                        <td className="px-6 py-5 text-gray-700">
                          {editIndex === index ? (
                            <select
                              value={editData.course}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  course: e.target.value,
                                })
                              }
                              className={inputStyle}
                            >
                              {courses.map((course, i) => (
                                <option key={i} value={course.courseName}>
                                  {course.courseName}
                                </option>
                              ))}
                            </select>
                          ) : (
                            teacher.course
                          )}
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5 text-gray-700">
                          {editIndex === index ? (
                            <input
                              type="date"
                              value={editData.joiningDate}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  joiningDate: e.target.value,
                                })
                              }
                              className={inputStyle}
                            />
                          ) : (
                            new Date(teacher.joiningDate).toLocaleDateString(
                              "en-GB",
                            )
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">
                          {editIndex === index ? (
                            <select
                              value={editData.status}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  status: e.target.value,
                                })
                              }
                              className={inputStyle}
                            >
                              <option value="Active">Active</option>

                              <option value="Inactive">Inactive</option>
                            </select>
                          ) : (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                teacher.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {teacher.status}
                            </span>
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
                                  handleEditTeacher(teacher, index)
                                }
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTeacher(teacher._id)}
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

export default Teachers;
