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

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        <Header />

        <div className="p-8">

          <div className="bg-white rounded-2xl shadow-sm p-6">

            {/* TOP */}

            <div className="flex justify-between items-center mb-8">

              <h1 className="text-3xl font-bold">
                Courses
              </h1>

            </div>

            {/* FORM */}

            <div className="grid grid-cols-4 gap-4 mb-8">

              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                placeholder="Course Name"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                name="fee"
                value={courseData.fee}
                onChange={handleChange}
                placeholder="Course Fee"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                name="daysPerWeek"
                value={courseData.daysPerWeek}
                onChange={handleChange}
                placeholder="Days / Week"
                className="border rounded-xl px-4 py-3"
              />

              <button
                onClick={handleAddCourse}
                className="bg-blue-900 text-white rounded-xl px-5 py-3"
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

              <table className="w-full">

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

                      <td className="py-4">

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
                            className="border rounded-lg px-3 py-2"
                          />

                        ) : (

                          course.courseName

                        )}

                      </td>

                      {/* FEE */}

                      <td>

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
                            className="border rounded-lg px-3 py-2"
                          />

                        ) : (

                          `Rs. ${course.fee}`

                        )}

                      </td>

                      {/* DAYS */}

                      <td>

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
                            className="border rounded-lg px-3 py-2"
                          />

                        ) : (

                          course.daysPerWeek

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="py-3 flex gap-3">

                        {editIndex === index ? (

                          <button
                            onClick={
                              handleSaveEdit
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
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
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </main>

    </div>

  );

}

export default Courses;