import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getInvoices, deleteInvoice } from "../utils/localStorage";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState(getInvoices());
  const [search, setSearch] = useState("");
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-6">Invoice History</h1>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by student or invoice number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-xl px-4 py-3 w-full max-w-md"
              />
            </div>
            {invoices.length === 0 ? (
              <div className="text-gray-500">No invoices found.</div>
            ) : (
              <table className="w-full">
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
                      <td className="py-4">{invoice.invoiceNumber}</td>

                      <td>{invoice.studentName}</td>

                      <td>{invoice.courseName}</td>

                      <td>Rs. {invoice.paidAmount}</td>

                      <td>{invoice.invoiceDate}</td>

                      <td className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() =>
                            navigate("/", {
                              state: invoice,
                            })
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
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
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InvoiceHistory;
