import express from "express";
import sheets from "../services/googleSheets.js";
import Student from "../models/studentModel.js";
import {
  syncStudentToSheet,
  syncStudentEnrollmentsToSheet,
} from "../services/studentSheetSync.js";

const router = express.Router();

/* TEST GOOGLE SHEETS CONNECTION */

router.get("/test", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    res.json({
      success: true,
      message: "Google Sheets connection successful",
      spreadsheetTitle: response.data.properties.title,
    });
  } catch (error) {
    console.error("Google Sheets test error:", error);

    res.status(500).json({
      success: false,
      message: "Google Sheets connection failed",
      error: error.message,
    });
  }
});

/* TEST ONE STUDENT */

router.get("/test-student", async (req, res) => {
  try {
    const student = await Student.findOne();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student found in MongoDB",
      });
    }

    await syncStudentToSheet(student);

    res.json({
      success: true,
      message: "Student synced successfully",
      student: {
        studentId: student.studentId,
        name: student.name,
      },
    });
  } catch (error) {
    console.error("Student sync test error:", error);

    res.status(500).json({
      success: false,
      message: "Student sync failed",
      error: error.message,
    });
  }
});

/* SYNC ALL STUDENT ENROLLMENTS */

router.get("/sync-enrollments", async (req, res) => {
  try {
    await syncStudentEnrollmentsToSheet();

    res.json({
      success: true,
      message: "All student enrollments synced successfully",
    });
  } catch (error) {
    console.error(
      "Student enrollment sync error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to sync student enrollments",
      error: error.message,
    });
  }
});

export default router;