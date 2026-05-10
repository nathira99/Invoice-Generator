import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getStudents, getCourses, getInvoices } from "../utils/localStorage";
import { generateInvoiceNumber } from "../utils/localStorage";
import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";

function Dashboard() {
  const location = useLocation();
  const students = getStudents();

  const courses = getCourses();

  const invoices = getInvoices();

  const [invoiceData, setInvoiceData] = useState(
    location.state || {
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
    },
  );
  const totalRevenue = invoices.reduce((total, invoice) => {
    return total + Number(invoice.paidAmount || 0);
  }, 0);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <Header />
        <div className="m-4 mb-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:m-8 lg:mb-0 lg:grid-cols-4 lg:gap-6">
          {/* STUDENTS */}

          <div className="w-full max-w-full rounded-2xl bg-white p-5 shadow-sm lg:p-6">
            <p className="text-gray-500 text-sm">Total Students</p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {students.length}
            </h2>
          </div>

          {/* COURSES */}

          <div className="w-full max-w-full rounded-2xl bg-white p-5 shadow-sm lg:p-6">
            <p className="text-gray-500 text-sm">Total Courses</p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {courses.length}
            </h2>
          </div>

          {/* INVOICES */}

          <div className="w-full max-w-full rounded-2xl bg-white p-5 shadow-sm lg:p-6">
            <p className="text-gray-500 text-sm">Total Invoices</p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {invoices.length}
            </h2>
          </div>

          {/* REVENUE */}

          <div className="w-full max-w-full rounded-2xl bg-white p-5 shadow-sm lg:p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>

            <h2 className="mt-3 break-words text-2xl font-bold sm:text-3xl">
              Rs. {totalRevenue}
            </h2>
          </div>
        </div>
        
        <div className="m-4 grid grid-cols-1 items-start gap-6 lg:m-8 lg:grid-cols-2 lg:gap-8">
          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <div className="min-w-0 lg:sticky lg:top-8">
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
