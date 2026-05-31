import generatePDF from "../utils/generatePDF";

import {
  saveInvoice,
  getInvoices,
  generateInvoiceNumber,
  updateInvoice,
} from "../utils/Storage";

import toast from "react-hot-toast";

import Select from "react-select";

import { useState } from "react";

function InvoiceForm({
  invoiceData,
  setInvoiceData,
  loadInvoices,
  students,
  courses,
}) {
  const [studentCourses, setStudentCourses] = useState([]);

  const handleChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value,
    });
  };

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const readOnlyStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none";

  /* VALIDATE */

  const validateInvoice = () => {
    if (
      !invoiceData.invoiceNumber ||
      !invoiceData.invoiceDate ||
      !invoiceData.studentName ||
      !invoiceData.courseName
    ) {
      toast.error("Please fill required fields.");

      return false;
    }

    return true;
  };

  /* RESET FORM */

  const resetInvoiceForm = async () => {
    const nextInvoiceNumber = await generateInvoiceNumber();

    setInvoiceData({
      invoiceNumber: nextInvoiceNumber,

      invoiceDate: new Date().toISOString(),

      studentName: "",

      contactNumber: "",

      courseName: "",

      paidMonth: new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),

      courseFee: "",

      daysPerWeek: "",

      discount: "0",

      paidAmount: "",

      status: "Paid",
    });

    setStudentCourses([]);
  };

  /* SAVE OR UPDATE */

  const saveOrUpdateInvoice = async () => {
    try {
      const existingInvoices = await getInvoices();

      const alreadyExists = existingInvoices.find(
        (invoice) => invoice.invoiceNumber === invoiceData.invoiceNumber,
      );

      if (alreadyExists) {
        return await updateInvoice(alreadyExists._id, invoiceData);
      }

      return await saveInvoice(invoiceData);
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  /* SAVE */

  const handleSaveInvoice = async () => {
    if (!validateInvoice()) {
      return;
    }

    try {
      await saveOrUpdateInvoice();

      toast.success("Invoice saved successfully");

      await loadInvoices();

      await resetInvoiceForm();
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to save invoice");
    }
  };

  /* DOWNLOAD PDF */

  const handleDownloadPDF = async () => {
    if (invoiceData.status === "Pending") {
      toast.error("Pending invoices cannot be downloaded.");

      return;
    }

    if (!validateInvoice()) {
      return;
    }

    try {
      await saveOrUpdateInvoice();

      await loadInvoices();

      toast.success("Invoice downloaded");

      await generatePDF();

      await resetInvoiceForm();
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to download invoice");
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
      {/* TITLE */}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Invoice Details</h2>

        <p className="mt-2 text-gray-500">Fill student and payment details</p>
      </div>

      {/* FORM */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* INVOICE NUMBER */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Invoice Number
          </label>

          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* DATE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Invoice Date
          </label>

          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* STUDENT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Student Name
          </label>

          <Select
            options={students.map((student) => ({
              value: student.name,
              label: `${student.name} (${student.studentId})`,
            }))}
            value={
              invoiceData.studentName
                ? {
                    value: invoiceData.studentName,
                    label: invoiceData.studentName,
                  }
                : null
            }
            onChange={(selectedStudent) => {
              const student = students.find(
                (s) => s.name === selectedStudent.value,
              );

              setInvoiceData({
                ...invoiceData,

                studentName: student?.name || "",

                contactNumber: student?.contact || "",

                courseName: "",

                courseFee: "",

                paidAmount: "",

                daysPerWeek: "",
              });

              setStudentCourses(student?.enrolledCourses || []);
            }}
            placeholder="Search Student"
            isSearchable
            className="text-sm"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "52px",
                borderRadius: "16px",
                borderColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
                boxShadow: "none",
                paddingLeft: "4px",
              }),

              placeholder: (base) => ({
                ...base,
                color: "#6b7280",
                fontWeight: 500,
                fontSize: "14px",
              }),

              singleValue: (base) => ({
                ...base,
                color: "#111827",
                fontWeight: 500,
                fontSize: "14px",
              }),

              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        </div>

        {/* CONTACT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Contact Number
          </label>

          <input
            type="text"
            value={invoiceData.contactNumber}
            readOnly
            className={readOnlyStyle}
          />
        </div>

        {/* COURSE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Course Name
          </label>

          <Select
            options={studentCourses.map((courseName) => ({
              value: courseName,
              label: courseName,
            }))}
            value={
              invoiceData.courseName
                ? {
                    value: invoiceData.courseName,
                    label: invoiceData.courseName,
                  }
                : null
            }
            onChange={(selectedCourse) => {
              const course = courses.find(
                (c) => c.courseName === selectedCourse.value,
              );

              setInvoiceData({
                ...invoiceData,

                courseName: course?.courseName || "",

                courseFee: course?.fee || "",

                paidAmount: course?.fee || "",

                daysPerWeek: course?.daysPerWeek || "",
              });
            }}
            placeholder="Select Course"
            isSearchable
            className="text-sm"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "52px",
                borderRadius: "16px",
                borderColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
                boxShadow: "none",
                paddingLeft: "4px",
              }),

              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
                fontWeight: 500,
                color: "#9ca3af",
              }),

              singleValue: (base) => ({
                ...base,
                fontSize: "14px",
                fontWeight: 500,
                color: "#111827",
              }),

              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        </div>

        {/* PAID MONTH */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Paid Month
          </label>

          <input
            type="text"
            name="paidMonth"
            value={invoiceData.paidMonth}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* COURSE FEE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Course Fee
          </label>

          <input
            type="number"
            value={invoiceData.courseFee}
            readOnly
            className={readOnlyStyle}
          />
        </div>

        {/* DAYS */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Days Per Week
          </label>

          <input
            type="text"
            value={invoiceData.daysPerWeek}
            readOnly
            className={readOnlyStyle}
          />
        </div>

        {/* DISCOUNT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Discount
          </label>

          <input
            type="number"
            name="discount"
            value={invoiceData.discount}
            onChange={(e) => {
              const discount = Number(e.target.value) || 0;

              const courseFee = Number(invoiceData.courseFee) || 0;

              const paidAmount = courseFee - discount;

              setInvoiceData({
                ...invoiceData,

                discount: e.target.value,

                paidAmount,
              });
            }}
            className={inputStyle}
          />
        </div>

        {/* PAID AMOUNT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Paid Amount
          </label>

          <input
            type="number"
            value={invoiceData.paidAmount}
            readOnly
            className={readOnlyStyle}
          />
        </div>

        {/* STATUS */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Status
          </label>

          <select
            name="status"
            value={invoiceData.status}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="Paid">Paid</option>

            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleSaveInvoice}
          className="flex-1 rounded-2xl bg-blue-700 px-6 py-4 font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-lg"
        >
          Save Invoice
        </button>

        <button
          onClick={handleDownloadPDF}
          className={`flex-1 rounded-2xl px-6 py-4 font-semibold text-white transition-all

          ${
            invoiceData.status === "Pending"
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
          }`}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm;
