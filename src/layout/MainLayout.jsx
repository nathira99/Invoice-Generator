import Sidebar from "./Sidebar";
import Header from "./Header";

import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";

function MainLayout({ invoiceData, setInvoiceData }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

  {/* SIDEBAR */}

  <aside className="w-64 bg-white border-r">
    Sidebar
  </aside>

  {/* MAIN CONTENT */}

  <main className="flex-1 overflow-auto">

    {/* TOP BAR */}

    <div className="bg-white border-b px-8 py-4">
      Header
    </div>

    {/* CONTENT */}

    <div className="grid grid-cols-2 gap-8 p-8 items-start">

      <InvoiceForm
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
      />

      <div className="sticky top-8">

        <InvoicePreview
          invoiceData={invoiceData}
        />

      </div>

    </div>

  </main>

</div>
  );
}

export default MainLayout;
