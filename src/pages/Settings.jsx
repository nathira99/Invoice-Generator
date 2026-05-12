import { useState } from "react";

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

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) => {

    setAdminData({
      ...adminData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSaveSettings = () => {

    Object.entries(adminData)
      .forEach(([key, value]) => {

        localStorage.setItem(
          key,
          value
        );

      });

    alert(
      "Settings saved successfully."
    );

  };

  return (

    <div className="min-h-screen bg-gray-100 lg:flex">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">

        <Header />

        <div className="p-4 lg:p-8">

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">

            {/* HEADER */}

            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Settings
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage institute and invoice settings
                </p>

              </div>

              <div className="rounded-2xl bg-blue-50 px-5 py-4">

                <p className="text-sm text-blue-600">
                  System Status
                </p>

                <h2 className="mt-1 text-2xl font-bold text-blue-900">
                  Active
                </h2>

              </div>

            </div>

            {/* INSTITUTE SETTINGS */}

            <div className="mb-10">

              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Institute Information
              </h2>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* INSTITUTE NAME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Institute Name
                  </label>

                  <input
                    type="text"
                    name="instituteName"
                    value={
                      adminData.instituteName
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputStyle
                    }
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="institutePhone"
                    value={
                      adminData.institutePhone
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputStyle
                    }
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="instituteEmail"
                    value={
                      adminData.instituteEmail
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputStyle
                    }
                  />

                </div>

                {/* ADDRESS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Address
                  </label>

                  <input
                    type="text"
                    name="instituteAddress"
                    value={
                      adminData.instituteAddress
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputStyle
                    }
                  />

                </div>

              </div>

            </div>

            {/* INVOICE SETTINGS */}

            <div className="mb-10">

              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Invoice Settings
              </h2>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* PREFIX */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Invoice Prefix
                  </label>

                  <input
                    type="text"
                    name="invoicePrefix"
                    value={
                      adminData.invoicePrefix
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputStyle
                    }
                  />

                </div>

                {/* CURRENCY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Currency
                  </label>

                  <input
                    type="text"
                    name="currency"
                    value={
                      adminData.currency
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      inputStyle
                    }
                  />

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="mb-10">

              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Invoice Footer
              </h2>

              <textarea
                rows="4"
                name="footerText"
                value={
                  adminData.footerText
                }
                onChange={
                  handleChange
                }
                className={`${inputStyle} resize-none`}
              />

            </div>

            {/* SAVE BUTTON */}

            <div className="flex justify-end">

              <button
                onClick={
                  handleSaveSettings
                }
                className="rounded-2xl bg-blue-700 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-800 hover:shadow-lg"
              >
                Save Settings
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

export default Admin;