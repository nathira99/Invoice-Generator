import Teacher from "../models/teacherModel.js";

/* GET TEACHERS */

export const getTeachers =
  async (req, res) => {

    try {

      const teachers =
        await Teacher.find()
          .sort({
            createdAt: -1,
          });

      res.json(teachers);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* CREATE TEACHER */

export const createTeacher =
  async (req, res) => {

    try {

      const teacher =
        await Teacher.create(
          req.body
        );

      res.status(201).json(
        teacher
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* UPDATE TEACHER */

export const updateTeacher =
  async (req, res) => {

    try {

      const updatedTeacher =
        await Teacher.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        updatedTeacher
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* DELETE TEACHER */

export const deleteTeacher =
  async (req, res) => {

    try {

      await Teacher.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Teacher deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };