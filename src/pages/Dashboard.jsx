import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getStudents,
  getCourses,
  getInvoices,
  generateInvoiceNumber,
} from "../utils/Storage";

import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";

function Dashboard() {

  const location = useLocation();

  const students = getStudents();

  const courses = getCourses();

  const [invoices, setInvoices] = useState([]);

  const [isLoadingInvoices, setIsLoadingInvoices] =
    useState(true);

  const [invoiceData, setInvoiceData] = useState(
    location.state || {

      invoiceNumber: "",

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

    }
  );

  /* LOAD INVOICES */

  const loadInvoices = async () => {

    try {

      setIsLoadingInvoices(true);

      const invoiceList =
        await getInvoices();

      setInvoices(
        Array.isArray(invoiceList)
          ? invoiceList
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load invoices:",
        error
      );

      setInvoices([]);

    } finally {

      setIsLoadingInvoices(false);

    }

  };

  /* INITIAL LOAD */

  useEffect(() => {

    loadInvoices();

  }, []);

  /* GENERATE INVOICE NUMBER */

  useEffect(() => {

    if (location.state?.invoiceNumber) {

      return;

    }

    let isMounted = true;

    const loadInvoiceNumber = async () => {

      try {

        const invoiceNumber =
          await generateInvoiceNumber();

        if (isMounted) {

          setInvoiceData((currentData) => ({
            ...currentData,
            invoiceNumber,
          }));

        }

      } catch (error) {

        console.error(
          "Failed to generate invoice number:",
          error
        );

      }

    };

    loadInvoiceNumber();

    return () => {

      isMounted = false;

    };

  }, [location.state]);

  /* TOTAL REVENUE */

  const totalRevenue =
    invoices
      .filter(
        (invoice) =>
          invoice.status === "Paid"
      )
      .reduce(
        (total, invoice) =>
          total +
          Number(invoice.paidAmount || 0),
        0
      );

  /* PENDING AMOUNT */

  const pendingAmount =
    invoices
      .filter(
        (invoice) =>
          invoice.status === "Pending"
      )
      .reduce(
        (total, invoice) =>
          total +
          Number(invoice.paidAmount || 0),
        0
      );

  return (

    <div className="min-h-screen bg-gray-100 lg:flex">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <main className="flex-1 overflow-auto">

        <Header />

        {/* PAGE TITLE */}

        <div className="mb-6 px-4 pt-6 lg:px-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Manage invoices, students and payments
          </p>

        </div>

        {/* DASHBOARD CARDS */}

        <div className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 lg:m-8">

          {/* STUDENTS */}

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Students
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              {students.length}
            </h2>

          </div>

          {/* COURSES */}

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Courses
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              {courses.length}
            </h2>

          </div>

          {/* INVOICES */}

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Invoices
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              {isLoadingInvoices
                ? "..."
                : invoices.length}
            </h2>

          </div>

          {/* REVENUE */}

          <div className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-sm">

            <p className="text-sm font-medium text-green-700">
              Total Revenue
            </p>

            <h2 className="mt-4 text-4xl font-bold text-green-800">
              {isLoadingInvoices
                ? "..."
                : `Rs. ${totalRevenue}`}
            </h2>

          </div>

          {/* PENDING */}

          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm">

            <p className="text-sm font-medium text-orange-700">
              Pending Amount
            </p>

            <h2 className="mt-4 text-4xl font-bold text-orange-700">
              {isLoadingInvoices
                ? "..."
                : `Rs. ${pendingAmount}`}
            </h2>

          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="m-4 grid grid-cols-1 items-start gap-6 lg:m-8 lg:grid-cols-2 lg:gap-8">

          {/* FORM */}

          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            loadInvoices={loadInvoices}
          />

          {/* PREVIEW */}

          <div className="min-w-0 lg:sticky lg:top-8">

            <InvoicePreview
              invoiceData={invoiceData}
            />

          </div>

        </div>

      </main>

    </div>

  );

}

export default Dashboard;