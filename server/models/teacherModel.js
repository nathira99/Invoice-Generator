import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teacherName: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

const Teacher = mongoose.model("Teacher", teacherSchema, "teachers");

export default Teacher;
