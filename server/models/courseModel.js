import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Islamic", "Skill Development", "Academic"],
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
  },
);

const Course = mongoose.model("Course", courseSchema, "courses");

export default Course;
