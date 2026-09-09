import Course from "../models/courseModel.js";
import {
  syncCourseToSheet,
  syncAllCoursesToSheet,
  deleteCourseFromSheet,
} from "../services/courseSheetSync.js";

/* GET COURSES */

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* CREATE COURSE */

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    /* SYNC NEW COURSE TO GOOGLE SHEETS */

    try {
      await syncCourseToSheet(course);
    } catch (syncError) {
      console.error(
        "Google Sheets course sync failed:",
        syncError.message
      );
    }

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/* UPDATE COURSE */

export const updateCourse = async (req, res) => {
  try {
    const updatedCourse =
      await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    /* SYNC UPDATED COURSE TO GOOGLE SHEETS */

    try {
      await syncCourseToSheet(updatedCourse);
    } catch (syncError) {
      console.error(
        "Google Sheets course sync failed:",
        syncError.message
      );
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// DUPLICATE COURSE

export const duplicateCourse = async (req, res) => {
  try {
    const duplicatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json(duplicatedCourse);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/* SYNC ALL COURSES TO GOOGLE SHEETS */

export const syncAllCourses = async (req, res) => {
  try {
    const count = await syncAllCoursesToSheet();

    res.json({
      success: true,
      message: "All courses synced successfully",
      count,
    });
  } catch (error) {
    console.error(
      "All courses sync error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to sync all courses",
      error: error.message,
    });
  }
};

/* DELETE COURSE */

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    /* DELETE FROM GOOGLE SHEETS FIRST */

    try {
      await deleteCourseFromSheet(
        course._id
      );
    } catch (syncError) {
      console.error(
        "Google Sheets course delete failed:",
        syncError.message
      );
    }

    /* DELETE FROM MONGODB */

    await Course.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Course deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
