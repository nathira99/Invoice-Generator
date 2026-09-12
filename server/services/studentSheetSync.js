import sheets from "./googleSheets.js";
import Student from "../models/studentModel.js";

const getStudentValues = (student) => {
  return [
    student.studentId || "",
    student.name || "",
    student.contact || "",
    student.age ?? "",
    student.place || "",
    student.email || "",
    student.joiningDate
      ? new Date(student.joiningDate).toISOString().split("T")[0]
      : "",
    student.status || "",
    student.notes || "",
  ];
};

/* ----------------------------------------
   SYNC STUDENT
   CREATE OR UPDATE
----------------------------------------- */

export const syncStudentToSheet = async (student) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not loaded");
    }

    /* Get existing Student IDs */

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Students!A:A",
    });

    const rows = response.data.values || [];

    /* Find existing student */

    const rowIndex = rows.findIndex(
      (row, index) =>
        index > 0 &&
        row[0] === student.studentId
    );

    const values = [getStudentValues(student)];

    /* UPDATE EXISTING STUDENT */

    if (rowIndex !== -1) {
      const sheetRow = rowIndex + 1;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Students!A${sheetRow}:I${sheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      });

      console.log(
        `Student ${student.studentId} updated in Google Sheets`
      );

      return;
    }

    /* ADD NEW STUDENT */

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Students!A:I",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log(
      `Student ${student.studentId} added to Google Sheets`
    );
  } catch (error) {
    console.error(
      "Student Google Sheets sync error:",
      error.message
    );

    throw error;
  }
};

/* ----------------------------------------
   SYNC ALL STUDENTS
----------------------------------------- */

export const syncAllStudentsToSheet = async () => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not loaded");
    }

    /* Get all students from MongoDB */

    const students = await Student.find().sort({
      createdAt: 1,
    });

    const studentRows = students.map((student) =>
      getStudentValues(student)
    );

    /* Clear old student data, keeping row 1 header */

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Students!A2:I",
    });

    /* Write all current students */

    if (studentRows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Students!A2:I",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: studentRows,
        },
      });
    }

    console.log(
      `All ${students.length} students synced to Google Sheets`
    );

    return {
      count: students.length,
    };
  } catch (error) {
    console.error(
      "All Students Google Sheets sync error:",
      error.message
    );

    throw error;
  }
};

/* ----------------------------------------
   SYNC STUDENT ENROLLMENTS
----------------------------------------- */

export const syncStudentEnrollmentsToSheet = async () => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not loaded");
    }

    /*
      Get all students from MongoDB.
      We rebuild the enrollment sheet so that:
      - added courses appear
      - removed courses disappear
      - changed registration numbers update
      - multiple courses are handled correctly
    */

    const students = await Student.find().sort({
      createdAt: 1,
    });

    const enrollmentRows = [];

    students.forEach((student) => {
      const enrollments = student.enrollments || [];

      enrollments.forEach((enrollment) => {
        enrollmentRows.push([
          student.studentId || "",
          student.name || "",
          enrollment.courseName || "",
          enrollment.courseRegistrationNo || "",
        ]);
      });
    });

    /* Remove old enrollment data, keeping row 1 header */

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Student Enrollments!A2:D",
    });

    /* Add current enrollment data */

    if (enrollmentRows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Student Enrollments!A2:D",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: enrollmentRows,
        },
      });
    }

    console.log(
      "Student Enrollments synced to Google Sheets"
    );
  } catch (error) {
    console.error(
      "Student Enrollments Google Sheets sync error:",
      error.message
    );

    throw error;
  }
};