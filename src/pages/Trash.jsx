import { useEffect, useState } from "react";

import Swal from "sweetalert2";

import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Trash2, ArchiveRestore, TrashIcon } from "lucide-react";

import {
  getTrashedInvoices,
  restoreInvoice,
  permanentlyDeleteInvoice,
} from "../utils/Storage";

function Trash() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    const data = await getTrashedInvoices();

    setInvoices(data);
  };

  const handleRestore = async (id) => {
    await restoreInvoice(id);

    loadTrash();
  };

 const handlePermanentDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Invoice Forever?",
    text: "This invoice will be permanently removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Delete Forever",
    cancelButtonText: "Cancel",
    borderRadius: "20px",
  });

  if (!result.isConfirmed) return;

  try {
    await permanentlyDeleteInvoice(id);

    toast.success("Invoice permanently deleted");

    await loadTrash();
  } catch (error) {
    console.error(error);

    toast.error("Failed to delete invoice");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <Header />

        <div className="p-4 pt-28 lg:p-8 lg:pt-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl bg-red-100 p-4 text-red-600">
              <Trash2 size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Trash</h1>

              <p className="text-slate-500">Deleted invoices</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left">Invoice</th>

                  <th className="px-4 py-3 text-left">Student</th>

                  <th className="px-4 py-3 text-left">Course</th>

                  <th className="px-4 py-3 text-left">Deleted On</th>

                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b">
                    <td className="px-4 py-3">{invoice.invoiceNumber}</td>

                    <td className="px-4 py-3">{invoice.studentName}</td>

                    <td className="px-4 py-3">{invoice.courseName}</td>

                    <td className="px-4 py-3">
                      {new Date(invoice.deletedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="w-min flex items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600">
                          <ArchiveRestore size={16} />
                          Restore
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(invoice._id)}
                          className="w-min flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                            <TrashIcon size={20} />
                          Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Trash;
