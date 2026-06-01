import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Search, Receipt, Download, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Swal from "sweetalert2";
import { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { getInvoices, deleteInvoice, getCourses } from "../utils/Storage";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);

  const [courses, setCourses] = useState([]);

  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    const invoiceList = await getInvoices();

    return Array.isArray(invoiceList) ? invoiceList : [];
  };

  useEffect(() => {
    let isMounted = true;

    const loadInvoices = async () => {
      try {
        const invoiceList = await fetchInvoices();

        if (isMounted) {
          setInvoices(invoiceList);
        }
      } catch (error) {
        console.error("Failed to load invoices:", error);

        if (isMounted) {
          setInvoices([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingInvoices(false);
        }
      }
    };

    const loadCourses = async () => {
      try {
        const data = await getCourses();

        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadInvoices();
    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    return (
      invoice.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const navigate = useNavigate();

  const handleDeleteInvoice = async (invoice) => {
    const result = await Swal.fire({
      title: "Delete Invoice?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      borderRadius: "20px",
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoadingInvoices(true);

      await deleteInvoice(invoice._id);

      const invoiceList = await fetchInvoices();

      setInvoices(invoiceList);
    } catch (error) {
      console.error("Failed to delete invoice:", error);

      toast.error("Unable to delete invoice.");
    } finally {
      setIsLoadingInvoices(false);
    }
  };
  const getCategory = (courseName) => {
    const course = courses.find((c) => c.courseName === courseName);

    return course?.category || "Unknown";
  };

  const islamicInvoices = filteredInvoices.filter(
    (invoice) => getCategory(invoice.courseName) === "Islamic",
  );

  const skillInvoices = filteredInvoices.filter(
    (invoice) => getCategory(invoice.courseName) === "Skill Development",
  );

  const academicInvoices = filteredInvoices.filter(
    (invoice) => getCategory(invoice.courseName) === "Academic",
  );

  const islamicRevenue = islamicInvoices.reduce(
  (sum, invoice) => sum + Number(invoice.paidAmount || 0),
  0
);

const skillRevenue = skillInvoices.reduce(
  (sum, invoice) => sum + Number(invoice.paidAmount || 0),
  0
);

const academicRevenue = academicInvoices.reduce(
  (sum, invoice) => sum + Number(invoice.paidAmount || 0),
  0
);

const totalRevenue =
  islamicRevenue +
  skillRevenue +
  academicRevenue;

  const [showAllIslamic, setShowAllIslamic] = useState(false);
  const [showAllSkill, setShowAllSkill] = useState(false);
  const [showAllAcademic, setShowAllAcademic] = useState(false);

  const InvoiceSection = ({ title, data, showAll, setShowAll }) => {
    const visibleData = showAll ? data : data.slice(0, 2);

    if (data.length === 0) {
      return null;
    }

    return (
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">{title}</h2>

          {data.length > 2 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
            >
              {showAll ? "Show Less" : `View All (${data.length})`}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-3 text-left">Invoice</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleData.map((invoice) => (
                <tr key={invoice._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold">
                    {invoice.invoiceNumber}
                  </td>

                  <td className="px-4 py-4">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4">{invoice.studentName}</td>

                  <td className="px-4 py-4">{invoice.courseName}</td>

                  <td className="px-4 py-4 font-semibold text-emerald-600">
                    ₹{invoice.paidAmount}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {invoice.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-2">
                      {/* EDIT */}

                      <button
                        onClick={() => {
                          if (invoice.status === "Paid") {
                            toast.error("Paid invoices cannot be edited.");

                            return;
                          }

                          navigate("/", {
                            state: invoice,
                          });
                        }}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all

                            ${
                              invoice.status === "Paid"
                                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      {/* DOWNLOAD */}

                      <button
                        onClick={() =>
                          navigate("/", {
                            state: {
                              ...invoice,
                              autoDownload: true,
                            },
                          })
                        }
                        disabled={invoice.status === "Pending"}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all

                            ${
                              invoice.status === "Pending"
                                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                      >
                        <Download size={15} />
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() => handleDeleteInvoice(invoice)}
                        className="flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <Header />

        <div className="pt-28 p-4 lg:p-8 lg:pt-8">
          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Receipt size={24} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Invoice History
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Manage and track student invoices
                  </p>
                </div>
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:w-96">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
  <div className="rounded-2xl bg-green-50 border border-green-200 p-5">
    <p className="text-sm text-green-700">Total Revenue</p>
    <h2 className="mt-2 text-2xl font-bold text-green-800">
      ₹ {totalRevenue}
    </h2>
  </div>

  <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
    <p className="text-sm text-blue-700">Islamic Courses</p>
    <h2 className="mt-2 text-2xl font-bold text-blue-800">
      ₹ {islamicRevenue}
    </h2>
  </div>

  <div className="rounded-2xl bg-purple-50 border border-purple-200 p-5">
    <p className="text-sm text-purple-700">Skill Development</p>
    <h2 className="mt-2 text-2xl font-bold text-purple-800">
      ₹ {skillRevenue}
    </h2>
  </div>

  <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5">
    <p className="text-sm text-orange-700">Academic Classes</p>
    <h2 className="mt-2 text-2xl font-bold text-orange-800">
      ₹ {academicRevenue}
    </h2>
  </div>
</div>

          {/* TABLE CARD */}

          <InvoiceSection
            title="Islamic Courses"
            data={islamicInvoices}
            showAll={showAllIslamic}
            setShowAll={setShowAllIslamic}
          />

          <InvoiceSection
            title="Skill Development"
            data={skillInvoices}
            showAll={showAllSkill}
            setShowAll={setShowAllSkill}
          />

          <InvoiceSection
            title="Academic Classes"
            data={academicInvoices}
            showAll={showAllAcademic}
            setShowAll={setShowAllAcademic}
          />
        </div>
      </main>
    </div>
  );
}

export default InvoiceHistory;
