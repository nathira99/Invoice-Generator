function InvoicePreview({ invoiceData }) {
  const totalFee = Number(invoiceData.courseFee) || 0;

  const discount = Number(invoiceData.discount) || 0;

  const paidAmount = Number(invoiceData.paidAmount) || 0;

  const formattedDate = invoiceData.invoiceDate
    ? new Date(invoiceData.invoiceDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  const now = new Date();

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="w-full overflow-x-auto bg-slate-200 p-3 md:p-6 rounded-3xl">
      <div className="flex justify-center min-w-fit">
        <div
        id="invoice-preview"
        className="mx-auto min-w-[640px] overflow-hidden bg-white px-10 py-8 shadow-sm sm:min-w-0"
        style={{
          maxWidth: "220mm",
          width: "100%",
          minHeight: "auto",
        }}
      >
            {/* ================= HEADER ================= */}

            <div className="rounded-[24px] bg-gray-50 px-8 py-7">
              <div className="flex items-start justify-between">
                {/* LEFT */}

                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="mt-5 w-16 h-16 object-contain rounded-full bg-white p-0.5"
                  />

                  <div>
                    <h1 className="mt-1 text-[24px] uppercase font-bold tracking-tight">
                      Ilmul Jannah
                    </h1>

                    <p className="mt-0.25 text-[12px] uppercase tracking-[2px] text-blue-800">
                      Online Institute
                    </p>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="text-right">
                  <h2 className="mt-1 text-[28px] font-black tracking-tight">
                    INVOICE
                  </h2>

                  <p className="mt-0.25 text-xs uppercase tracking-[2px] text-blue-800">
                    Course Fee Receipt
                  </p>

                  <div className="mt-4 space-y-1 justify-center text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">INV No.:</span>{" "}
                      {invoiceData.invoiceNumber || "INV-001"}
                    </p>

                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {formattedDate}
                    </p>

                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {formattedTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DETAILS ================= */}

            <div className="mt-6 grid grid-cols-2 gap-6">
              {/* STUDENT */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#1E3A8A]">
                  Student Details
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-gray-900">
                      Student:
                    </span>{" "}
                    {invoiceData.studentName || "-"}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900">
                      Contact:
                    </span>{" "}
                    {invoiceData.contactNumber || "-"}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900">Course:</span>{" "}
                    {invoiceData.courseName || "-"}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900">
                      Paid Month:
                    </span>{" "}
                    {invoiceData.paidMonth || "-"}
                  </p>
                </div>
              </div>

              {/* INSTITUTE */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#1E3A8A]">
                  Institute Details
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-gray-900">
                      Approved By:
                    </span>{" "}
                    Islamic Education
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900">
                      Approval No:
                    </span>{" "}
                    IEB/2024/1256
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900">
                      Valid Until:
                    </span>{" "}
                    31/12/2026
                  </p>

                  <div className="pt-1">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                      Payment Received
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= TABLE ================= */}

            <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200">
              {/* TABLE HEADER */}

              <div className="grid grid-cols-6 bg-[#243B6B] px-5 py-3 text-sm font-semibold text-white">
                <p>#</p>

                <p className="col-span-2">Description</p>

                <p className="text-right">Rate</p>

                <p className="text-right">Discount</p>

                <p className="text-right">Amount</p>
              </div>

              {/* ROW */}

              <div className="grid grid-cols-6 items-start border-b border-gray-200 px-5 py-4">
                <p className="text-sm text-gray-700">1</p>

                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {invoiceData.courseName || "Course"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {invoiceData.paidMonth || "-"} Payment
                  </p>
                </div>

                <p className="text-right text-sm text-gray-700">
                  Rs. {totalFee}
                </p>

                <p className="text-right text-sm text-red-500">
                  - Rs. {discount}
                </p>

                <p className="text-right text-sm font-semibold text-gray-900">
                  Rs. {paidAmount}
                </p>
              </div>

              {/* TOTAL */}

              <div className="flex justify-end bg-gray-50 px-5 py-4">
                <div className="flex w-72 items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">Total</p>

                  <p className="text-[28px] font-black text-[#1E3A8A]">
                    Rs. {paidAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= FOOTER ================= */}

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 items-center">
                {/* SIGNATURE */}

                <div className="border-r border-gray-200 pr-6 text-center">
                  <img
                    src="/signature.jpg"
                    alt="signature"
                    className="mx-auto w-28 object-contain"
                  />

                  <div className="mx-auto mt-1 w-44 border-b border-gray-300"></div>

                  <p className="mt-2 text-sm font-semibold text-[#1E3A8A]">
                    Rahamath Nisa BAIS, B.Sc
                  </p>

                  <p className="text-xs text-gray-500">Founder</p>
                </div>

                {/* MESSAGE */}

                <div className="pl-8">
                  <h3 className="text-sm font-semibold leading-tight text-[#1E3A8A]">
                    Payment successfully received.
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    This receipt confirms payment for the enrolled online
                    course.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= CONTACT ================= */}

            <div className="mt-5 border-t border-gray-200 pt-4">
              <h3 className="text-center text-xs font-bold uppercase tracking-[2px] text-[#1E3A8A]">
                Contact Details
              </h3>

              <div className="mt-4 flex items-center justify-center gap-10 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E3A8A]">PHONE:</span>

                  <span>+91 63831 16428</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E3A8A]">EMAIL:</span>

                  <span>ilmuljannah@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default InvoicePreview;
