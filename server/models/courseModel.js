import mongoose from "mongoose";

const courseSchema =
  new mongoose.Schema(
    {
      courseName: {
        type: String,
        required: true,
      },

      fee: {
        type: Number,
        required: true,
      },

      daysPerWeek: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Course =
  mongoose.model(
    "Course",
    courseSchema,
    "courses"
  );

export default Course;