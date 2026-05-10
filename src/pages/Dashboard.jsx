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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />
        <div className="grid grid-cols-4 gap-6 p-8 pb-0">
          {/* STUDENTS */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Students</p>

            <h2 className="text-3xl font-bold mt-3">{students.length}</h2>
          </div>

          {/* COURSES */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Courses</p>

            <h2 className="text-3xl font-bold mt-3">{courses.length}</h2>
          </div>

          {/* INVOICES */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Invoices</p>

            <h2 className="text-3xl font-bold mt-3">{invoices.length}</h2>
          </div>

          {/* REVENUE */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Revenue</p>

            <h2 className="text-3xl font-bold mt-3">Rs. {totalRevenue}</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 p-8 items-start">
          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <div className="sticky top-8">
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
