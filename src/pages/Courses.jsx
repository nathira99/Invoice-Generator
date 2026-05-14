import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveCourse,
  getCourses,
  deleteCourse,
  updateCourse,
} from "../utils/Storage";

function Courses() {

  const [courses, setCourses] =
  useState([]);
  

  const [editIndex, setEditIndex] =
    useState(null);

  const [editData, setEditData] =
    useState({
      courseName: "",
      fee: "",
      daysPerWeek: "",
    });

  const [courseData, setCourseData] =
    useState({
      courseName: "",
      fee: "",
      daysPerWeek: "",
    });
    
    useEffect(() => {

  loadCourses();

}, []);

const loadCourses =
  async () => {

    try {

      const data =
        await getCourses();

      setCourses(data);

    } catch (error) {

      console.error(error);

    }

  };

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

    
  const handleChange = (e) => {

    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });

  };

  const handleAddCourse =
  async () => {

    if (
      !courseData.courseName ||
      !courseData.fee ||
      !courseData.daysPerWeek
    ) {

      alert(
        "Please fill all fields."
      );

      return;

    }

    try {

      await saveCourse(
        courseData
      );

      await loadCourses();

      setCourseData({
        courseName: "",
        fee: "",
        daysPerWeek: "",
      });

    } catch (error) {

      console.error(error);

      alert(
        "Failed to add course"
      );

    }

  };

  const handleDeleteCourse =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmDelete)
      return;

    try {

      await deleteCourse(id);

      await loadCourses();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete course"
      );

    }

  };

  const handleEditCourse = (
    course,
    index
  ) => {

    setEditIndex(index);

    setEditData(course);

  };

  const handleSaveEdit =
  async () => {

    if (
      !editData.courseName ||
      !editData.fee ||
      !editData.daysPerWeek
    ) {

      alert(
        "Please fill all fields."
      );

      return;

    }

    try {

      await updateCourse(
        editData._id,
        editData
      );

      await loadCourses();

      setEditIndex(null);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update course"
      );

    }

  };


  return (

    <div className="min-h-screen bg-gray-100 lg:flex">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        <Header />

        <div className="p-4 lg:p-8">

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">

            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Courses
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage all course details
                </p>

              </div>

              <div className="rounded-2xl bg-blue-50 px-5 py-4">

                <p className="text-sm text-blue-600">
                  Total Courses
                </p>

                <h2 className="mt-1 text-2xl font-bold text-blue-900">
                  {courses.length}
                </h2>

              </div>

            </div>

            {/* FORM */}

            <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-4">

              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                placeholder="Course Name"
                className={inputStyle}
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
                placeholder="Days / Week"
                className={inputStyle}
              />

              <button
                onClick={handleAddCourse}
                className="rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-lg"
              >
                Add Course
              </button>

            </div>

            {/* TABLE */}

            {courses.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center text-gray-500">
                No courses found.
              </div>

            ) : (

              <div className="overflow-x-auto rounded-2xl border border-gray-100">

                <table className="w-full min-w-[850px]">

                  {/* HEADER */}

                  <thead className="bg-gray-50">

                    <tr className="text-left text-sm font-semibold text-gray-600">

                      <th className="px-6 py-5">
                        Course Name
                      </th>

                      <th className="px-6 py-5">
                        Fee
                      </th>

                      <th className="px-6 py-5">
                        Days / Week
                      </th>

                      <th className="px-6 py-5 text-center">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  {/* BODY */}

                  <tbody>

                    {courses.map((course, index) => (

                      <tr
                        key={index}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >

                        {/* COURSE */}

                        <td className="px-6 py-5">

                          {editIndex === index ? (

                            <input
                              type="text"
                              value={editData.courseName}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  courseName:
                                    e.target.value,
                                })
                              }
                              className={inputStyle}
                            />

                          ) : (

                            <div>

                              <p className="font-medium text-gray-900">
                                {course.courseName}
                              </p>

                            </div>

                          )}

                        </td>

                        {/* FEE */}

                        <td className="px-6 py-5 text-gray-700">

                          {editIndex === index ? (

                            <input
                              type="number"
                              value={editData.fee}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  fee:
                                    e.target.value,
                                })
                              }
                              className={inputStyle}
                            />

                          ) : (

                            <span className="font-medium text-gray-900">
                              Rs. {course.fee}
                            </span>

                          )}

                        </td>

                        {/* DAYS */}

                        <td className="px-6 py-5 text-gray-700">

                          {editIndex === index ? (

                            <input
                              type="number"
                              value={
                                editData.daysPerWeek
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  daysPerWeek:
                                    e.target.value,
                                })
                              }
                              className={inputStyle}
                            />

                          ) : (

                            `${course.daysPerWeek} Days`

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-center gap-3">

                            {editIndex === index ? (

                              <button
                                onClick={
                                  handleSaveEdit
                                }
                                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                              >
                                Save
                              </button>

                            ) : (

                              <button
                                onClick={() =>
                                  handleEditCourse(
                                    course,
                                    index
                                  )
                                }
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                              >
                                Edit
                              </button>

                            )}

                            <button
                              onClick={() =>
                                handleDeleteCourse(
                                  course._id
                                )
                              }
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

export default Courses;