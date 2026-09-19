import React, { useState } from "react";

function BulkInvoiceGenerator() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Bulk Invoice Generator
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload your Master Sheet CSV, review the payment details, and
            generate invoices in bulk.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-slate-300">
            <div className="w-full max-w-md text-center">
              <div className="mb-4 text-4xl">📄</div>

              <h2 className="text-lg font-semibold text-slate-800">
                Upload Master Sheet CSV
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Export a course tab from your Master Sheet as CSV and upload
                it here.
              </p>

              <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                Choose CSV File

                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left">
                  <p className="text-sm font-semibold text-emerald-800">
                    File selected
                  </p>

                  <p className="mt-1 break-all text-sm text-emerald-700">
                    {file.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkInvoiceGenerator;