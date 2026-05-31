import { useState, useEffect } from "react";

import Select from "react-select";

import {
  BookOpen,
  PlusCircle,
  Pencil,
  Trash2,
  Check,
  IndianRupee,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveCourse,
  getCourses,
  deleteCourse,
  updateCourse,
} from "../utils/Storage";

function Courses() {
  const [courses, setCourses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({
    courseName: "",

    category: "",

    fee: "",

    daysPerWeek: "",
  });

  const [courseData, setCourseData] = useState({
    courseName: "",

    category: "",

    fee: "",

    daysPerWeek: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();

      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle =
    "text-slate-800 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCourse = async () => {
    
    console.log(courseData);
    if (
      !courseData.courseName ||
      !courseData.category ||
      !courseData.fee ||
      !courseData.daysPerWeek
    ) {
      toast.error("Please fill all fields.");

      return;
    }


    try {
      await saveCourse(courseData);

      await loadCourses();

      setCourseData({
        courseName: "",

        category: "",

        fee: "",

        daysPerWeek: "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to add course");
    }
  };

  const handleDeleteCourse = async (id) => {
    const result = await Swal.fire({
      title: "Delete this course?",
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
      await deleteCourse(id);

      await loadCourses();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete course");
    }
  };

  const handleEditCourse = (course, index) => {
    setEditIndex(index);

    setEditData(course);
  };

  const handleSaveEdit = async () => {
    if (
      !editData.courseName ||
      !editData.category ||
      !editData.fee ||
      !editData.daysPerWeek
    ) {
      toast.error("Please fill all fields.");

      return;
    }

    try {
      await updateCourse(editData._id, editData);

      await loadCourses();

      setEditIndex(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update course");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
                <BookOpen size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Courses
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Manage all institute courses
                </p>
              </div>
            </div>

            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Courses
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-950">
                {courses.length}
              </h2>
            </div>
          </div>

          {/* ADD FORM */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <PlusCircle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">Add Course</h2>

                <p className="text-sm text-slate-500">
                  Create a new course profile
                </p>
              </div>
            </div>

            {/* INPUTS */}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                placeholder="Course Name"
                className={inputStyle}
              />

              {/* <Select
                options={[
                  {
                    value: "Islamic",
                    label: "🕌 Islamic Courses",
                  },
                  {
                    value: "Skill Development",
                    label: "💻 Skill Development",
                  },
                  {
                    value: "Academic",
                    label: "📚 Academic Classes",
                  },
                ]}
                value={
                  courseData.category
                    ? {
                        value: courseData.category,
                        label:
                          courseData.category === "Islamic"
                            ? "🕌 Islamic Courses"
                            : courseData.category === "Skill Development"
                              ? "💻 Skill Development"
                              : "📚 Academic Classes",
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  setCourseData({
                    ...courseData,
                    category: selectedOption?.value || "",
                  });
                }}
                placeholder="Select Category"
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
                }}
              /> */}

              <div className="grid grid-cols-3 gap-3">

  <button
    type="button"
    onClick={() =>
      setCourseData({
        ...courseData,
        category: "Islamic",
      })
    }
    className={`rounded-xl p-3 border text-sm font-semibold ${
      courseData.category === "Islamic"
        ? "bg-blue-600 text-white"
        : "bg-white"
    }`}
  >
    Islamic
  </button>

  <button
    type="button"
    onClick={() =>
      setCourseData({
        ...courseData,
        category: "Skill Development",
      })
    }
    className={`rounded-xl p-3 border text-sm font-semibold ${
      courseData.category === "Skill Development"
        ? "bg-blue-600 text-white"
        : "bg-white"
    }`}
  >
    Skills
  </button>

  <button
    type="button"
    onClick={() =>
      setCourseData({
        ...courseData,
        category: "Academic",
      })
    }
    className={`rounded-xl p-3 border text-sm font-semibold ${
      courseData.category === "Academic"
        ? "bg-blue-600 text-white"
        : "bg-white"
    }`}
  >
    Academic
  </button>

</div>

              <input
                type="number"
                name="fee"
                value={courseData.fee}
                onChange={handleChange}
                placeholder="Course Fee"
                className={inputStyle}
              />

              <input
                type="number"
                name="daysPerWeek"
                value={courseData.daysPerWeek}
                onChange={handleChange}
                placeholder="Days Per Week"
                className={inputStyle}
              />

              <button
                onClick={handleAddCourse}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Add Course
              </button>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              placeholder="🔍 Search Course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputStyle}
            />
          </div>

          {/* TABLE */}

          {filteredCourses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                No courses found.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* TABLE HEADER */}

              <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 lg:block">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 text-sm font-semibold text-slate-500">
                  <p>Course</p>

                  <p>Fee</p>

                  <p>Schedule</p>

                  <p className="text-center">Actions</p>
                </div>
              </div>

              {/* ROWS */}

              <div>
                {filteredCourses.map((course, index) => (
                  <div
                    key={course._id || index}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:items-center">
                      {/* COURSE */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Course
                        </p>

                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editData.courseName}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                courseName: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <p className="mt-1 font-semibold text-slate-900">
                            {course.courseName}
                          </p>
                        )}
                      </div>

                      {/* CATEGORY */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Category
                        </p>

                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editData.category}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                category: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <p className="mt-1 font-semibold text-slate-900">
                            {course.category}
                          </p>
                        )}
                      </div>

                      {/* FEE */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Fee
                        </p>

                        {editIndex === index ? (
                          <input
                            type="number"
                            value={editData.fee}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                fee: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <div className="mt-1 flex items-center gap-2 font-semibold text-emerald-700">
                            <IndianRupee size={16} />
                            Rs. {course.fee}
                          </div>
                        )}
                      </div>

                      {/* DAYS */}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                          Schedule
                        </p>

                        {editIndex === index ? (
                          <input
                            type="number"
                            value={editData.daysPerWeek}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                daysPerWeek: e.target.value,
                              })
                            }
                            className={`${inputStyle} mt-2`}
                          />
                        ) : (
                          <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                            <CalendarDays size={16} />
                            {course.daysPerWeek} Days / Week
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-center">
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
                            onClick={() => handleEditCourse(course, index)}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCourse(course._id)}
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

export default Courses;
