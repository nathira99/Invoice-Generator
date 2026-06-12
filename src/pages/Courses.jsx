import { useState, useEffect } from "react";

import Select from "react-select";

import {
  BookOpen,
  PlusCircle,
  Pencil,
  Users,
  Search,
  Trash,
  Check,
  Copy,
  IndianRupee,
  CalendarDays,
  Clock,
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

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  const [expandedSections, setExpandedSections] = useState({
    Islamic: false,
    Skills: false,
    Academic: false,
  });


  const [courseData, setCourseData] = useState({
    courseName: "",

    category: "",

    fee: "",

    daysPerWeek: "",

    status: "",

    duration: "",
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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCourse = async () => {
    if (
      !courseData.courseName ||
      !courseData.category ||
      !courseData.fee ||
      !courseData.daysPerWeek ||
      !courseData.status ||
      !courseData.duration
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

        status: "",

        duration: "",
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

  const handleDuplicateCourse = async (course) => {
    const duplicateData = {
      courseName: `${course.courseName} Copy`,
      category: course.category,
      fee: course.fee,
      daysPerWeek: course.daysPerWeek,
      status: course.status,
      duration: course.duration,
    };

    await saveCourse(duplicateData);

    await loadCourses();

    toast.success("Course duplicated");
  };

  const handleUpdateCourse = async () => {
    try {
      await updateCourse(editId, courseData);

      toast.success("Course updated");

      await loadCourses();

      setEditId(null);

      setCourseData({
        courseName: "",
        category: "",
        fee: "",
        daysPerWeek: "",
        duration: "",
        status: "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to update course");
    }
  };

const filteredCourses = courses.filter((course) => {
  const searchText = search.toLowerCase();

  return (
    course.courseName?.toLowerCase().includes(searchText) ||
    course.category?.toLowerCase().includes(searchText) ||
    course.status?.toLowerCase().includes(searchText) ||
    course.duration?.toLowerCase().includes(searchText) ||
    String(course.fee || "").includes(searchText)
  );
});

  const islamicCourses = filteredCourses.filter(
    (course) => course.category === "Islamic",
  );

  const skillCourses = filteredCourses.filter(
    (course) => course.category === "Skill Development",
  );

  const academicCourses = filteredCourses.filter(
    (course) => course.category === "Academic",
  );

  const CourseSection = ({ title, icon, sectionKey, data }) => {
    const visibleCourses = expandedSections[sectionKey]
      ? data
      : data.slice(0, 3);

    if (data.length === 0) return null;

    return (
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">{title}</h2>

          {data.length > 2 && (
            <button
              onClick={() =>
                setExpandedSections({
                  ...expandedSections,
                  [sectionKey]: !expandedSections[sectionKey],
                })
              }
              className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
            >
              {expandedSections[sectionKey]
                ? "Show Less"
                : `View All (${data.length})`}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full table-fixed">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-center">Fee</th>
                <th className="px-4 py-3 text-center">Schedule</th>
                <th className="px-4 py-3 text-center">Duration</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleCourses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b border-slate-100 last:border-none hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {course.courseName}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2 font-semibold text-emerald-700">
                      <IndianRupee size={16} />
                      Rs. {course.fee}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center ">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap text-sm text-slate-600">
                      <CalendarDays size={16} />
                      {course.daysPerWeek} days/week
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap text-sm text-slate-600">
                      <Clock size={16} />
                      {course.duration}
                    </div>
                  </td>

                  <td className="px-4 py-3  text-center ">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : course.status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditId(course._id);

                          setCourseData({
                            courseName: course.courseName || "",
                            category: course.category || "",
                            fee: course.fee || "",
                            daysPerWeek: course.daysPerWeek || "",
                            duration: course.duration || "",
                            status: course.status || "",
                          });

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="w-min flex items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="w-min flex items-center rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "52px",
      borderRadius: "16px",
      borderColor: "#e2e8f0",
      backgroundColor: "#f8fafc",
      boxShadow: "none",
      paddingLeft: "4px",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
      fontSize: "14px",
      fontWeight: 500,
    }),

    singleValue: (base) => ({
      ...base,
      color: "#0f172a",
      fontSize: "14px",
      fontWeight: 600,
    }),

    menu: (base) => ({
      ...base,
      borderRadius: "16px",
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
                             placeholder="Search course..."
                             value={search}
                             onChange={(e) => setSearch(e.target.value)}
                             className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                           />
                         </div>
           
                         {/* TOTAL */}
           
                         <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                           <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                             Total Courses
                           </p>
           
                           <h2 className="mt-1 text-3xl font-bold text-slate-950">
                             {filteredCourses.length}
                           </h2>
                         </div>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                placeholder="Course Name"
                className={inputStyle}
              />

              <Select
                options={[
                  {
                    value: "Islamic",
                    label: "Islamic Courses",
                  },
                  {
                    value: "Skill Development",
                    label: "Skill Development",
                  },
                  {
                    value: "Academic",
                    label: "Academic Classes",
                  },
                ]}
                value={
                  courseData.category
                    ? {
                        value: courseData.category,
                        label:
                          courseData.category === "Islamic"
                            ? "Islamic Courses"
                            : courseData.category === "Skill Development"
                              ? "Skill Development"
                              : "Academic Classes",
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
                styles={selectStyles}
              />

              <Select
                options={[
                  {
                    value: "Active",
                    label: "Active",
                  },
                  {
                    value: "Upcoming",
                    label: "Upcoming",
                  },
                  {
                    value: "Closed",
                    label: "Closed",
                  },
                ]}
                value={
                  courseData.status
                    ? {
                        value: courseData.status,
                        label:
                          courseData.status === "Active"
                            ? "Active"
                            : courseData.status === "Upcoming"
                              ? "Upcoming"
                              : "Closed",
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  setCourseData({
                    ...courseData,
                    status: selectedOption?.value || "",
                  });
                }}
                placeholder="Select Status"
                className="text-sm "
                styles={selectStyles}
              />

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
                placeholder="Duration in Days per Week"
                className={inputStyle}
              />

              <input
                type="text"
                name="duration"
                value={courseData.duration}
                onChange={handleChange}
                placeholder="Ex: 3 Months, 1 Year, Flexible"
                className={inputStyle}
              />

              <button
                onClick={editId ? handleUpdateCourse : handleAddCourse}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                {editId ? "Update Course" : "Add Course"}
              </button>

              {editId && (
                <button
                  onClick={() => {
                    setEditId(null);

                    setCourseData({
                      courseName: "",
                      category: "",
                      fee: "",
                      daysPerWeek: "",
                    });
                  }}
                  className="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}

          <CourseSection
            title="Islamic Courses"
            icon="🕌"
            data={islamicCourses}
            sectionKey="Islamic"
          />

          <CourseSection
            title="Skill Development"
            icon="💻"
            data={skillCourses}
            sectionKey="Skills"
          />

          <CourseSection
            title="Academic Classes"
            icon="📚"
            data={academicCourses}
            sectionKey="Academic"
          />
        </div>
      </main>
    </div>
  );
}

export default Courses;
