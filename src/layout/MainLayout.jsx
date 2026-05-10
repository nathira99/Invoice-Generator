import InvoiceForm from "../components/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview";

function MainLayout({ invoiceData, setInvoiceData }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 lg:flex-row">

  {/* SIDEBAR */}

  <aside className="w-full border-b bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
    Sidebar
  </aside>

  {/* MAIN CONTENT */}

  <main className="min-w-0 flex-1 overflow-auto">

    {/* CONTENT */}

    <div className="m-4 grid grid-cols-1 items-start gap-6 lg:m-8 lg:grid-cols-2 lg:gap-8">

      <InvoiceForm
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
      />

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

export default MainLayout;
