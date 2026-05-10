import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getInvoices, deleteInvoice } from "../utils/localStorage";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState(getInvoices());
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
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
  const handleDeleteInvoice = (index) => {
    const confirmDelete = window.confirm("Delete this invoice?");

    if (!confirmDelete) return;

    deleteInvoice(index);

    setInvoices(getInvoices());
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <Header />

        <div className="m-4 lg:m-8">
          <div className="w-full max-w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
              Invoice History
            </h1>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by student or invoice number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 sm:max-w-md"
              />
            </div>
            {invoices.length === 0 ? (
              <div className="text-gray-500">No invoices found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px]">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-4">Invoice No</th>

                      <th>Student</th>

                      <th>Course</th>

                      <th>Paid</th>

                      <th>Date</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInvoices.map((invoice, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 pr-4">{invoice.invoiceNumber}</td>

                        <td className="pr-4">{invoice.studentName}</td>

                        <td className="pr-4">{invoice.courseName}</td>

                        <td className="pr-4">Rs. {invoice.paidAmount}</td>

                        <td className="pr-4">{invoice.invoiceDate}</td>

                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                navigate("/", {
                                  state: invoice,
                                })
                              }
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                navigate("/", {
                                  state: {
                                    ...invoice,
                                    autoDownload: true,
                                  },
                                })
                              }
                              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(index)}
                              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
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
