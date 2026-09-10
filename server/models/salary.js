import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    salaryNumber: {
      type: String,
      required: [true, "Salary number is required"],
      unique: true,
      trim: true,
    },

    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Employee name must be at least 2 characters"],
      maxlength: [100, "Employee name cannot exceed 100 characters"],
    },

    employeeType: {
      type: String,
      required: [true, "Employee type is required"],
      enum: ["Teacher", "Staff"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },

    salaryMonth: {
      type: String,
      required: [true, "Salary month is required"],
      trim: true,
      maxlength: [30, "Salary month cannot exceed 30 characters"],
    },

    salaryDate: {
      type: Date,
      required: [true, "Salary date is required"],
      default: Date.now,
    },

    basicSalary: {
      type: Number,
      required: [true, "Basic salary is required"],
      min: [0, "Basic salary cannot be negative"],
    },

    bonus: {
      type: Number,
      default: 0,
      min: [0, "Bonus cannot be negative"],
    },

    deduction: {
      type: Number,
      default: 0,
      min: [0, "Deduction cannot be negative"],
    },

    netSalary: {
      type: Number,
      required: [true, "Net salary is required"],
      min: [0, "Net salary cannot be negative"],
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "UPI", "Other"],
      default: "Cash",
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Paid", "Pending"],
        message: "Status must be Paid or Pending.",
      },
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Salary =
  mongoose.models.Salary ||
  mongoose.model("Salary", salarySchema, "salaries");

export default Salary;