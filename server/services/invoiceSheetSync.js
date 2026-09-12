import sheets from "./googleSheets.js";
import Invoice from "../models/InvoiceModel.js";

/* ----------------------------------------
   INVOICE VALUES
----------------------------------------- */

const getInvoiceValues = (invoice) => {
  return [
    invoice.invoiceNumber || "",
    invoice.studentName || "",
    invoice.contactNumber || "",
    invoice.courseName || "",
    invoice.paidMonth || "",

    invoice.invoiceDate
      ? new Date(invoice.invoiceDate)
          .toISOString()
          .split("T")[0]
      : "",

    invoice.courseFee ?? "",
    invoice.paymentMonths ?? 1,
    invoice.category || "",
    invoice.discountType || "Discount",
    invoice.discount ?? 0,
    invoice.paidAmount ?? 0,

    Math.max(
    0,
    Number(invoice.courseFee || 0) *
      Number(invoice.paymentMonths || 1) -
      Number(invoice.discount || 0) -
      Number(invoice.paidAmount || 0)
  ),

    invoice.status || "",

    invoice.isDeleted ? "Yes" : "No",

    invoice.deletedAt
      ? new Date(invoice.deletedAt)
          .toISOString()
          .split("T")[0]
      : "",

    invoice._id?.toString() || "",
  ];
};

/* ----------------------------------------
   SYNC ONE INVOICE
   CREATE OR UPDATE
----------------------------------------- */

export const syncInvoiceToSheet = async (invoice) => {
  try {
    const spreadsheetId =
      process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error(
        "GOOGLE_SHEET_ID is not loaded"
      );
    }

    /* Get existing invoice numbers */

    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Invoices!A:A",
      });

    const rows =
      response.data.values || [];

    /* Find existing invoice */

    const rowIndex = rows.findIndex(
      (row, index) =>
        index > 0 &&
        row[0] === invoice.invoiceNumber
    );

    const values = [
      getInvoiceValues(invoice),
    ];

    /* UPDATE */

    if (rowIndex !== -1) {
      const sheetRow =
        rowIndex + 1;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range:
          `Invoices!A${sheetRow}:Q${sheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      });

      console.log(
        `Invoice ${invoice.invoiceNumber} updated in Google Sheets`
      );

      return;
    }

    /* ADD */

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Invoices!A:Q",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log(
      `Invoice ${invoice.invoiceNumber} added to Google Sheets`
    );

  } catch (error) {

    console.error(
      "Invoice Google Sheets sync error:",
      error.message
    );

    throw error;
  }
};

/* ----------------------------------------
   SYNC ALL INVOICES
----------------------------------------- */

export const syncAllInvoicesToSheet = async () => {

    try {

      const spreadsheetId =
        process.env.GOOGLE_SHEET_ID;

      if (!spreadsheetId) {
        throw new Error(
          "GOOGLE_SHEET_ID is not loaded"
        );
      }

      /* Get ALL invoices */

      const invoices =
        await Invoice.find().sort({
          createdAt: 1,
        });

      const rows = invoices.map(
        (invoice) =>
          getInvoiceValues(invoice)
      );

      /* Clear old data */

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: "Invoices!A2:Q",
      });

      /* Write current data */

      if (rows.length > 0) {

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range:
            `Invoices!A2:Q${rows.length + 1}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: rows,
          },
        });

      }

      console.log(
        `${rows.length} invoices synced to Google Sheets`
      );

      return rows.length;

    } catch (error) {

      console.error(
        "All invoices Google Sheets sync error:",
        error.message
      );

      throw error;
    }
  };

  /* ----------------------------------------
   DELETE ONE INVOICE FROM SHEET
----------------------------------------- */

export const deleteInvoiceFromSheet = async (invoiceId) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not loaded");
    }

    /* Get MongoDB IDs from column N */

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Invoices!O:O",
    });

    const rows = response.data.values || [];

    /* Find invoice row */

    const rowIndex = rows.findIndex(
      (row, index) =>
        index > 0 &&
        row[0] === invoiceId.toString()
    );

    if (rowIndex === -1) {
      console.log(
        `Invoice ${invoiceId} not found in Google Sheets`
      );
      return;
    }

    /* Get Invoices sheet ID */

    const spreadsheet =
      await sheets.spreadsheets.get({
        spreadsheetId,
      });

    const invoiceSheet =
      spreadsheet.data.sheets.find(
        (sheet) =>
          sheet.properties.title === "Invoices"
      );

    if (!invoiceSheet) {
      throw new Error(
        'Google Sheet tab "Invoices" not found'
      );
    }

    const sheetId =
      invoiceSheet.properties.sheetId;

    /* Delete the row */

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    console.log(
      `Invoice ${invoiceId} deleted from Google Sheets`
    );

  } catch (error) {
    console.error(
      "Invoice Google Sheets delete error:",
      error.message
    );

    throw error;
  }
};