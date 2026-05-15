import generatePDF from "../utils/generatePDF";

import {
  saveInvoice,
  getInvoices,
  generateInvoiceNumber,
  updateInvoice,
} from "../utils/Storage";

function InvoiceForm({
  invoiceData,
  setInvoiceData,
  loadInvoices,
  students,
  courses,
}) {

  const handleChange = (e) => {

    setInvoiceData({
      ...invoiceData,
      [e.target.name]:
        e.target.value,
    });

  };

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const readOnlyStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none";

  /* VALIDATE */

  const validateInvoice =
    () => {

      if (
        !invoiceData.invoiceNumber ||
        !invoiceData.invoiceDate ||
        !invoiceData.studentName ||
        !invoiceData.courseName
      ) {

        toast.error(
          "Please fill required fields."
        );

        return false;

      }

      return true;

    };

  /* RESET FORM */

  const resetInvoiceForm =
    async () => {

      const nextInvoiceNumber =
        await generateInvoiceNumber();

      setInvoiceData({

        invoiceNumber:
          nextInvoiceNumber,

        invoiceDate:
          new Date()
            .toISOString()
            .split("T")[0],

        studentName: "",

        contactNumber: "",

        courseName: "",

        paidMonth:
          new Date().toLocaleString(
            "default",
            {
              month: "long",
              year: "numeric",
            }
          ),

        courseFee: "",

        daysPerWeek: "",

        discount: "0",

        paidAmount: "",

        status: "Paid",

      });

    };

  /* SAVE OR UPDATE */

  const saveOrUpdateInvoice =
    async () => {

      const existingInvoices =
        await getInvoices();

      const alreadyExists =
        existingInvoices.find(
          (invoice) =>
            invoice.invoiceNumber ===
            invoiceData.invoiceNumber
        );

      if (alreadyExists) {

        await updateInvoice(
          alreadyExists._id,
          {
            ...invoiceData,
          }
        );

      } else {

        await saveInvoice({
          ...invoiceData,
        });

      }

      await loadInvoices();

    };

  /* SAVE */

  const handleSaveInvoice =
    async () => {

      if (
        !validateInvoice()
      ) {

        return;

      }

      try {

        await saveOrUpdateInvoice();

        toast.error(
          "Invoice saved."
        );

        await resetInvoiceForm();

      } catch (error) {

        console.error(
          error
        );

        toast.error(
          error.message ||
            "Failed to save invoice"
        );

      }

    };

  /* PDF */

  const handleDownloadPDF =
    async () => {

      if (
        invoiceData.status ===
        "Pending"
      ) {

        toast.error(
          "Pending invoices cannot be downloaded."
        );

        return;

      }

      if (
        !validateInvoice()
      ) {

        return;

      }

      try {

        await saveOrUpdateInvoice();

        await generatePDF();

      } catch (error) {

        console.error(
          error
        );

        toast.error(
          error.message ||
            "Failed to save invoice"
        );

      }

    };

  return (

    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">

      {/* TITLE */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-gray-900">
          Invoice Details
        </h2>

        <p className="mt-2 text-gray-500">
          Fill student and payment details
        </p>

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

          <select
            value={invoiceData.studentName}
            onChange={(e) => {

              const selectedStudent =
                students.find(
                  (student) =>
                    student.name ===
                    e.target.value
                );

              setInvoiceData({
                ...invoiceData,

                studentName:
                  selectedStudent?.name ||
                  "",

                contactNumber:
                  selectedStudent?.contact ||
                  "",
              });

            }}
            className={inputStyle}
          >

            <option value="">
              Select Student
            </option>

            {students.map(
              (student) => (

                <option
                  key={student._id}
                  value={student.name}
                >
                  {student.name}
                </option>

              )
            )}

          </select>

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

          <select
            value={invoiceData.courseName}
            onChange={(e) => {

              const selectedCourse =
                courses.find(
                  (course) =>
                    course.courseName ===
                    e.target.value
                );

              setInvoiceData({
                ...invoiceData,

                courseName:
                  selectedCourse?.courseName ||
                  "",

                courseFee:
                  selectedCourse?.fee ||
                  "",

                paidAmount:
                  selectedCourse?.fee ||
                  "",

                daysPerWeek:
                  selectedCourse?.daysPerWeek ||
                  "",
              });

            }}
            className={inputStyle}
          >

            <option value="">
              Select Course
            </option>

            {courses.map(
              (course) => (

                <option
                  key={course._id}
                  value={course.courseName}
                >
                  {course.courseName}
                </option>

              )
            )}

          </select>

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

              const discount =
                Number(
                  e.target.value
                ) || 0;

              const courseFee =
                Number(
                  invoiceData.courseFee
                ) || 0;

              const paidAmount =
                courseFee - discount;

              setInvoiceData({
                ...invoiceData,

                discount:
                  e.target.value,

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

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

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
            invoiceData.status ===
            "Pending"
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