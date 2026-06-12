import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      unique: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
    },

    batch: {
<<<<<<< HEAD
      type: String,
      trim: true,
      default: "",
    },
=======
  type: String,
  trim: true,
  default: "",
},
>>>>>>> 3257741c895a9bc10b466a033e922c6ee64c5302

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
