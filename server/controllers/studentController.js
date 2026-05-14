import Student from "../models/studentModel.js";

/* GET */

export const getStudents =
  async (req, res) => {

    try {

      const students =
        await Student.find()
          .sort({
            createdAt: -1,
          });

      res.json(students);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* CREATE */

export const createStudent =
  async (req, res) => {

    try {

      const student =
        await Student.create(
          req.body
        );

      res.status(201).json(
        student
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* UPDATE */

export const updateStudent =
  async (req, res) => {

    try {

      const updatedStudent =
        await Student.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        updatedStudent
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* DELETE */

export const deleteStudent =
  async (req, res) => {

    try {

      await Student.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Student deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };