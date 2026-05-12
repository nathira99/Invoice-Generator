import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { getInvoices, deleteInvoice } from "../utils/Storage";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);

  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  const [search, setSearch] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

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

    loadInvoices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.state?.autoDownload) {
      setTimeout(() => {
        const button = document.getElementById("download-pdf-btn");

        if (button) {
          button.click();
        }
      }, 500);
    }
  }, [location.state]);

  const filteredInvoices = invoices.filter((invoice) => {
    return (
      invoice.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDeleteInvoice = async (invoice) => {
    const confirmDelete = window.confirm("Delete this invoice?");

    if (!confirmDelete) return;

    try {
      setIsLoadingInvoices(true);

      await deleteInvoice(invoice._id);

      const invoiceList = await fetchInvoices();

      setInvoices(invoiceList);
    } catch (error) {
      console.error("Failed to delete invoice:", error);

      alert("Unable to delete invoice.");
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-4 lg:p-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Invoice History
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage and track student invoices
                </p>
              </div>

              <input
                type="text"
                placeholder="Search by student or invoice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:w-96"
              />
            </div>

            {/* CONTENT */}

            {isLoadingInvoices ? (
              <div className="py-10 text-center text-gray-500">
                Loading invoices...
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No invoices found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Invoice No
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Student
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Course
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Paid
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInvoices.map((invoice, index) => (
                      <tr
                        key={invoice._id || index}
                        className="rounded-2xl bg-gray-50 transition hover:bg-gray-100"
                      >
                        <td className="rounded-l-2xl px-4 py-5 font-semibold text-gray-800">
                          {invoice.invoiceNumber}
                        </td>

                        <td className="px-4 py-5 text-gray-700">
                          {invoice.studentName}
                        </td>

                        <td className="px-4 py-5 text-gray-700">
                          {invoice.courseName}
                        </td>

                        <td className="px-4 py-5 font-medium text-gray-900">
                          Rs. {invoice.paidAmount}
                        </td>

                        <td className="px-4 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>

                        <td className="px-4 py-5 text-gray-600">
                          {new Date(invoice.invoiceDate).toLocaleDateString(
                            "en-GB",
                          )}
                        </td>

                        <td className="rounded-r-2xl px-4 py-5">
                          <div className="flex flex-wrap gap-2">
                            {/* EDIT */}

                            <button
                              onClick={() => {
                                if (invoice.status === "Paid") {
                                  alert("Paid invoices cannot be edited.");

                                  return;
                                }

                                navigate("/", {
                                  state: invoice,
                                });
                              }}
                              className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                                invoice.status === "Paid"
                                  ? "cursor-not-allowed bg-gray-400"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
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
                              className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                                invoice.status === "Pending"
                                  ? "cursor-not-allowed bg-gray-400"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              Download
                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() => handleDeleteInvoice(invoice)}
                              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InvoiceHistory;
