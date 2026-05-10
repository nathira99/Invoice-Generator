function InvoicePreview({ invoiceData }) {

  const totalFee = Number(invoiceData.courseFee) || 0;
  const discount = Number(invoiceData.discount) || 0;
  const paidAmount = Number(invoiceData.paidAmount) || 0;

  return (

    <div className="w-full overflow-x-auto">

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

        <div className="flex justify-between items-start">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <img
              src="/logo.png"
              alt="logo"
              className="mt-2 w-16 h-16 object-contain"
            />

            <div>

              <h1 className="text-3xl font-bold text-blue-900">
                Ilmul Jannah
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Online Institute
              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="text-right">

            <h2 className="text-xl font-black tracking-tight">
              INVOICE
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              #{invoiceData.invoiceNumber || "INV-001"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {invoiceData.invoiceDate || "-"}
            </p>

          </div>

        </div>

        {/* LINE */}

        <div className="border-b mt-6"></div>

        {/* ================= DETAILS ================= */}

        <div className="grid grid-cols-2 gap-10 mt-6">

          {/* BILL TO */}

          <div className=" leading-tight">

            <h3 className="text-xs font-bold tracking-wide text-blue-900 uppercase">
              Bill To
            </h3>

            <div className="mt-4 space-y-2">

              <p className="text-sm">
                <span className="font-semibold">
                  Student:
                </span>{" "}
                {invoiceData.studentName || "-"}
              </p>

              <p className="text-[13px]">
                <span className="font-semibold">
                  Contact:
                </span>{" "}
                {invoiceData.contactNumber || "-"}
              </p>

              <p className="text-[13px]">
                <span className="font-semibold">
                  Course:
                </span>{" "}
                {invoiceData.courseName || "-"}
              </p>

              <p className="text-[13px]">
                <span className="font-semibold">
                  Paid Month:
                </span>{" "}
                {invoiceData.paidMonth || "-"}
              </p>

            </div>

          </div>

          {/* APPROVAL */}

          <div className="border-l pl-8">

            <h3 className="text-xs font-bold tracking-wide text-blue-900 uppercase">
              Institute Details
            </h3>

            <div className="mt-3 space-y-2">

              <p className="text-sm">
                <span className="font-semibold">
                  Approved By:
                </span>{" "}
                Islamic Education
              </p>

              <p className="text-[13px]">
                <span className="font-semibold">
                  Approval No:
                </span>{" "}
                IEB/2024/1256
              </p>

              <p className="text-[13px]">
                <span className="font-semibold">
                  Date:
                </span>{" "}
                01/01/2024
              </p>

              <p className="text-[13px]">
                <span className="font-semibold">
                  Valid Until:
                </span>{" "}
                31/12/2026
              </p>

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="mt-8 border rounded-xl overflow-hidden">

          {/* HEADER */}

          <div className="grid grid-cols-6 bg-slate-700 text-white px-5 py-2.5 text-sm font-semibold">

            <p>#</p>

            <p className="col-span-2">
              Description
            </p>

            <p className="text-right">
              Rate
            </p>

            <p className="text-right">
              Discount
            </p>

            <p className="text-right">
              Amount
            </p>

          </div>

          {/* ROW */}

          <div className="grid grid-cols-6 px-5 py-3 border-b items-start">

            <p className="text-sm">
              1
            </p>

            <div className="col-span-2">

              <p className="text-sm font-semibold">
                {invoiceData.courseName || "Course"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {invoiceData.paidMonth || "-"} Month
              </p>

            </div>

            <p className="text-sm text-right">
              Rs. {totalFee}
            </p>

            <p className="text-sm text-right text-red-500">
              - Rs. {discount}
            </p>

            <p className="text-sm text-right font-medium">
              Rs. {paidAmount}
            </p>

          </div>

          {/* TOTAL */}

          <div className="flex justify-end bg-gray-50 px-5 py-3">

            <div className="w-72 flex justify-between items-center">

              <p className="text-lg font-bold">
                Total
              </p>

              <p className="text-lg font-bold text-blue-900">
                Rs. {paidAmount}
              </p>

            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-5 border-t pt-5">

          <div className="grid grid-cols-2 items-center">

            {/* SIGNATURE */}

            <div className="text-center border-r pr-6">

              <img
                src="/signature.jpg"
                alt="signature"
                className="w-28 mx-auto object-contain"
              />

              <div className="border-b w-44 mx-auto mt-1"></div>

              <p className="text-sm font-semibold text-blue-900 mt-2">
                Rahamath Nisa BAIS, B.Sc
              </p>

              <p className="text-xs text-gray-500">
                Founder
              </p>

            </div>

            {/* MESSAGE */}

            <div className="pl-8">

              <h3 className=" text-sm leading-tight font-semibold text-blue-900">
                Thank you for choosing Ilmul Jannah.
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                We appreciate your trust and support.
              </p>

            </div>

          </div>

        </div>

        {/* ================= CONTACT ================= */}

        <div className="border-t mt-5 pt-3 pb-1">

          <h3 className="text-xs font-bold tracking-wider text-blue-900 uppercase text-center">
            Contact Details
          </h3>

          <div className="flex justify-center gap-10 mt-3 text-center">

            {/* PHONE */}

            <div>

              <p className="text-base">
                📞
              </p>

              <p className="text-sm mt-1">
                +92 300 1234567
              </p>

            </div>

            {/* EMAIL */}

            <div>

              <p className="text-base">
                ✉️
              </p>

              <p className="text-sm mt-1">
                info@ilmuljannah.com
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default InvoicePreview;
