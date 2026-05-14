import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  Users,
  BookOpen,
  Receipt,
  Wallet,
  AlertCircle,
} from "lucide-react";

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

  const location =
    useLocation();

  /* STATES */

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [invoices, setInvoices] =
    useState([]);

  const [
    isLoadingInvoices,
    setIsLoadingInvoices,
  ] = useState(true);

  /* INVOICE DATA */

  const [
    invoiceData,
    setInvoiceData,
  ] = useState(
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

  /* LOAD DATA */

  const loadData =
    async () => {

      try {

        const studentsData =
          await getStudents();

        const coursesData =
          await getCourses();

        setStudents(
          Array.isArray(
            studentsData
          )
            ? studentsData
            : []
        );

        setCourses(
          Array.isArray(
            coursesData
          )
            ? coursesData
            : []
        );

      } catch (error) {

        console.error(
          error
        );

      }

    };

  /* LOAD INVOICES */

  const loadInvoices =
    async () => {

      try {

        setIsLoadingInvoices(
          true
        );

        const invoiceList =
          await getInvoices();

        setInvoices(
          Array.isArray(
            invoiceList
          )
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

        setIsLoadingInvoices(
          false
        );

      }

    };

  /* INITIAL LOAD */

  useEffect(() => {

    loadData();

    loadInvoices();

  }, []);

  /* GENERATE NUMBER */

  useEffect(() => {

    if (
      location.state
        ?.invoiceNumber
    ) {

      return;

    }

    let isMounted = true;

    const loadInvoiceNumber =
      async () => {

        try {

          const invoiceNumber =
            await generateInvoiceNumber();

          if (isMounted) {

            setInvoiceData(
              (
                currentData
              ) => ({
                ...currentData,
                invoiceNumber,
              })
            );

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

  /* TOTALS */

  const totalRevenue =
    invoices
      .filter(
        (invoice) =>
          invoice.status ===
          "Paid"
      )
      .reduce(
        (
          total,
          invoice
        ) =>
          total +
          Number(
            invoice.paidAmount ||
              0
          ),
        0
      );

  const pendingAmount =
    invoices
      .filter(
        (invoice) =>
          invoice.status ===
          "Pending"
      )
      .reduce(
        (
          total,
          invoice
        ) =>
          total +
          Number(
            invoice.paidAmount ||
              0
          ),
        0
      );

  /* STATS */

  const stats = [

    {
      title:
        "Students",
      value:
        students.length,
      icon:
        Users,
      bg:
        "bg-blue-100",
      color:
        "text-blue-700",
    },

    {
      title:
        "Courses",
      value:
        courses.length,
      icon:
        BookOpen,
      bg:
        "bg-violet-100",
      color:
        "text-violet-700",
    },

    {
      title:
        "Invoices",
      value:
        isLoadingInvoices
          ? "..."
          : invoices.length,
      icon:
        Receipt,
      bg:
        "bg-slate-200",
      color:
        "text-slate-700",
    },

    {
      title:
        "Revenue",
      value:
        isLoadingInvoices
          ? "..."
          : `Rs. ${totalRevenue}`,
      icon:
        Wallet,
      bg:
        "bg-emerald-100",
      color:
        "text-emerald-700",
    },

    {
      title:
        "Pending",
      value:
        isLoadingInvoices
          ? "..."
          : `Rs. ${pendingAmount}`,
      icon:
        AlertCircle,
      bg:
        "bg-orange-100",
      color:
        "text-orange-700",
    },

  ];

  return (

    <div className="min-h-screen bg-slate-50 lg:flex">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">

        <Header />

        <div className="pt-28 p-4 lg:p-8 lg:pt-8">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Dashboard
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage invoices, students and institute operations
            </p>

          </div>

          {/* STATS */}

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

            {stats.map(
              (
                stat,
                index
              ) => {

                const Icon =
                  stat.icon;

                return (

                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-sm font-semibold text-slate-500">
                          {
                            stat.title
                          }
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                          {
                            stat.value
                          }
                        </h2>

                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
                      >

                        <Icon
                          size={22}
                        />

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

          {/* MAIN GRID */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">

            {/* FORM */}

            <div className="min-w-0">

              <InvoiceForm
                invoiceData={
                  invoiceData
                }
                setInvoiceData={
                  setInvoiceData
                }
                loadInvoices={
                  loadInvoices
                }
                students={
                  students
                }
                courses={
                  courses
                }
              />

            </div>

            {/* PREVIEW */}

            <div className="min-w-0 xl:sticky xl:top-6">

              <InvoicePreview
                invoiceData={
                  invoiceData
                }
              />

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

export default Dashboard;