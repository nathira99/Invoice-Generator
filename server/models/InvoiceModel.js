import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Student name must be at least 2 characters"],
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Please provide a valid contact number"],
    },
    courseName: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      maxlength: [100, "Course cannot exceed 100 characters"],
    },
    paidMonth: {
      type: String,
      required: [true, "Paid month is required"],
      trim: true,
      maxlength: [30, "Paid month cannot exceed 30 characters"],
    },
    invoiceDate: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
    },
    courseFee: {
      type: Number,
      required: [true, "Course fee is required"],
      min: [0, "Course fee cannot be negative"],
    },
    category: {
      type: String,
      enum: ["Islamic", "Skill Development", "Academic"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      validate: {
        validator(value) {
          return this.courseFee === undefined || value <= this.courseFee;
        },
        message: "Discount cannot exceed course fee",
      },
    },
    paidAmount: {
      type: Number,
      required: [true, "Paid amount is required"],
      min: [0, "Paid amount cannot be negative"],
      validate: {
        validator(value) {
          if (this.courseFee === undefined || this.discount === undefined) {
            return true;
          }

          return value <= this.courseFee - this.discount;
        },
        message: "Paid amount cannot exceed payable amount",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Paid", "Pending"],
        message: "Status must be Paid or Pending.",
      },
      default: "Paid",
    },
  },
  {
    timestamps: true,
  },
);

const Invoice = mongoose.model("Invoice", invoiceSchema, "invoices");

export default Invoice;
