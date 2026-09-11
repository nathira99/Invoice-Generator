import generatePDF from "../utils/generatePDF";

import {
  saveInvoice,
  getInvoices,
  generateInvoiceNumber,
  updateInvoice,
} from "../utils/Storage";

import { useLocation } from "react-router-dom";

import toast from "react-hot-toast";

import Swal from "sweetalert2";

import Select from "react-select";

import { useEffect, useState } from "react";

function InvoiceForm({
  invoiceData,
  setInvoiceData,
  editId,
  setEditId,
  loadInvoices,
  students,
  courses,
}) {
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    const monthlyFee = Number(invoiceData.courseFee) || 0;
    const months = Number(invoiceData.paymentMonths) || 1;
    const discount = Number(invoiceData.discount) || 0;
    const paidAmount = Number(invoiceData.paidAmount) || 0;

    const totalFee = monthlyFee * months;

    const finalAmount = Math.max(0, totalFee - discount);

    const status = paidAmount >= finalAmount ? "Paid" : "Pending";

    if (invoiceData.status !== status) {
      setInvoiceData((prev) => ({
        ...prev,
        status,
      }));
    }
  }, [
    invoiceData.courseFee,
    invoiceData.paymentMonths,
    invoiceData.discount,
    invoiceData.paidAmount,
  ]);
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
      !invoiceData.courseName ||
      !invoiceData.paidMonth ||
      !invoiceData.status
    ) {
      toast.error("Please fill required fields.");

      return false;
    }

    return true;
  };

  /* RESET FORM */

  const resetInvoiceForm = async () => {
    setEditId(null);

    const nextInvoiceNumber = await generateInvoiceNumber();

    setInvoiceData({
      invoiceNumber: nextInvoiceNumber,

      invoiceDate: new Date().toISOString().split("T")[0],

      studentId: "",

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

      paymentMonths: "1",

      discountType: "Discount",

      discountReason: "",

      paidAmount: "0",

      status: "Pending",
    });

    setStudentCourses([]);
  };

  /* SAVE OR UPDATE */

  const saveOrUpdateInvoice = async () => {
    const existingInvoices = await getInvoices();

    const alreadyExists = existingInvoices.find(
      (invoice) =>
        invoice.studentName?.trim().toLowerCase() ===
          invoiceData.studentName?.trim().toLowerCase() &&
        invoice.courseName?.trim().toLowerCase() ===
          invoiceData.courseName?.trim().toLowerCase() &&
        invoice.paidMonth?.trim().toLowerCase() ===
          invoiceData.paidMonth?.trim().toLowerCase() &&
        invoice._id !== editId,
    );

    if (alreadyExists) {
      toast.error(
        `${invoiceData.studentName} already has an invoice for ${invoiceData.courseName} (${invoiceData.paidMonth})`,
      );

      return false;
    }

    if (editId) {
      return await updateInvoice(editId, invoiceData);
    }

    const nextInvoiceNumber = await generateInvoiceNumber();

    return await saveInvoice({
      ...invoiceData,
      invoiceNumber: nextInvoiceNumber,
    });
  };

  /* SAVE */

  const handleSaveInvoice = async () => {
    if (!validateInvoice()) {
      return;
    }

    try {
      const result = await saveOrUpdateInvoice();

      if (!result) return;

      await loadInvoices();

      toast.success("Invoice saved successfully");

      await resetInvoiceForm();
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to save invoice");
    }
  };

  /* DOWNLOAD PDF */

  const handleDownloadPDF = async () => {
    const cleanName = invoiceData.studentName
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_");

    const cleanMonth = invoiceData.paidMonth
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_");

    const cleanCourse = invoiceData.courseName
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 20);

    const filename = `${cleanName}_${cleanMonth}_${cleanCourse}_Invoice.pdf`;

    if (!validateInvoice()) {
      return;
    }

    try {
      await saveOrUpdateInvoice();

      await loadInvoices();

      toast.success("Invoice downloaded");

      await generatePDF(filename);

      await resetInvoiceForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to download invoice");
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6">
      {" "}
      {/* TITLE */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">
          Fill student and payment details
        </h2>
      </div>
      {/* FORM */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {" "}
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
              value={
                invoiceData.invoiceDate
                  ? invoiceData.invoiceDate.split("T")[0]
                  : ""
              }
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
                value: student.studentId,
                label: `${student.name} (${student.studentId})`,
              }))}
              value={
                invoiceData.studentId
                  ? (() => {
                      const student = students.find(
                        (s) => s.studentId === invoiceData.studentId,
                      );

                      return student
                        ? {
                            value: student.studentId,
                            label: `${student.name} (${student.studentId})`,
                          }
                        : null;
                    })()
                  : null
              }
              onChange={(selectedStudent) => {
                if (!selectedStudent) {
                  setInvoiceData({
                    ...invoiceData,
                    studentId: "",
                    studentName: "",
                    contactNumber: "",
                    courseName: "",
                    courseFee: "",
                    paidAmount: "",
                    daysPerWeek: "",
                  });

                  setStudentCourses([]);
                  return;
                }

                const student = students.find(
                  (s) => s.studentId === selectedStudent.value,
                );

                setInvoiceData({
                  ...invoiceData,

                  studentId: student?.studentId || "",

                  studentName: student?.name || "",

                  contactNumber: student?.contact || "",

                  courseName: "",

                  courseFee: "",

                  paidAmount: "",

                  daysPerWeek: "",
                });

                setStudentCourses(student?.enrollments || []);
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
              options={studentCourses.map((enrollment) => ({
                value: enrollment.courseName,
                label: enrollment.courseName,
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
                if (!selectedCourse) {
                  setInvoiceData({
                    ...invoiceData,
                    courseName: "",
                    courseFee: "",
                    paidAmount: "",
                    daysPerWeek: "",
                    status: "Pending",
                  });
                  return;
                }

                const course = courses.find(
                  (c) => c.courseName === selectedCourse.value,
                );

                const monthlyFee = Number(course?.fee) || 0;
                const months = Number(invoiceData.paymentMonths) || 1;
                const discount = Number(invoiceData.discount) || 0;

                const totalFee = monthlyFee * months;
                const finalAmount = Math.max(0, totalFee - discount);

                setInvoiceData({
                  ...invoiceData,
                  courseName: course?.courseName || selectedCourse.value,
                  courseFee: monthlyFee,
                  paidAmount: finalAmount,
                  daysPerWeek: course?.daysPerWeek || "",
                });
              }}
              placeholder="Select Course"
              isSearchable
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
              type="month"
              name="paidMonth"
              value={
                invoiceData.paidMonth
                  ? (() => {
                      const date = new Date(`${invoiceData.paidMonth} 1`);

                      if (isNaN(date.getTime())) return "";

                      return `${date.getFullYear()}-${String(
                        date.getMonth() + 1,
                      ).padStart(2, "0")}`;
                    })()
                  : ""
              }
              onChange={(e) => {
                if (!e.target.value) return;

                const [year, month] = e.target.value.split("-");

                const date = new Date(Number(year), Number(month) - 1, 1);

                setInvoiceData({
                  ...invoiceData,
                  paidMonth: date.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  }),
                });
              }}
              className={inputStyle}
            />
          </div>
          {/* PAYMENT MONTHS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Payment Months
            </label>

            <input
              type="number"
              name="paymentMonths"
              min="1"
              value={invoiceData.paymentMonths || 1}
              onChange={(e) => {
                const months = Math.max(1, Number(e.target.value) || 1);

                const monthlyFee = Number(invoiceData.courseFee) || 0;
                const discount = Number(invoiceData.discount) || 0;

                const totalFee = monthlyFee * months;
                const finalAmount = Math.max(0, totalFee - discount);

                setInvoiceData({
                  ...invoiceData,
                  paymentMonths: months,
                  paidAmount: finalAmount,
                });
              }}
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
          {/* PENDING AMOUNT */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Pending Amount
            </label>

            <input
              type="number"
              value={Math.max(
                0,
                (Number(invoiceData.courseFee) || 0) *
                  (Number(invoiceData.paymentMonths) || 1) -
                  (Number(invoiceData.discount) || 0) -
                  (Number(invoiceData.paidAmount) || 0),
              )}
              readOnly
              className={readOnlyStyle}
            />
          </div>
          {/* DISCOUNT / ADJUSTMENT */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Discount / Adjustment
            </label>

            <div className="flex gap-2">
              <select
                name="discountType"
                value={invoiceData.discountType || "Discount"}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    discountType: e.target.value,
                  })
                }
                className={`${inputStyle} w-1/2`}
              >
                <option value="Discount">Discount</option>
                <option value="Adjustment">Adjustment</option>
              </select>

              <input
                type="number"
                name="discount"
                min="0"
                value={invoiceData.discount}
                onChange={(e) => {
                  const discount = Number(e.target.value) || 0;
                  const monthlyFee = Number(invoiceData.courseFee) || 0;
                  const months = Number(invoiceData.paymentMonths) || 1;

                  const totalFee = monthlyFee * months;
                  const finalAmount = Math.max(0, totalFee - discount);

                  setInvoiceData({
                    ...invoiceData,
                    discount: e.target.value,
                    paidAmount: finalAmount,
                  });
                }}
                className={`${inputStyle} w-1/2`}
                placeholder="Amount"
              />
            </div>
          </div>
          {/* PAID AMOUNT */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Paid Amount
            </label>

            <input
              type="number"
              name="paidAmount"
              value={invoiceData.paidAmount}
              onChange={(e) => {
                setInvoiceData({
                  ...invoiceData,
                  paidAmount: e.target.value,
                });
              }}
              className={inputStyle}
            />
          </div>
          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <input
              type="text"
              name="status"
              value={invoiceData.status}
              readOnly
              className={readOnlyStyle}
            />
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
            className="flex-1 rounded-2xl bg-green-600 px-6 py-4 font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;
