import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  Search,
  Receipt,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import Swal from "sweetalert2";
import {
  useState,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getInvoices,
  deleteInvoice,
} from "../utils/Storage";

function InvoiceHistory() {

  const [invoices, setInvoices] =
    useState([]);

  const [
    isLoadingInvoices,
    setIsLoadingInvoices,
  ] = useState(true);

  const [search, setSearch] =
    useState("");

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const fetchInvoices =
    async () => {

      const invoiceList =
        await getInvoices();

      return Array.isArray(
        invoiceList
      )
        ? invoiceList
        : [];

    };

  useEffect(() => {

    let isMounted = true;

    const loadInvoices =
      async () => {

        try {

          const invoiceList =
            await fetchInvoices();

          if (isMounted) {

            setInvoices(
              invoiceList
            );

          }

        } catch (error) {

          console.error(
            "Failed to load invoices:",
            error
          );

          if (isMounted) {

            setInvoices([]);

          }

        } finally {

          if (isMounted) {

            setIsLoadingInvoices(
              false
            );

          }

        }

      };

    loadInvoices();

    return () => {

      isMounted = false;

    };

  }, []);

  const filteredInvoices =
    invoices.filter(
      (invoice) => {

        return (
          invoice.studentName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          invoice.invoiceNumber
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

      }
    );

  const handleDeleteInvoice =
    async (invoice) => {

      const result =
  await Swal.fire({
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

if (!result.isConfirmed)
  return;

      try {

        setIsLoadingInvoices(
          true
        );

        await deleteInvoice(
          invoice._id
        );

        const invoiceList =
          await fetchInvoices();

        setInvoices(
          invoiceList
        );

      } catch (error) {

        console.error(
          "Failed to delete invoice:",
          error
        );

        toast.error(
          "Unable to delete invoice."
        );

      } finally {

        setIsLoadingInvoices(
          false
        );

      }

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

                  <Receipt
                    size={24}
                  />

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
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* TABLE CARD */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* TABLE HEADER */}

            <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 lg:block">

              <div className="grid grid-cols-[1.1fr_1fr_1fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-4 text-sm font-semibold text-slate-500">

                <p>
                  Invoice No
                </p>

                <p>
                  Student
                </p>

                <p>
                  Course
                </p>

                <p>
                  Amount
                </p>

                <p>
                  Status
                </p>

                <p>
                  Date
                </p>

                <p>
                  Actions
                </p>

              </div>

            </div>

            {/* CONTENT */}

            {isLoadingInvoices ? (

              <div className="py-16 text-center text-sm font-medium text-slate-500">
                Loading invoices...
              </div>

            ) : filteredInvoices.length === 0 ? (

              <div className="py-16 text-center text-sm font-medium text-slate-500">
                No invoices found.
              </div>

            ) : (

              <div>

                {filteredInvoices.map(
                  (
                    invoice,
                    index
                  ) => (

                    <div
                      key={
                        invoice._id ||
                        index
                      }
                      className="border-b border-slate-100 last:border-none"
                    >

                      <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1.1fr_1fr_1fr_0.8fr_0.8fr_0.8fr_1.2fr] lg:items-center">

                        {/* INVOICE */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Invoice
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {
                              invoice.invoiceNumber
                            }
                          </p>

                        </div>

                        {/* STUDENT */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Student
                          </p>

                          <p className="mt-1 font-medium text-slate-700">
                            {
                              invoice.studentName
                            }
                          </p>

                        </div>

                        {/* COURSE */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Course
                          </p>

                          <p className="mt-1 font-medium text-slate-700">
                            {
                              invoice.courseName
                            }
                          </p>

                        </div>

                        {/* AMOUNT */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Amount
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            Rs.{" "}
                            {
                              invoice.paidAmount
                            }
                          </p>

                        </div>

                        {/* STATUS */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold

                            ${
                              invoice.status ===
                              "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >

                            {
                              invoice.status
                            }

                          </span>

                        </div>

                        {/* DATE */}

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                            Date
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-600">

                            {new Date(
                              invoice.invoiceDate
                            ).toLocaleDateString(
  "en-US",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }
)}

                          </p>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap gap-2">

                          {/* EDIT */}

                          <button
                            onClick={() => {

                              if (
                                invoice.status ===
                                "Paid"
                              ) {

                                toast.error(
                                  "Paid invoices cannot be edited."
                                );

                                return;

                              }

                              navigate(
                                "/",
                                {
                                  state:
                                    invoice,
                                }
                              );

                            }}
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all

                            ${
                              invoice.status ===
                              "Paid"
                                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >

                            <Pencil
                              size={15}
                            />

                            Edit

                          </button>

                          {/* DOWNLOAD */}

                          <button
                            onClick={() =>
                              navigate(
                                "/",
                                {
                                  state: {
                                    ...invoice,
                                    autoDownload:
                                      true,
                                  },
                                }
                              )
                            }
                            disabled={
                              invoice.status ===
                              "Pending"
                            }
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all

                            ${
                              invoice.status ===
                              "Pending"
                                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >

                            <Download
                              size={15}
                            />

                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDeleteInvoice(
                                invoice
                              )
                            }
                            className="flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
                          >

                            <Trash2
                              size={15}
                            />

                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </main>

    </div>

  );

}

export default InvoiceHistory;