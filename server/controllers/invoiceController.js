import mongoose from 'mongoose';
import Invoice from '../models/InvoiceModel.js';
import Course from '../models/courseModel.js';
import {
  syncInvoiceToSheet,
  syncAllInvoicesToSheet,
  deleteInvoiceFromSheet
} from "../services/invoiceSheetSync.js";

const calculateStatus = (
  courseFee,
  discount = 0,
  paidAmount = 0,
  paymentMonths = 1,
) => {
  const monthlyFee = Number(courseFee || 0);
  const months = Number(paymentMonths || 1);
  const totalFee = monthlyFee * months;

  const payable = Math.max(
    totalFee - Number(discount || 0),
    0,
  );

  const paid = Number(paidAmount || 0);

  return paid >= payable ? "Paid" : "Pending";
};

const handleInvoiceError = (error, res) => {
  if (error.name === "ValidationError") {
  return res.status(400).json({
    message: "Invoice validation failed",
    errors: Object.values(error.errors).map((err) => err.message),
  });
}

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'Invoice number already exists',
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid invoice id',
    });
  }

  console.error(error);
  return res.status(500).json({
    message: 'Server error',
  });
};

export const createInvoice = async (req, res) => {
  try {
    const invoiceData = { ...req.body };

    const invoice = await Invoice.create({
  ...invoiceData,
  status: calculateStatus(
    invoiceData.courseFee,
    invoiceData.discount,
    invoiceData.paidAmount,
    invoiceData.paymentMonths
  ),
});

try {
  await syncInvoiceToSheet(invoice);
} catch (syncError) {
  console.error(
    "Google Sheets invoice sync failed:",
    syncError.message
  );
}

return res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    return handleInvoiceError(error, res);
  }
};

export const generateInvoicesByCourse = async (req, res) => {
  try {
    const { courseId, paidMonth } = req.body;

    const course = await Course.findById(courseId).populate(
      "enrolledStudents"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const invoices = [];

    for (const student of course.enrolledStudents) {
      const invoice = {
        invoiceNumber: `INV-${Date.now()}-${student.studentId}`,

        studentName: student.name,

        contactNumber: student.contact,

        courseName: course.courseName,

        paidMonth,

        invoiceDate: new Date(),

        courseFee: course.fee,

        category: course.category,

        paidAmount: 0,

        discount: 0,

        discountType: "Discount",

        status: calculateStatus(
          course.fee,
          0,
          0
        ),
      };

      invoices.push(invoice);
    }

    const createdInvoices = await Invoice.insertMany(invoices);

for (const invoice of createdInvoices) {
  try {
    await syncInvoiceToSheet(invoice);
  } catch (syncError) {
    console.error(
      `Google Sheets sync failed for invoice ${invoice.invoiceNumber}:`,
      syncError.message
    );
  }
}

res.status(201).json({
  message: `${createdInvoices.length} invoices generated`,
  invoices: createdInvoices,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(invoices);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid invoice id' });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const updateInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid invoice id' });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

invoice.set(req.body);

invoice.status = calculateStatus(
  invoice.courseFee,
  invoice.discount,
  invoice.paidAmount,
  invoice.paymentMonths
);

const updatedInvoice = await invoice.save();

try {
  await syncInvoiceToSheet(updatedInvoice);
} catch (syncError) {
  console.error(
    "Google Sheets invoice sync failed:",
    syncError.message
  );
}

return res.status(200).json(updatedInvoice);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid invoice id",
      });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { returnDocument: "after" }
    );

    if (!invoice) {
  return res.status(404).json({
    message: "Invoice not found",
  });
}

try {
  await syncInvoiceToSheet(invoice);
} catch (syncError) {
  console.error(
    "Google Sheets invoice delete sync failed:",
    syncError.message
  );
}

return res.status(200).json({
  message: "Invoice moved to trash",
});
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const getTrashedInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      isDeleted: true,
    }).sort({
      deletedAt: -1,
    });

    return res.status(200).json(invoices);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const restoreInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { returnDocument: "after" }
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    try {
      await syncInvoiceToSheet(invoice);
    } catch (syncError) {
      console.error(
        "Google Sheets invoice restore sync failed:",
        syncError.message
      );
    }

    return res.status(200).json(invoice);
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const permanentlyDeleteInvoice = async (
  req,
  res
) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(
      req.params.id
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    try {
      await deleteInvoiceFromSheet(invoice._id);
    } catch (syncError) {
      console.error(
        "Google Sheets invoice permanent delete sync failed:",
        syncError.message
      );
    }

    return res.status(200).json({
      message: "Invoice permanently deleted",
    });
  } catch (error) {
    return handleInvoiceError(error, res);
  }
};

export const syncAllInvoices = async (req, res) => {
  try {
    const count = await syncAllInvoicesToSheet();

    return res.status(200).json({
      success: true,
      message: "All invoices synced successfully",
      count,
    });
  } catch (error) {
    console.error("All invoices sync error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to sync all invoices",
      error: error.message,
    });
  }
};

export const updateInvoiceFromSheet = async (req, res) => {
  try {
    const {
      mongoId,
      invoiceNumber,
      studentName,
      contactNumber,
      courseName,
      paidMonth,
      invoiceDate,
      courseFee,
      category,
      discount,
      paidAmount,
      status,
      isDeleted,
      deletedAt,
    } = req.body;

    if (!mongoId) {
      return res.status(400).json({
        message: "MongoDB ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(mongoId)) {
      return res.status(400).json({
        message: "Invalid MongoDB ID",
      });
    }

    const invoice = await Invoice.findById(mongoId);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    invoice.invoiceNumber = invoiceNumber;
    invoice.studentName = studentName;
    invoice.contactNumber = contactNumber;
    invoice.courseName = courseName;
    invoice.paidMonth = paidMonth;

    if (invoiceDate) {
      invoice.invoiceDate = new Date(invoiceDate);
    }

    invoice.courseFee = Number(courseFee || 0);
    invoice.category = category || undefined;
    invoice.discount = Number(discount || 0);
    invoice.paidAmount = Number(paidAmount || 0);

    invoice.status = calculateStatus(
      invoice.courseFee,
      invoice.discount,
      invoice.paidAmount
    );

    invoice.isDeleted =
      String(isDeleted).toLowerCase() === "yes";

    invoice.deletedAt =
      invoice.isDeleted && deletedAt
        ? new Date(deletedAt)
        : null;

    const updatedInvoice = await invoice.save();

    return res.status(200).json({
      success: true,
      message: "Invoice updated from Google Sheets",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error(
      "Google Sheets → MongoDB invoice sync error:",
      error
    );

    return handleInvoiceError(error, res);
  }
};