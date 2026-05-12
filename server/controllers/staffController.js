import Staff from "../models/staffModel.js";

/* GET */

export const getStaffs =
  async (req, res) => {

    try {

      const staffs =
        await Staff.find()
          .sort({
            createdAt: -1,
          });

      res.json(staffs);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

/* CREATE */

export const createStaff =
  async (req, res) => {

    try {

      const staff =
        await Staff.create(
          req.body
        );

      res.status(201).json(
        staff
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* UPDATE */

export const updateStaff =
  async (req, res) => {

    try {

      const updatedStaff =
        await Staff.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        updatedStaff
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message,
      });

    }

  };

/* DELETE */

export const deleteStaff =
  async (req, res) => {

    try {

      await Staff.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Staff deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };