import { useState } from "react";

import {
  Building2,
  Receipt,
  BadgeDollarSign,
  Save,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Admin() {

  const [adminData, setAdminData] =
    useState({

      instituteName:
        localStorage.getItem(
          "instituteName"
        ) || "Ilmul Jannah",

      institutePhone:
        localStorage.getItem(
          "institutePhone"
        ) || "",

      instituteEmail:
        localStorage.getItem(
          "instituteEmail"
        ) || "",

      instituteAddress:
        localStorage.getItem(
          "instituteAddress"
        ) || "",

      invoicePrefix:
        localStorage.getItem(
          "invoicePrefix"
        ) || "INV",

      currency:
        localStorage.getItem(
          "currency"
        ) || "Rs.",

      footerText:
        localStorage.getItem(
          "footerText"
        ) ||
        "Thank you for your payment.",

    });

  const handleChange =
    (e) => {

      setAdminData({
        ...adminData,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleSaveSettings =
    () => {

      Object.entries(
        adminData
      ).forEach(
        ([key, value]) => {

          localStorage.setItem(
            key,
            value
          );

        }
      );

      alert(
        "Settings saved successfully."
      );

    };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (

    <div className="min-h-screen bg-slate-50 lg:flex">

      <Sidebar />

<main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <Header />

        <div className="pt-28 p-4 lg:p-8 lg:pt-8">

          {/* PAGE HEADER */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Admin Settings
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Manage institute preferences and invoice configuration
              </p>

            </div>

            {/* STATUS CARD */}

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">

                <BadgeDollarSign
                  size={24}
                />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  System Status
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Active & Running
                </h2>

              </div>

            </div>

          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* LEFT SIDE */}

            <div className="space-y-6 xl:col-span-2">

              {/* INSTITUTE */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">

                    <Building2
                      size={22}
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Institute Information
                    </h2>

                    <p className="text-sm text-slate-500">
                      Basic institute details and contact information
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Institute Name
                    </label>

                    <input
                      type="text"
                      name="instituteName"
                      value={adminData.instituteName}
                      onChange={handleChange}
                      className={inputStyle}
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="institutePhone"
                      value={adminData.institutePhone}
                      onChange={handleChange}
                      className={inputStyle}
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="instituteEmail"
                      value={adminData.instituteEmail}
                      onChange={handleChange}
                      className={inputStyle}
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address
                    </label>

                    <input
                      type="text"
                      name="instituteAddress"
                      value={adminData.instituteAddress}
                      onChange={handleChange}
                      className={inputStyle}
                    />

                  </div>

                </div>

              </div>

              {/* INVOICE SETTINGS */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">

                    <Receipt
                      size={22}
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Invoice Settings
                    </h2>

                    <p className="text-sm text-slate-500">
                      Configure invoice appearance and defaults
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Invoice Prefix
                    </label>

                    <input
                      type="text"
                      name="invoicePrefix"
                      value={adminData.invoicePrefix}
                      onChange={handleChange}
                      className={inputStyle}
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Currency
                    </label>

                    <input
                      type="text"
                      name="currency"
                      value={adminData.currency}
                      onChange={handleChange}
                      className={inputStyle}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="space-y-6">

              {/* FOOTER */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                  Invoice Footer
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Footer message shown on invoices
                </p>

                <textarea
                  rows="8"
                  name="footerText"
                  value={adminData.footerText}
                  onChange={handleChange}
                  className={`${inputStyle} mt-5 resize-none`}
                />

              </div>

              {/* SAVE */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <button
                  onClick={
                    handleSaveSettings
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
                >

                  <Save
                    size={18}
                  />

                  Save Settings

                </button>

                <p className="mt-4 text-center text-xs font-medium text-slate-400">
                  Changes are stored locally in browser storage
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

export default Admin;