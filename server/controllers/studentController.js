import Student from "../models/studentModel.js";

/* GET STUDENTS */

export const getStudents =
  async (req, res) => {

    try {

      const students =
        await Student.find().sort({
          createdAt: -1,
        });

      res.json(students);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch students",
      });

    }

  };

/* CREATE STUDENT */

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

      /* DUPLICATE KEY */

      if (
        error.code === 11000
      ) {

        return res.status(400).json({
          message:
            "Student ID already exists",
        });

      }

      res.status(500).json({
        message:
          "Failed to create student",
      });

    }

  };

/* UPDATE STUDENT */

export const updateStudent =
  async (req, res) => {

    try {

      const student =
        await Student.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!student) {

        return res.status(404).json({
          message:
            "Student not found",
        });

      }

      res.json(student);

    } catch (error) {

      if (
        error.code === 11000
      ) {

        return res.status(400).json({
          message:
            "Student ID already exists",
        });

      }

      res.status(500).json({
        message:
          "Failed to update student",
      });

    }

  };

/* DELETE STUDENT */

export const deleteStudent =
  async (req, res) => {

    try {

      const student =
        await Student.findByIdAndDelete(
          req.params.id
        );

      if (!student) {

        return res.status(404).json({
          message:
            "Student not found",
        });

      }

      res.json({
        message:
          "Student deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to delete student",
      });

    }

  };