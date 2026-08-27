import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      trim: true,
      default: undefined,
    },
    courseName: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: ["Islamic", "Skill Development", "Academic"],
      required: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: "",
    },

    audience: {
      type: String,
      enum: ["Kids", "Female", "Male", "Kids & Female", "All"],
      default: "All",
    },

    level: {
      type: String,
      trim: true,
      default: "",
    },

    fee: {
      type: Number,
      required: true,
    },

    daysPerWeek: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Upcoming", "Closed"],
      default: "Active",
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model("Course", courseSchema, "courses");

export default Course;
