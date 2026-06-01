import Course from "../models/courseModel.js";

/* GET COURSES */

export const getCourses =
  async (req, res) => {

    try {

      const courses =
        await Course.find()
          .sort({
            createdAt: -1,
          });

      res.json(courses);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* CREATE COURSE */

export const createCourse =
  async (req, res) => {

    try {

      const course =
        await Course.create(
          req.body
        );

      res.status(201).json(
        course
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* UPDATE COURSE */

export const updateCourse =
  async (req, res) => {

    try {

      const updatedCourse =
        await Course.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        updatedCourse
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

  // DUPLICATE COURSE

  export const duplicateCourse =
    async (req, res) => {
      try {

      const duplicatedCourse =
        await Course.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        duplicatedCourse
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

    }

/* DELETE COURSE */

export const deleteCourse =
  async (req, res) => {

    try {

      await Course.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Course deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };