import sheets from "./googleSheets.js";
import Course from "../models/courseModel.js";

/* ----------------------------------------
   COURSE VALUES
----------------------------------------- */

const getCourseValues = (course) => {
  return [
    course._id?.toString() || "",

    course.courseCode || "",

    course.courseName || "",

    course.batch || "",

    course.description || "",

    course.category || "",

    course.subcategory || "",

    course.audience || "",

    course.level || "",

    course.fee ?? "",

    course.daysPerWeek ?? "",

    course.duration || "",

    course.status || "",

    course.teacherId?.toString() || "",

    Array.isArray(course.enrolledStudents)
      ? course.enrolledStudents
          .map((id) => id?.toString())
          .join(", ")
      : "",
  ];
};

/* ----------------------------------------
   SYNC ONE COURSE
   CREATE OR UPDATE
----------------------------------------- */

export const syncCourseToSheet = async (course) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not loaded");
    }

    /* GET EXISTING COURSE ROWS */

    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Courses!A:A",
      });

    const rows = response.data.values || [];

    /* FIND COURSE USING MONGODB ID */

    const rowIndex = rows.findIndex(
      (row, index) =>
        index > 0 &&
        row[0] === course._id.toString()
    );

    const values = [getCourseValues(course)];

    /* ----------------------------------------
       UPDATE EXISTING COURSE
    ----------------------------------------- */

    if (rowIndex !== -1) {
      const sheetRow = rowIndex + 1;

      await sheets.spreadsheets.values.update({
        spreadsheetId,

        range:
          `Courses!A${sheetRow}:O${sheetRow}`,

        valueInputOption: "USER_ENTERED",

        requestBody: {
          values,
        },
      });

      console.log(
        `Course ${course.courseName} updated in Google Sheets`
      );

      return;
    }

    /* ----------------------------------------
       ADD NEW COURSE
    ----------------------------------------- */

    await sheets.spreadsheets.values.append({
      spreadsheetId,

      range: "Courses!A:O",

      valueInputOption: "USER_ENTERED",

      insertDataOption: "INSERT_ROWS",

      requestBody: {
        values,
      },
    });

    console.log(
      `Course ${course.courseName} added to Google Sheets`
    );
  } catch (error) {
    console.error(
      "Course Google Sheets sync error:",
      error.message
    );

    throw error;
  }
};

/* ----------------------------------------
   SYNC ALL COURSES
----------------------------------------- */

export const syncAllCoursesToSheet = async () => {
  try {
    const spreadsheetId =
      process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error(
        "GOOGLE_SHEET_ID is not loaded"
      );
    }

    /* GET ALL COURSES FROM MONGODB */

    const courses =
      await Course.find().sort({
        createdAt: 1,
      });

    /* CONVERT COURSES TO SHEET ROWS */

    const rows = courses.map((course) =>
      getCourseValues(course)
    );

    /* CLEAR EXISTING DATA */

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Courses!A2:O",
    });

    /* WRITE ALL COURSES */

    if (rows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,

        range:
          `Courses!A2:O${rows.length + 1}`,

        valueInputOption: "USER_ENTERED",

        requestBody: {
          values: rows,
        },
      });
    }

    console.log(
      `${rows.length} courses synced to Google Sheets`
    );

    return rows.length;
  } catch (error) {
    console.error(
      "All courses Google Sheets sync error:",
      error.message
    );

    throw error;
  }
};

/* ----------------------------------------
   DELETE COURSE FROM GOOGLE SHEETS
----------------------------------------- */

export const deleteCourseFromSheet =
  async (courseId) => {
    try {
      const spreadsheetId =
        process.env.GOOGLE_SHEET_ID;

      if (!spreadsheetId) {
        throw new Error(
          "GOOGLE_SHEET_ID is not loaded"
        );
      }

      /* GET MONGODB IDs */

      const response =
        await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "Courses!A:A",
        });

      const rows =
        response.data.values || [];

      /* FIND COURSE */

      const rowIndex = rows.findIndex(
        (row, index) =>
          index > 0 &&
          row[0] === courseId.toString()
      );

      if (rowIndex === -1) {
        console.log(
          `Course ${courseId} not found in Google Sheets`
        );

        return;
      }

      /* GET COURSES SHEET ID */

      const spreadsheet =
        await sheets.spreadsheets.get({
          spreadsheetId,
        });

      const coursesSheet =
        spreadsheet.data.sheets.find(
          (sheet) =>
            sheet.properties.title ===
            "Courses"
        );

      if (!coursesSheet) {
        throw new Error(
          'Google Sheet tab "Courses" not found'
        );
      }

      /* DELETE ROW */

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,

        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId:
                    coursesSheet.properties
                      .sheetId,

                  dimension: "ROWS",

                  startIndex: rowIndex,

                  endIndex:
                    rowIndex + 1,
                },
              },
            },
          ],
        },
      });

      console.log(
        `Course ${courseId} deleted from Google Sheets`
      );
    } catch (error) {
      console.error(
        "Course Google Sheets delete error:",
        error.message
      );

      throw error;
    }
  };