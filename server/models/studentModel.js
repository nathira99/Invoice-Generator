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
      required: true,
    },

    age: {
<<<<<<< HEAD
      type: Number,
    },

    place: {
      type: String,
      trim: true,
    },
=======
  type: Number,
},

place: {
  type: String,
  trim: true,
},
>>>>>>> 3257741c895a9bc10b466a033e922c6ee64c5302

    enrolledCourses: [
      {
        type: String,
        trim: true,
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

const Student = mongoose.model("Student", studentSchema, "students");

export default Student;
