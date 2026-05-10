import generatePDF from "../utils/generatePDF";
import {
  saveInvoice,
  getInvoices,
  generateInvoiceNumber,
  getStudents,
  getCourses,
  updateInvoice,
} from "../utils/localStorage";

function InvoiceForm({ invoiceData, setInvoiceData }) {
  const handleChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value,
    });
  };
  const students = getStudents();

  const courses = getCourses();

  const handleSaveInvoice = () => {
    if (
      !invoiceData.invoiceNumber ||
      !invoiceData.invoiceDate ||
      !invoiceData.studentName ||
      !invoiceData.courseName
    ) {
      alert("Please fill required fields.");

      return;
    }

    const existingInvoices = getInvoices();

    const alreadyExists = existingInvoices.find(
      (invoice) => invoice.invoiceNumber === invoiceData.invoiceNumber,
    );

    if (alreadyExists) {
      updateInvoice(invoiceData.invoiceNumber, {
        ...invoiceData,
        status: "draft",
      });

      alert("Invoice updated.");
    } else {
      saveInvoice({
        ...invoiceData,
        status: "draft",
      });

      alert("Invoice saved.");
    }

    setInvoiceData({
      invoiceNumber: generateInvoiceNumber(),

      invoiceDate: "",

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
    });
  };

  const handleDownloadPDF = () => {
    if (
      !invoiceData.invoiceNumber ||
      !invoiceData.invoiceDate ||
      !invoiceData.studentName ||
      !invoiceData.courseName
    ) {
      alert("Please fill required fields.");

      return;
    }

    generatePDF();
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border">
      {/* TITLE */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>

        <p className="text-gray-500 mt-2">Fill student and payment details</p>
      </div>

      {/* FORM */}

      <div className="grid grid-cols-2 gap-6">
        {/* INVOICE NUMBER */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Invoice Number
          </label>

          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
            placeholder="INV-001"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* DATE */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Invoice Date
          </label>

          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* STUDENT NAME */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Student Name
          </label>

          <select
            name="studentName"
            value={invoiceData.studentName}
            onChange={(e) => {
              const selectedStudent = students.find(
                (student) => student.name === e.target.value,
              );

              setInvoiceData({
                ...invoiceData,
                studentName: selectedStudent?.name || "",

                contactNumber: selectedStudent?.contact || "",
              });
            }}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select Student</option>

            {students.map((student, index) => (
              <option key={index} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONTACT NUMBER */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Contact Number
          </label>

          <input
            type="text"
            name="contactNumber"
            value={invoiceData.contactNumber}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* COURSE NAME */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Course Name
          </label>

          <select
            name="courseName"
            value={invoiceData.courseName}
            onChange={(e) => {
              const selectedCourse = courses.find(
                (course) => course.courseName === e.target.value,
              );

              setInvoiceData({
                ...invoiceData,

                courseName: selectedCourse?.courseName || "",

                courseFee: selectedCourse?.fee || "",
                paidAmount: selectedCourse?.fee || "",
                daysPerWeek: selectedCourse?.daysPerWeek || "",
              });
            }}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select Course</option>

            {courses.map((course, index) => (
              <option key={index} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* PAID MONTH */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Paid Month
          </label>

          <input
            type="text"
            name="paidMonth"
            value={invoiceData.paidMonth}
            onChange={handleChange}
            placeholder="May 2026"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* COURSE FEE */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Course Fee
          </label>

          <input
            type="number"
            name="courseFee"
            value={invoiceData.courseFee}
            onChange={handleChange}
            placeholder="5000"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Days Per Week
          </label>

          <input
            type="text"
            value={invoiceData.daysPerWeek || ""}
            readOnly
            className="w-full border rounded-xl px-4 py-3 bg-gray-100"
          />
        </div>

        {/* DISCOUNT */}

        <div>
          <label className="block mb-2 font-medium text-gray-700">
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
            placeholder="0"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* PAID AMOUNT */}

        <div className="col-span-2">
          <label className="block mb-2 font-medium text-gray-700">
            Paid Amount
          </label>

          <input
            type="number"
            name="paidAmount"
            value={invoiceData.paidAmount}
            readOnly
            className="w-full border rounded-xl px-4 py-3 bg-gray-100"
          />
        </div>
      </div>

      {/* BUTTON */}

      <div className="mt-8 flex gap-4">
        {/* SAVE */}

        <button
          onClick={handleSaveInvoice}
          className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-semibold px-6 py-4 rounded-xl transition-all"
        >
          Save Invoice
        </button>

        {/* DOWNLOAD */}

        <button
          id="download-pdf-btn"
          onClick={handleDownloadPDF}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-4 rounded-xl transition-all"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm;
