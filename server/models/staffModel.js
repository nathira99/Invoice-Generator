import mongoose from "mongoose";

const staffSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        required: true,
      },

      contact: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      joiningDate: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Active",
          "Inactive",
        ],
        default: "Active",
      },
    },
    {
      timestamps: true,
    }
  );

const Staff =
  mongoose.model(
    "Staff",
    staffSchema, 
    "staffs"
  );

export default Staff;