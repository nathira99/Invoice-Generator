import {
  useState,
  useEffect,
} from "react";

import {
  GraduationCap,
  UserPlus,
  Pencil,
  Trash2,
  Check,
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

  const [teachers, setTeachers] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [
    teacherData,
    setTeacherData,
  ] = useState({

    teacherName: "",

    contact: "",

    course: "",

    joiningDate:
      new Date()
        .toISOString()
        .split("T")[0],

    status: "Active",

  });

  const [
    editIndex,
    setEditIndex,
  ] = useState(null);

  const [
    editData,
    setEditData,
  ] = useState({

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

  const loadTeachers =
    async () => {

      try {

        const data =
          await getTeachers();

        setTeachers(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          error
        );

      }

    };

  const loadCourses =
    async () => {

      try {

        const data =
          await getCourses();

        setCourses(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          error
        );

      }

    };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange =
    (e) => {

      setTeacherData({
        ...teacherData,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleAddTeacher =
    async () => {

      if (
        !teacherData.teacherName ||
        !teacherData.contact ||
        !teacherData.course
      ) {

        alert(
          "Please fill all fields."
        );

        return;

      }

      try {

        await saveTeacher(
          teacherData
        );

        await loadTeachers();

        setTeacherData({

          teacherName: "",

          contact: "",

          course: "",

          joiningDate:
            new Date()
              .toISOString()
              .split("T")[0],

          status: "Active",

        });

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to add teacher"
        );

      }

    };

  const handleDeleteTeacher =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this teacher?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteTeacher(
          id
        );

        await loadTeachers();

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to delete teacher"
        );

      }

    };

  const handleEditTeacher =
    (
      teacher,
      index
    ) => {

      setEditIndex(index);

      setEditData(teacher);

    };

  const handleSaveEdit =
    async () => {

      try {

        await updateTeacher(
          editData._id,
          editData
        );

        await loadTeachers();

        setEditIndex(null);

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to update teacher"
        );

      }

    };

  return (

    <div className="min-h-screen bg-slate-50 lg:flex">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">

        <Header />

        <div className="p-4 lg:p-8">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">

                <GraduationCap
                  size={28}
                />

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

          {/* FORM */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">

                <UserPlus
                  size={22}
                />

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
                value={
                  teacherData.teacherName
                }
                onChange={
                  handleChange
                }
                placeholder="Teacher Name"
                className={
                  inputStyle
                }
              />

              <input
                type="text"
                name="contact"
                value={
                  teacherData.contact
                }
                onChange={
                  handleChange
                }
                placeholder="Contact Number"
                className={
                  inputStyle
                }
              />

              <select
                name="course"
                value={
                  teacherData.course
                }
                onChange={
                  handleChange
                }
                className={
                  inputStyle
                }
              >

                <option value="">
                  Select Course
                </option>

                {courses.map(
                  (
                    course,
                    index
                  ) => (

                    <option
                      key={index}
                      value={
                        course.courseName
                      }
                    >

                      {
                        course.courseName
                      }

                    </option>

                  )
                )}

              </select>

              <input
                type="date"
                name="joiningDate"
                value={
                  teacherData.joiningDate
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
                  handleAddTeacher
                }
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Add Teacher
              </button>

            </div>

          </div>

          {/* TABLE */}

          {teachers.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">

              <p className="text-sm font-medium text-slate-500">
                No teachers found.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* TABLE HEADER */}

              <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 lg:block">

                <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_1fr] gap-4 text-sm font-semibold text-slate-500">

                  <p>
                    Teacher
                  </p>

                  <p>
                    Contact
                  </p>

                  <p>
                    Course
                  </p>

                  <p>
                    Joining Date
                  </p>

                  <p>
                    Status
                  </p>

                  <p className="text-center">
                    Actions
                  </p>

                </div>

              </div>

              {/* ROWS */}

              <div>

                {teachers.map(
                  (
                    teacher,
                    index
                  ) => (

                    <div
                      key={
                        teacher._id ||
                        index
                      }
                      className="border-b border-slate-100 last:border-none"
                    >

                      <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_1fr] lg:items-center">

                        {/* NAME */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Teacher
                          </p>

                          {editIndex ===
                          index ? (

                            <input
                              type="text"
                              value={
                                editData.teacherName
                              }
                              onChange={(
                                e
                              ) =>
                                setEditData({
                                  ...editData,
                                  teacherName:
                                    e
                                      .target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            />

                          ) : (

                            <p className="mt-1 font-semibold text-slate-900">
                              {
                                teacher.teacherName
                              }
                            </p>

                          )}

                        </div>

                        {/* CONTACT */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Contact
                          </p>

                          {editIndex ===
                          index ? (

                            <input
                              type="text"
                              value={
                                editData.contact
                              }
                              onChange={(
                                e
                              ) =>
                                setEditData({
                                  ...editData,
                                  contact:
                                    e
                                      .target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            />

                          ) : (

                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {
                                teacher.contact
                              }
                            </p>

                          )}

                        </div>

                        {/* COURSE */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Course
                          </p>

                          {editIndex ===
                          index ? (

                            <select
                              value={
                                editData.course
                              }
                              onChange={(
                                e
                              ) =>
                                setEditData({
                                  ...editData,
                                  course:
                                    e
                                      .target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            >

                              {courses.map(
                                (
                                  course,
                                  i
                                ) => (

                                  <option
                                    key={i}
                                    value={
                                      course.courseName
                                    }
                                  >

                                    {
                                      course.courseName
                                    }

                                  </option>

                                )
                              )}

                            </select>

                          ) : (

                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {
                                teacher.course
                              }
                            </p>

                          )}

                        </div>

                        {/* DATE */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Joining Date
                          </p>

                          {editIndex ===
                          index ? (

                            <input
                              type="date"
                              value={
                                editData.joiningDate
                              }
                              onChange={(
                                e
                              ) =>
                                setEditData({
                                  ...editData,
                                  joiningDate:
                                    e
                                      .target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
                            />

                          ) : (

                            <p className="mt-1 text-sm font-medium text-slate-600">

                              {new Date(
                                teacher.joiningDate
                              ).toLocaleDateString(
                                "en-GB"
                              )}

                            </p>

                          )}

                        </div>

                        {/* STATUS */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Status
                          </p>

                          {editIndex ===
                          index ? (

                            <select
                              value={
                                editData.status
                              }
                              onChange={(
                                e
                              ) =>
                                setEditData({
                                  ...editData,
                                  status:
                                    e
                                      .target
                                      .value,
                                })
                              }
                              className={`${inputStyle} mt-2`}
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
                              className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold

                              ${
                                teacher.status ===
                                "Active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >

                              {
                                teacher.status
                              }

                            </span>

                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-center">

                          {editIndex ===
                          index ? (

                            <button
                              onClick={
                                handleSaveEdit
                              }
                              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >

                              <Check
                                size={15}
                              />

                              Save

                            </button>

                          ) : (

                            <button
                              onClick={() =>
                                handleEditTeacher(
                                  teacher,
                                  index
                                )
                              }
                              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >

                              <Pencil
                                size={15}
                              />

                              Edit

                            </button>

                          )}

                          <button
                            onClick={() =>
                              handleDeleteTeacher(
                                teacher._id
                              )
                            }
                            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                          >

                            <Trash2
                              size={15}
                            />

                            Delete

                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      </main>

    </div>

  );

}

export default Teachers;