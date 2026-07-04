import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { Users, BookOpen, Receipt, Wallet, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
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

  /* STATES */

  const [students, setStudents] = useState([]);

  const [courses, setCourses] = useState([]);

  const [invoices, setInvoices] = useState([]);

  const [editId, setEditId] = useState(location.state?._id || null);

  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  /* INVOICE DATA */

  const [invoiceData, setInvoiceData] = useState(
    location.state || {
      invoiceNumber: "",

      invoiceDate: new Date().toISOString().split("T")[0],

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

      paidAmount: "0",

      status: "Pending",
    },
  );
  useEffect(() => {
    if (location.state) {
      setInvoiceData(location.state);
      setEditId(location.state._id);
    }
  }, [location.state]);

  /* LOAD DATA */

  const loadData = async () => {
    try {
      const studentsData = await getStudents();

      const coursesData = await getCourses();

      setStudents(Array.isArray(studentsData) ? studentsData : []);

      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error(error);
    }
  };

  /* LOAD INVOICES */

  const loadInvoices = async () => {
    try {
      setIsLoadingInvoices(true);

      const invoiceList = await getInvoices();

      setInvoices(Array.isArray(invoiceList) ? invoiceList : []);
    } catch (error) {
      console.error("Failed to load invoices:", error);

      setInvoices([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  /* INITIAL LOAD */

  useEffect(() => {
    loadData();

    loadInvoices();
  }, []);

  /* GENERATE NUMBER */

  useEffect(() => {
    if (location.state?.invoiceNumber) {
      return;
    }

    let isMounted = true;

    const loadInvoiceNumber = async () => {
      try {
        const invoiceNumber = await generateInvoiceNumber();

        if (isMounted) {
          setInvoiceData((currentData) => ({
            ...currentData,
            invoiceNumber,
          }));
        }
      } catch (error) {
        console.error("Failed to generate invoice number:", error);
      }
    };

    loadInvoiceNumber();

    return () => {
      isMounted = false;
    };
  }, [location.state]);

  /* TOTALS */

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + Number(invoice.paidAmount || 0), 0);

  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "Pending")
    .reduce((total, invoice) => total + Number(invoice.paidAmount || 0), 0);

  const collectionRate =
    totalRevenue + pendingAmount === 0
      ? 0
      : Math.round((totalRevenue / (totalRevenue + pendingAmount)) * 100);

  const activeCourses = courses.filter((c) => c.status === "Active").length;

  const upcomingCourses = courses.filter((c) => c.status === "Upcoming").length;

  const closedCourses = courses.filter((c) => c.status === "Closed").length;

  /* STATS */

  const stats = [
    {
      title: "Students",
      value: students.length,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },

    {
      title: "Courses",
      value: courses.length,
      icon: BookOpen,
      bg: "bg-violet-100",
      color: "text-violet-700",
    },

    {
      title: "Collection",
      value: `${collectionRate}%`,
      icon: Receipt,
      bg: "bg-indigo-100",
      color: "text-indigo-700",
    },

    {
      title: "Revenue",
      value: isLoadingInvoices ? "..." : `Rs. ${totalRevenue.toLocaleString()}`,
      icon: Wallet,
      bg: "bg-emerald-100",
      color: "text-emerald-700",
    },

    {
      title: "Pending",
      value: isLoadingInvoices
        ? "..."
        : `Rs. ${pendingAmount.toLocaleString()}`,
      icon: AlertCircle,
      bg: "bg-orange-100",
      color: "text-orange-700",
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
          </div>

          {/* STATS */}

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {stat.title}
                      </p>

                      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                        {stat.value}
                      </h2>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MAIN GRID */}

          <div className="flex flex-col gap-8">
            <div className="mb-8 grid gap-5 lg:grid-cols-2">
              {/* Collection Status */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Collection Status</h3>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Paid Revenue</span>
                    <span className="font-semibold">
                      ₹{totalRevenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Pending Revenue</span>
                    <span className="font-semibold">
                      ₹{pendingAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${collectionRate}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {collectionRate}% collected
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Status */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Course Status</h3>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>🟢 Active</span>
                    <span>{activeCourses}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>🟡 Upcoming</span>
                    <span>{upcomingCourses}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>🔴 Closed</span>
                    <span>{closedCourses}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Invoice Management
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>
            {/* FORM */}
            <div className=" w-full max-w-5xl">
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  Create Invoice
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Generate and manage student invoices
                </p>
              </div>
              <InvoiceForm
                invoiceData={invoiceData}
                setInvoiceData={setInvoiceData}
                editId={editId}
                setEditId={setEditId}
                loadInvoices={loadInvoices}
                students={students}
                courses={courses}
              />
            </div>
            <div className="my-5 border-t border-slate-200" />
            {/* PREVIEW */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 w-full max-w-5xl">
                <h2 className="text-3xl font-bold text-slate-900">
                  Invoice Preview
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Review before download or save
                </p>
              </div>
              <InvoicePreview invoiceData={invoiceData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
