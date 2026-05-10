import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  saveCourse,
  getCourses,
  deleteCourse,
  updateCourse,
} from "../utils/localStorage";

function Courses() {

  const [courses, setCourses] =
    useState(getCourses());

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

  const handleChange = (e) => {

    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });

  };

  const handleAddCourse = () => {

    if (
      !courseData.courseName ||
      !courseData.fee ||
      !courseData.daysPerWeek
    ) {

      alert("Please fill all fields.");

      return;

    }

    saveCourse(courseData);

    setCourses(getCourses());

    setCourseData({
      courseName: "",
      fee: "",
      daysPerWeek: "",
    });

  };

  const handleDeleteCourse = (index) => {

    const confirmDelete =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmDelete) return;

    deleteCourse(index);

    setCourses(getCourses());

  };

  const handleEditCourse = (
    course,
    index
  ) => {

    setEditIndex(index);

    setEditData(course);

  };

  const handleSaveEdit = () => {

    if (
      !editData.courseName ||
      !editData.fee ||
      !editData.daysPerWeek
    ) {

      alert("Please fill all fields.");

      return;

    }

    updateCourse(
      editIndex,
      editData
    );

    setCourses(getCourses());

    setEditIndex(null);

  };

  return (

    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 lg:flex-row">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">

        <Header />

        <div className="m-4 lg:m-8">

          <div className="w-full max-w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6">

            {/* TOP */}

            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

              <h1 className="text-2xl font-bold sm:text-3xl">
                Courses
              </h1>

            </div>

            {/* FORM */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                placeholder="Course Name"
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                type="number"
                name="fee"
                value={courseData.fee}
                onChange={handleChange}
                placeholder="Course Fee"
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                type="number"
                name="daysPerWeek"
                value={courseData.daysPerWeek}
                onChange={handleChange}
                placeholder="Days / Week"
                className="w-full rounded-xl border px-4 py-3"
              />

              <button
                onClick={handleAddCourse}
                className="rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white"
              >
                Add Course
              </button>

            </div>

            {/* TABLE */}

            {courses.length === 0 ? (

              <div className="text-gray-500">
                No courses found.
              </div>

            ) : (

              <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">

                {/* HEADER */}

                <thead>

                  <tr className="border-b text-left text-gray-500">

                    <th className="py-4">
                      Course Name
                    </th>

                    <th>
                      Fee
                    </th>

                    <th>
                      Days / Week
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                {/* BODY */}

                <tbody>

                  {courses.map((course, index) => (

                    <tr
                      key={index}
                      className="border-b"
                    >

                      {/* COURSE */}

                      <td className="py-4 pr-4">

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
                            className="w-full rounded-lg border px-3 py-2"
                          />

                        ) : (

                          course.courseName

                        )}

                      </td>

                      {/* FEE */}

                      <td className="pr-4">

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
                            className="w-full rounded-lg border px-3 py-2"
                          />

                        ) : (

                          `Rs. ${course.fee}`

                        )}

                      </td>

                      {/* DAYS */}

                      <td className="pr-4">

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
                            className="w-full rounded-lg border px-3 py-2"
                          />

                        ) : (

                          course.daysPerWeek

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="py-3">

                        <div className="flex flex-wrap gap-3">

                        {editIndex === index ? (

                          <button
                            onClick={
                              handleSaveEdit
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
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
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                          >
                            Edit
                          </button>

                        )}

                        <button
                          onClick={() =>
                            handleDeleteCourse(
                              index
                            )
                          }
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
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
