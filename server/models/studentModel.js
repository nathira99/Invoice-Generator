import mongoose from "mongoose";

const studentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      contact: {
        type: String,
        required: true,
      },

      email: {
        type: String,
      },

      joiningDate: {
        type: Date,
        default: Date.now,
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

const Student =
  mongoose.model(
    "Student",
    studentSchema,
    "students"
  );

export default Student;