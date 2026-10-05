import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: false,
       match: /^[0-9+\-\s()]{7,20}$/,
    },

    age: {
      type: Number,
    },

    place: {
      type: String,
      trim: true,
    },

enrollments: [
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    courseName: String,

    courseRegistrationNo: String,

    tutor: {
      type: String,
      trim: true,
    },

    daysPerWeek: {
      type: Number,
      min: 1,
    },

    customFee: {
      type: Number,
      min: 0,
    },
  },
],

    email: {
      type: String,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Student =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema, "students");

export default Student;